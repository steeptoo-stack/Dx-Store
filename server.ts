import express from 'express';
import { createServer as createViteServer } from 'vite';
import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import { fileURLToPath } from 'url';
import { initialStoreSettings, initialCategories, initialProducts, initialOrders, initialCustomers } from './src/data/initialData.ts';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PORT = 3000;
const DATA_DIR = path.resolve(__dirname, 'data');
const DATA_FILE = path.join(DATA_DIR, 'store_data.json');
const AUTH_FILE = path.join(DATA_DIR, 'auth.json');
const UPLOADS_DIR = path.resolve(__dirname, 'uploads');
const PRODUCT_UPLOADS_DIR = path.join(UPLOADS_DIR, 'products');

// Ensure data & upload directories exist
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}
if (!fs.existsSync(PRODUCT_UPLOADS_DIR)) {
  fs.mkdirSync(PRODUCT_UPLOADS_DIR, { recursive: true });
}

// In-memory active sessions: token -> { email: string, expiresAt: number }
const activeSessions = new Map<string, { email: string; expiresAt: number }>();

// Failed login attempt tracking for brute-force protection
const failedLoginAttempts = new Map<string, { count: number; lockedUntil: number }>();

// Password hashing utilities using Node.js built-in scrypt
function hashPassword(password: string, salt: string): string {
  return crypto.scryptSync(password, salt, 64).toString('hex');
}

function verifyPassword(password: string, salt: string, storedHash: string): boolean {
  try {
    const computedHash = crypto.scryptSync(password, salt, 64).toString('hex');
    return crypto.timingSafeEqual(Buffer.from(computedHash, 'hex'), Buffer.from(storedHash, 'hex'));
  } catch {
    return false;
  }
}

// Initialize Auth Data with initial password dxridoy45 (hashed with cryptographic salt)
function getAuthData() {
  try {
    if (fs.existsSync(AUTH_FILE)) {
      const raw = fs.readFileSync(AUTH_FILE, 'utf-8');
      return JSON.parse(raw);
    }
  } catch (err) {
    console.error('Error reading auth.json, initializing new auth config:', err);
  }

  // Initial secure credentials
  // Initial Admin password requested: dxridoy45
  const initialPassword = process.env.ADMIN_INITIAL_PASSWORD || 'dxridoy45';
  const salt = crypto.randomBytes(16).toString('hex');
  const passwordHash = hashPassword(initialPassword, salt);

  const initialAuth = {
    adminEmails: ['admin@dxsecurity.com', 'steeptoo@gmail.com'],
    salt,
    passwordHash,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };

  try {
    fs.writeFileSync(AUTH_FILE, JSON.stringify(initialAuth, null, 2), 'utf-8');
  } catch (e) {
    console.error('Failed to write initial auth.json:', e);
  }

  return initialAuth;
}

function saveAuthData(authData: any) {
  try {
    fs.writeFileSync(AUTH_FILE, JSON.stringify(authData, null, 2), 'utf-8');
  } catch (err) {
    console.error('Error writing auth.json:', err);
  }
}

// Session validation middleware
function authenticateAdmin(req: express.Request, res: express.Response, next: express.NextFunction) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Unauthorized. Admin session required.' });
  }

  const token = authHeader.slice(7).trim();
  const session = activeSessions.get(token);

  if (!session || session.expiresAt < Date.now()) {
    if (session) activeSessions.delete(token);
    return res.status(401).json({ error: 'Session expired or invalid. Please log in again.' });
  }

  // Extend session on activity
  session.expiresAt = Date.now() + 7 * 24 * 60 * 60 * 1000;
  (req as any).adminUser = { email: session.email };
  next();
}

// Initialize database with initial values if file doesn't exist
function getStoreData() {
  try {
    if (fs.existsSync(DATA_FILE)) {
      const raw = fs.readFileSync(DATA_FILE, 'utf-8');
      const data = JSON.parse(raw);
      // Remove any plain adminPassword from store data if present
      if (data.settings?.store?.adminPassword) {
        delete data.settings.store.adminPassword;
      }
      return data;
    }
  } catch (err) {
    console.error('Error reading store_data.json, falling back to defaults:', err);
  }

  const defaultData = {
    settings: initialStoreSettings,
    categories: initialCategories,
    products: initialProducts,
    orders: initialOrders,
    customers: initialCustomers
  };
  // Ensure no password in store settings
  if ((defaultData.settings.store as any).adminPassword) {
    delete (defaultData.settings.store as any).adminPassword;
  }
  saveStoreData(defaultData);
  return defaultData;
}

function saveStoreData(data: any) {
  try {
    if (data.settings?.store?.adminPassword) {
      delete data.settings.store.adminPassword;
    }
    fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2), 'utf-8');
  } catch (err) {
    console.error('Error writing store_data.json:', err);
  }
}

async function startServer() {
  // Initialize Auth
  getAuthData();

  const app = express();
  app.use(express.json({ limit: '25mb' }));

  // Serve static files from public & uploaded images from /uploads
  app.use('/uploads', express.static(UPLOADS_DIR));
  app.use(express.static(path.resolve(__dirname, 'public')));

  // --- API HEALTH & DATA ---
  app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', time: new Date().toISOString() });
  });

  // Get all store data (publicly readable for store display)
  app.get('/api/data', (req, res) => {
    const data = getStoreData();
    res.json(data);
  });

  // ====================================================
  // AUTHENTICATION ROUTES (SECURE PROVIDER)
  // ====================================================

  // POST /api/auth/login
  app.post('/api/auth/login', (req, res) => {
    const { email, password } = req.body;
    const clientKey = String(req.ip || req.headers['x-forwarded-for'] || 'client');
    const now = Date.now();

    // Check brute-force lockout
    const attemptInfo = failedLoginAttempts.get(clientKey);
    if (attemptInfo && attemptInfo.lockedUntil > now) {
      const waitSeconds = Math.ceil((attemptInfo.lockedUntil - now) / 1000);
      return res.status(429).json({ 
        error: `Account temporarily locked due to repeated failed attempts. Please wait ${waitSeconds}s.` 
      });
    }

    if (!email || !password || typeof password !== 'string') {
      return res.status(401).json({ error: 'Invalid email or password.' });
    }

    const authData = getAuthData();
    const cleanEmail = String(email).trim().toLowerCase();

    // Check email
    const emailMatches = authData.adminEmails.some(
      (e: string) => e.toLowerCase() === cleanEmail
    ) || cleanEmail === 'admin@dxsecurity.com' || cleanEmail.includes('admin');

    // Helper to register failed attempt
    const registerFailure = () => {
      const current = failedLoginAttempts.get(clientKey) || { count: 0, lockedUntil: 0 };
      current.count += 1;
      if (current.count >= 5) {
        current.lockedUntil = now + 60 * 1000; // 60-second cooldown
        current.count = 0;
      }
      failedLoginAttempts.set(clientKey, current);
    };

    if (!emailMatches) {
      registerFailure();
      return res.status(401).json({ error: 'Invalid email or password.' });
    }

    // Verify Password against cryptographic hash
    const isValidPassword = verifyPassword(password, authData.salt, authData.passwordHash);

    if (!isValidPassword) {
      registerFailure();
      return res.status(401).json({ error: 'Invalid email or password.' });
    }

    // Clear failed attempts upon successful authentication
    failedLoginAttempts.delete(clientKey);

    // Generate secure session token
    const token = crypto.randomBytes(32).toString('hex');
    const expiresAt = Date.now() + 7 * 24 * 60 * 60 * 1000; // 7 days

    activeSessions.set(token, {
      email: cleanEmail,
      expiresAt
    });

    res.json({
      success: true,
      token,
      user: {
        email: cleanEmail,
        role: 'admin'
      }
    });
  });

  // GET /api/auth/verify
  app.get('/api/auth/verify', (req, res) => {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ authenticated: false });
    }

    const token = authHeader.slice(7).trim();
    const session = activeSessions.get(token);

    if (!session || session.expiresAt < Date.now()) {
      if (session) activeSessions.delete(token);
      return res.status(401).json({ authenticated: false });
    }

    res.json({
      authenticated: true,
      user: {
        email: session.email,
        role: 'admin'
      }
    });
  });

  // POST /api/auth/logout
  app.post('/api/auth/logout', (req, res) => {
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith('Bearer ')) {
      const token = authHeader.slice(7).trim();
      activeSessions.delete(token);
    }
    res.json({ success: true });
  });

  // POST /api/auth/change-password
  app.post('/api/auth/change-password', authenticateAdmin, (req, res) => {
    const { currentPassword, newPassword, confirmNewPassword } = req.body;

    if (!currentPassword || !newPassword || !confirmNewPassword) {
      return res.status(400).json({ error: 'All fields are required.' });
    }

    if (newPassword.length < 8) {
      return res.status(400).json({ error: 'New password must be at least 8 characters long.' });
    }

    if (newPassword !== confirmNewPassword) {
      return res.status(400).json({ error: 'New passwords do not match.' });
    }

    const authData = getAuthData();

    // Verify current password
    const isCurrentValid = verifyPassword(currentPassword, authData.salt, authData.passwordHash);
    if (!isCurrentValid) {
      return res.status(400).json({ error: 'Current password is incorrect.' });
    }

    // Generate fresh salt and new hash
    const newSalt = crypto.randomBytes(16).toString('hex');
    const newHash = hashPassword(newPassword, newSalt);

    authData.salt = newSalt;
    authData.passwordHash = newHash;
    authData.updatedAt = new Date().toISOString();
    saveAuthData(authData);

    res.json({ success: true, message: 'Password changed successfully.' });
  });

  // ====================================================
  // PRODUCT IMAGE UPLOAD ROUTES
  // ====================================================

  // POST /api/upload
  // Accepts JSON { fileName, fileType, fileData } where fileData is base64 string
  app.post('/api/upload', authenticateAdmin, (req, res) => {
    try {
      const { fileName, fileType, fileData } = req.body;

      if (!fileData || !fileType) {
        return res.status(400).json({ error: 'Image data is required.' });
      }

      // Format validation
      const allowedMimes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
      const normalizedType = fileType.toLowerCase();

      if (!allowedMimes.includes(normalizedType)) {
        return res.status(400).json({ error: 'Please select a JPG, PNG or WEBP image.' });
      }

      // Clean base64 string and check size (Max 5MB = 5 * 1024 * 1024 bytes)
      const base64Data = fileData.replace(/^data:image\/\w+;base64,/, '');
      const buffer = Buffer.from(base64Data, 'base64');

      if (buffer.length > 5 * 1024 * 1024) {
        return res.status(400).json({ error: 'Image size must be less than 5MB.' });
      }

      // Determine extension
      let ext = 'jpg';
      if (normalizedType.includes('png')) ext = 'png';
      else if (normalizedType.includes('webp')) ext = 'webp';
      else if (normalizedType.includes('jpeg') || normalizedType.includes('jpg')) ext = 'jpg';

      // Generate secure unique filename
      const safeUniqueName = `prod_${Date.now()}_${crypto.randomBytes(6).toString('hex')}.${ext}`;
      const filePath = path.join(PRODUCT_UPLOADS_DIR, safeUniqueName);

      fs.writeFileSync(filePath, buffer);

      const fileUrl = `/uploads/products/${safeUniqueName}`;
      res.json({ success: true, url: fileUrl });
    } catch (err: any) {
      console.error('Image upload failed:', err);
      res.status(500).json({ error: 'Image upload failed. Please try again.' });
    }
  });

  // DELETE /api/upload
  app.delete('/api/upload', authenticateAdmin, (req, res) => {
    try {
      const { url } = req.body;
      if (!url || typeof url !== 'string') {
        return res.status(400).json({ error: 'Image URL is required' });
      }

      if (url.startsWith('/uploads/products/')) {
        const fileName = path.basename(url);
        const filePath = path.join(PRODUCT_UPLOADS_DIR, fileName);
        if (fs.existsSync(filePath)) {
          fs.unlinkSync(filePath);
        }
      }

      res.json({ success: true });
    } catch (err) {
      res.status(500).json({ error: 'Failed to delete image.' });
    }
  });

  // ====================================================
  // STORE DATA & CRUD ROUTES
  // ====================================================

  // Update Settings
  app.post('/api/settings', (req, res) => {
    const data = getStoreData();
    data.settings = { ...data.settings, ...req.body };
    saveStoreData(data);
    res.json({ success: true, settings: data.settings });
  });

  // Product CRUD
  app.post('/api/products', (req, res) => {
    const data = getStoreData();
    const newProduct = {
      ...req.body,
      id: req.body.id || `prod-${Date.now()}`,
      images: Array.isArray(req.body.images) ? req.body.images : [],
      mainImage: req.body.mainImage || (req.body.images && req.body.images[0]) || '',
      createdAt: new Date().toISOString()
    };
    data.products.unshift(newProduct);
    saveStoreData(data);
    res.status(201).json({ success: true, product: newProduct });
  });

  app.put('/api/products/:id', (req, res) => {
    const data = getStoreData();
    const index = data.products.findIndex((p: any) => p.id === req.params.id);
    if (index === -1) {
      return res.status(404).json({ error: 'Product not found' });
    }
    data.products[index] = {
      ...data.products[index],
      ...req.body,
      images: req.body.images !== undefined ? req.body.images : data.products[index].images,
      mainImage: req.body.mainImage !== undefined ? req.body.mainImage : data.products[index].mainImage
    };
    saveStoreData(data);
    res.json({ success: true, product: data.products[index] });
  });

  app.delete('/api/products/:id', (req, res) => {
    const data = getStoreData();
    data.products = data.products.filter((p: any) => p.id !== req.params.id);
    saveStoreData(data);
    res.json({ success: true });
  });

  // Category CRUD
  app.post('/api/categories', (req, res) => {
    const data = getStoreData();
    const newCat = {
      ...req.body,
      id: req.body.id || `cat-${Date.now()}`
    };
    data.categories.push(newCat);
    saveStoreData(data);
    res.status(201).json({ success: true, category: newCat });
  });

  app.put('/api/categories/:id', (req, res) => {
    const data = getStoreData();
    const index = data.categories.findIndex((c: any) => c.id === req.params.id);
    if (index === -1) {
      return res.status(404).json({ error: 'Category not found' });
    }
    data.categories[index] = { ...data.categories[index], ...req.body };
    saveStoreData(data);
    res.json({ success: true, category: data.categories[index] });
  });

  app.delete('/api/categories/:id', (req, res) => {
    const data = getStoreData();
    data.categories = data.categories.filter((c: any) => c.id !== req.params.id);
    saveStoreData(data);
    res.json({ success: true });
  });

  // Orders CRUD
  app.post('/api/orders', (req, res) => {
    const data = getStoreData();
    const order = req.body;
    data.orders.unshift(order);

    // Update customer record
    const existingCustIndex = data.customers.findIndex((c: any) => c.phone === order.phone);
    if (existingCustIndex >= 0) {
      data.customers[existingCustIndex].ordersCount += 1;
      data.customers[existingCustIndex].totalSpent += order.total;
      data.customers[existingCustIndex].lastOrderDate = order.createdAt;
      data.customers[existingCustIndex].address = order.address || data.customers[existingCustIndex].address;
    } else {
      data.customers.unshift({
        id: `cust-${Date.now()}`,
        name: order.customerName,
        phone: order.phone,
        email: order.email || '',
        address: order.address,
        district: order.district,
        ordersCount: 1,
        totalSpent: order.total,
        lastOrderDate: order.createdAt
      });
    }

    saveStoreData(data);
    res.status(201).json({ success: true, order });
  });

  app.put('/api/orders/:id', (req, res) => {
    const data = getStoreData();
    const index = data.orders.findIndex((o: any) => o.id === req.params.id);
    if (index === -1) {
      return res.status(404).json({ error: 'Order not found' });
    }
    data.orders[index] = { ...data.orders[index], ...req.body, updatedAt: new Date().toISOString() };
    saveStoreData(data);
    res.json({ success: true, order: data.orders[index] });
  });

  // Reset to factory defaults
  app.post('/api/reset', (req, res) => {
    const defaultData = {
      settings: initialStoreSettings,
      categories: initialCategories,
      products: initialProducts,
      orders: initialOrders,
      customers: initialCustomers
    };
    if ((defaultData.settings.store as any).adminPassword) {
      delete (defaultData.settings.store as any).adminPassword;
    }
    saveStoreData(defaultData);
    res.json({ success: true, data: defaultData });
  });

  // Vite middleware in dev or static files in production
  const isProduction = process.env.NODE_ENV === 'production';
  if (!isProduction) {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa'
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`DX Security full-stack server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
