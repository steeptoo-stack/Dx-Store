import React, { createContext, useContext, useState, useEffect } from 'react';
import { StoreSettings, Product, Category, Order, Customer, CartItem, OrderStatus, PaymentStatus, PaymentMethod } from '../types';
import { initialStoreSettings, initialCategories, initialProducts, initialOrders, initialCustomers } from '../data/initialData';

interface AdminUser {
  email: string;
  role: string;
}

interface StoreContextType {
  settings: StoreSettings;
  products: Product[];
  categories: Category[];
  orders: Order[];
  customers: Customer[];
  cart: CartItem[];
  isAdminAuthenticated: boolean;
  adminUser: AdminUser | null;
  adminToken: string | null;
  activeView: string;
  selectedProductId: string | null;
  trackingOrderId: string | null;
  notification: { message: string; type: 'success' | 'error' | 'info' } | null;
  
  // Navigation & UI
  setActiveView: (view: string) => void;
  setSelectedProductId: (id: string | null) => void;
  setTrackingOrderId: (id: string | null) => void;
  showNotification: (message: string, type?: 'success' | 'error' | 'info') => void;
  
  // Cart Actions
  addToCart: (product: Product, quantity?: number) => void;
  removeFromCart: (productId: string) => void;
  updateCartQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  cartTotal: number;
  cartSubtotal: number;
  cartCount: number;

  // Checkout & Order Actions
  placeOrder: (orderData: {
    customerName: string;
    phone: string;
    email: string;
    address: string;
    district: string;
    thana: string;
    notes?: string;
    paymentMethod: PaymentMethod;
    paymentPhoneNumber?: string;
    transactionId?: string;
  }) => Promise<Order>;

  // Admin Actions
  loginAdmin: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  logoutAdmin: () => Promise<void>;
  changeAdminPassword: (currentPassword: string, newPassword: string, confirmNewPassword: string) => Promise<{ success: boolean; error?: string }>;
  uploadProductImage: (file: File) => Promise<{ url: string }>;
  updateSettings: (newSettings: Partial<StoreSettings>) => Promise<void>;
  
  // Products
  addProduct: (product: Omit<Product, 'id'>) => Promise<void>;
  updateProduct: (id: string, product: Partial<Product>) => Promise<void>;
  deleteProduct: (id: string) => Promise<void>;
  duplicateProduct: (id: string) => Promise<void>;

  // Categories
  addCategory: (category: Omit<Category, 'id'>) => Promise<void>;
  updateCategory: (id: string, category: Partial<Category>) => Promise<void>;
  deleteCategory: (id: string) => Promise<void>;

  // Orders
  updateOrderStatus: (orderId: string, status: OrderStatus, note?: string) => Promise<void>;
  updatePaymentStatus: (orderId: string, status: PaymentStatus, note?: string) => Promise<void>;
  
  // Factory Reset
  resetToDefaults: () => Promise<void>;
}

const StoreContext = createContext<StoreContextType | undefined>(undefined);

const LOCAL_STORAGE_KEY = 'dx_security_store_state_v1';
const TOKEN_KEY = 'dx_admin_token';

export const StoreProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [settings, setSettings] = useState<StoreSettings>(() => {
    try {
      const saved = localStorage.getItem(`${LOCAL_STORAGE_KEY}_settings`);
      return saved ? JSON.parse(saved) : initialStoreSettings;
    } catch {
      return initialStoreSettings;
    }
  });

  const [products, setProducts] = useState<Product[]>(() => {
    try {
      const saved = localStorage.getItem(`${LOCAL_STORAGE_KEY}_products`);
      return saved ? JSON.parse(saved) : initialProducts;
    } catch {
      return initialProducts;
    }
  });

  const [categories, setCategories] = useState<Category[]>(() => {
    try {
      const saved = localStorage.getItem(`${LOCAL_STORAGE_KEY}_categories`);
      return saved ? JSON.parse(saved) : initialCategories;
    } catch {
      return initialCategories;
    }
  });

  const [orders, setOrders] = useState<Order[]>(() => {
    try {
      const saved = localStorage.getItem(`${LOCAL_STORAGE_KEY}_orders`);
      return saved ? JSON.parse(saved) : initialOrders;
    } catch {
      return initialOrders;
    }
  });

  const [customers, setCustomers] = useState<Customer[]>(() => {
    try {
      const saved = localStorage.getItem(`${LOCAL_STORAGE_KEY}_customers`);
      return saved ? JSON.parse(saved) : initialCustomers;
    } catch {
      return initialCustomers;
    }
  });

  const [cart, setCart] = useState<CartItem[]>(() => {
    try {
      const saved = localStorage.getItem(`${LOCAL_STORAGE_KEY}_cart`);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [adminToken, setAdminToken] = useState<string | null>(() => {
    try {
      return sessionStorage.getItem(TOKEN_KEY) || localStorage.getItem(TOKEN_KEY) || null;
    } catch {
      return null;
    }
  });

  const [adminUser, setAdminUser] = useState<AdminUser | null>(null);
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState<boolean>(() => {
    try {
      return Boolean(sessionStorage.getItem(TOKEN_KEY) || localStorage.getItem(TOKEN_KEY));
    } catch {
      return false;
    }
  });

  const [activeView, setActiveView] = useState<string>('home');
  const [selectedProductId, setSelectedProductId] = useState<string | null>(null);
  const [trackingOrderId, setTrackingOrderId] = useState<string | null>(null);
  const [notification, setNotification] = useState<{ message: string; type: 'success' | 'error' | 'info' } | null>(null);

  // Sync with Backend Server & Verify Auth Session
  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch('/api/data');
        if (res.ok && res.headers.get('content-type')?.includes('application/json')) {
          const data = await res.json();
          if (data.settings) setSettings(data.settings);
          if (data.products) setProducts(data.products);
          if (data.categories) setCategories(data.categories);
          if (data.orders) setOrders(data.orders);
          if (data.customers) setCustomers(data.customers);
        }
      } catch (err) {
        console.warn('Backend API connection check: using local persistent data.');
      }
    };

    const verifySession = async () => {
      const token = sessionStorage.getItem(TOKEN_KEY) || localStorage.getItem(TOKEN_KEY);
      if (!token) {
        setIsAdminAuthenticated(false);
        setAdminUser(null);
        return;
      }

      try {
        const res = await fetch('/api/auth/verify', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        if (res.ok && res.headers.get('content-type')?.includes('application/json')) {
          const data = await res.json();
          setIsAdminAuthenticated(true);
          setAdminToken(token);
          setAdminUser(data.user);
        } else if (res.status === 401) {
          sessionStorage.removeItem(TOKEN_KEY);
          localStorage.removeItem(TOKEN_KEY);
          setIsAdminAuthenticated(false);
          setAdminToken(null);
          setAdminUser(null);
        } else {
          // Static host (404 on /api/auth/verify): keep session active for authorized client token
          setIsAdminAuthenticated(true);
          setAdminUser({ email: 'admin@dxsecurity.com', role: 'admin' });
        }
      } catch (e) {
        // Network failure / static GitHub Pages: maintain state
        setIsAdminAuthenticated(true);
        setAdminUser({ email: 'admin@dxsecurity.com', role: 'admin' });
      }
    };

    fetchData();
    verifySession();
  }, []);

  // Save to LocalStorage whenever state updates
  useEffect(() => {
    try {
      localStorage.setItem(`${LOCAL_STORAGE_KEY}_settings`, JSON.stringify(settings));
    } catch (e) {
      console.error(e);
    }
  }, [settings]);

  useEffect(() => {
    try {
      localStorage.setItem(`${LOCAL_STORAGE_KEY}_products`, JSON.stringify(products));
    } catch (e) {
      console.error(e);
    }
  }, [products]);

  useEffect(() => {
    try {
      localStorage.setItem(`${LOCAL_STORAGE_KEY}_categories`, JSON.stringify(categories));
    } catch (e) {
      console.error(e);
    }
  }, [categories]);

  useEffect(() => {
    try {
      localStorage.setItem(`${LOCAL_STORAGE_KEY}_orders`, JSON.stringify(orders));
    } catch (e) {
      console.error(e);
    }
  }, [orders]);

  useEffect(() => {
    try {
      localStorage.setItem(`${LOCAL_STORAGE_KEY}_customers`, JSON.stringify(customers));
    } catch (e) {
      console.error(e);
    }
  }, [customers]);

  useEffect(() => {
    try {
      localStorage.setItem(`${LOCAL_STORAGE_KEY}_cart`, JSON.stringify(cart));
    } catch (e) {
      console.error(e);
    }
  }, [cart]);

  // Update dynamic document title from settings
  useEffect(() => {
    if (settings.website?.siteTitle) {
      document.title = settings.website.siteTitle;
    }
  }, [settings.website?.siteTitle]);

  const showNotification = (message: string, type: 'success' | 'error' | 'info' = 'success') => {
    setNotification({ message, type });
    setTimeout(() => {
      setNotification(null);
    }, 4000);
  };

  // Cart operations
  const addToCart = (product: Product, quantity = 1) => {
    setCart(prev => {
      const existing = prev.find(item => item.product.id === product.id);
      if (existing) {
        return prev.map(item =>
          item.product.id === product.id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }
      return [...prev, { product, quantity }];
    });
    showNotification(`Added ${product.name.slice(0, 30)}... to Cart`, 'success');
  };

  const removeFromCart = (productId: string) => {
    setCart(prev => prev.filter(item => item.product.id !== productId));
    showNotification('Item removed from cart', 'info');
  };

  const updateCartQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }
    setCart(prev =>
      prev.map(item =>
        item.product.id === productId ? { ...item, quantity } : item
      )
    );
  };

  const clearCart = () => {
    setCart([]);
  };

  const cartSubtotal = cart.reduce((sum, item) => {
    const itemPrice = item.product.discountPrice ?? item.product.price;
    return sum + itemPrice * item.quantity;
  }, 0);

  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);
  const cartTotal = cartSubtotal;

  // ====================================================
  // SECURE ADMIN AUTHENTICATION
  // ====================================================

  const loginAdmin = async (email: string, password: string): Promise<{ success: boolean; error?: string }> => {
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });

      if (res.ok) {
        const data = await res.json();
        setAdminToken(data.token);
        setAdminUser(data.user);
        setIsAdminAuthenticated(true);

        try {
          sessionStorage.setItem(TOKEN_KEY, data.token);
        } catch (e) {}

        showNotification('Welcome to DX Security Admin Portal', 'success');
        return { success: true };
      }

      if (res.status === 401 || res.status === 429) {
        const data = await res.json().catch(() => ({}));
        const err = data.error || 'Invalid email or password.';
        showNotification(err, 'error');
        return { success: false, error: err };
      }

      // If backend endpoint is 404 (static hosting / GitHub Pages)
      const cleanEmail = email.trim().toLowerCase();
      const validEmail = cleanEmail.includes('admin') || cleanEmail === 'steeptoo@gmail.com';
      const storedPassword = localStorage.getItem('dx_admin_password_static') || 'dxridoy45';

      if (validEmail && password === storedPassword) {
        const staticToken = `static_${Date.now()}`;
        setAdminToken(staticToken);
        setAdminUser({ email: cleanEmail, role: 'admin' });
        setIsAdminAuthenticated(true);
        try {
          sessionStorage.setItem(TOKEN_KEY, staticToken);
        } catch (e) {}
        showNotification('Welcome to DX Security Admin Portal', 'success');
        return { success: true };
      }

      showNotification('Invalid email or password.', 'error');
      return { success: false, error: 'Invalid email or password.' };
    } catch (err: any) {
      // Offline / network failure / static deployment fallback
      const cleanEmail = email.trim().toLowerCase();
      const validEmail = cleanEmail.includes('admin') || cleanEmail === 'steeptoo@gmail.com';
      const storedPassword = localStorage.getItem('dx_admin_password_static') || 'dxridoy45';

      if (validEmail && password === storedPassword) {
        const staticToken = `static_${Date.now()}`;
        setAdminToken(staticToken);
        setAdminUser({ email: cleanEmail, role: 'admin' });
        setIsAdminAuthenticated(true);
        try {
          sessionStorage.setItem(TOKEN_KEY, staticToken);
        } catch (e) {}
        showNotification('Welcome to DX Security Admin Portal', 'success');
        return { success: true };
      }

      const msg = 'Invalid email or password.';
      showNotification(msg, 'error');
      return { success: false, error: msg };
    }
  };

  const logoutAdmin = async () => {
    const token = adminToken || sessionStorage.getItem(TOKEN_KEY);
    if (token) {
      try {
        await fetch('/api/auth/logout', {
          method: 'POST',
          headers: { 'Authorization': `Bearer ${token}` }
        });
      } catch (e) {}
    }

    setAdminToken(null);
    setAdminUser(null);
    setIsAdminAuthenticated(false);

    try {
      sessionStorage.removeItem(TOKEN_KEY);
      localStorage.removeItem(TOKEN_KEY);
    } catch (e) {}

    if (typeof window !== 'undefined') {
      window.history.pushState(null, '', '/admin/login');
    }
    setActiveView('admin-login');
    showNotification('Logged out from Admin Portal', 'info');
  };

  const changeAdminPassword = async (
    currentPassword: string,
    newPassword: string,
    confirmNewPassword: string
  ): Promise<{ success: boolean; error?: string }> => {
    const token = adminToken || sessionStorage.getItem(TOKEN_KEY);
    if (!token) {
      return { success: false, error: 'Unauthorized. Please log in.' };
    }

    try {
      const res = await fetch('/api/auth/change-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ currentPassword, newPassword, confirmNewPassword })
      });

      if (res.ok) {
        showNotification('Password changed successfully.', 'success');
        return { success: true };
      }

      if (res.status === 404) {
        // Static GitHub Pages fallback
        const stored = localStorage.getItem('dx_admin_password_static') || 'dxridoy45';
        if (currentPassword !== stored) {
          const err = 'Current password is incorrect.';
          showNotification(err, 'error');
          return { success: false, error: err };
        }
        localStorage.setItem('dx_admin_password_static', newPassword);
        showNotification('Password changed successfully.', 'success');
        return { success: true };
      }

      const data = await res.json().catch(() => ({}));
      const err = data.error || 'Failed to change password.';
      showNotification(err, 'error');
      return { success: false, error: err };
    } catch (err: any) {
      const stored = localStorage.getItem('dx_admin_password_static') || 'dxridoy45';
      if (currentPassword === stored) {
        localStorage.setItem('dx_admin_password_static', newPassword);
        showNotification('Password changed successfully.', 'success');
        return { success: true };
      }
      const msg = err.message || 'Failed to update password.';
      showNotification(msg, 'error');
      return { success: false, error: msg };
    }
  };

  // ====================================================
  // PRODUCT IMAGE UPLOAD
  // ====================================================

  const uploadProductImage = async (file: File): Promise<{ url: string }> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = async () => {
        try {
          const token = adminToken || sessionStorage.getItem(TOKEN_KEY);
          const res = await fetch('/api/upload', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({
              fileName: file.name,
              fileType: file.type,
              fileData: reader.result
            })
          });

          if (!res.ok) {
            const data = await res.json().catch(() => ({}));
            throw new Error(data.error || 'Image upload failed. Please try again.');
          }

          const data = await res.json();
          resolve({ url: data.url });
        } catch (err) {
          reject(err);
        }
      };
      reader.onerror = () => reject(new Error('Failed to read image file.'));
      reader.readAsDataURL(file);
    });
  };

  // Settings update
  const updateSettings = async (newSettings: Partial<StoreSettings>) => {
    const merged = { ...settings, ...newSettings };
    setSettings(merged);

    try {
      await fetch('/api/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newSettings)
      });
    } catch (err) {}
    showNotification('Settings successfully updated!', 'success');
  };

  // Product Management
  const addProduct = async (productData: Omit<Product, 'id'>) => {
    const newProduct: Product = {
      ...productData,
      id: `prod-${Date.now()}`,
      images: Array.isArray(productData.images) ? productData.images : [],
      mainImage: productData.mainImage || (productData.images && productData.images[0]) || '',
      createdAt: new Date().toISOString()
    };

    setProducts(prev => [newProduct, ...prev]);

    try {
      await fetch('/api/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newProduct)
      });
    } catch (err) {}
    showNotification(`Product "${newProduct.name}" created`, 'success');
  };

  const updateProduct = async (id: string, updatedFields: Partial<Product>) => {
    setProducts(prev =>
      prev.map(p => (p.id === id ? { ...p, ...updatedFields } : p))
    );

    try {
      await fetch(`/api/products/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedFields)
      });
    } catch (err) {}
    showNotification('Product details updated', 'success');
  };

  const deleteProduct = async (id: string) => {
    setProducts(prev => prev.filter(p => p.id !== id));

    try {
      await fetch(`/api/products/${id}`, {
        method: 'DELETE'
      });
    } catch (err) {}
    showNotification('Product deleted', 'info');
  };

  const duplicateProduct = async (id: string) => {
    const source = products.find(p => p.id === id);
    if (!source) return;

    const duplicated: Product = {
      ...source,
      id: `prod-${Date.now()}`,
      name: `${source.name} (Copy)`,
      sku: `${source.sku}-COPY`,
      images: [...(source.images || [])],
      mainImage: source.mainImage,
      createdAt: new Date().toISOString()
    };

    setProducts(prev => [duplicated, ...prev]);

    try {
      await fetch('/api/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(duplicated)
      });
    } catch (err) {}
    showNotification(`Duplicated product created: ${duplicated.name}`, 'success');
  };

  // Category Management
  const addCategory = async (catData: Omit<Category, 'id'>) => {
    const newCat: Category = {
      ...catData,
      id: `cat-${Date.now()}`
    };

    setCategories(prev => [...prev, newCat]);

    try {
      await fetch('/api/categories', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newCat)
      });
    } catch (err) {}
    showNotification(`Category "${newCat.name}" added`, 'success');
  };

  const updateCategory = async (id: string, updatedFields: Partial<Category>) => {
    setCategories(prev =>
      prev.map(c => (c.id === id ? { ...c, ...updatedFields } : c))
    );

    try {
      await fetch(`/api/categories/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedFields)
      });
    } catch (err) {}
    showNotification('Category updated', 'success');
  };

  const deleteCategory = async (id: string) => {
    setCategories(prev => prev.filter(c => c.id !== id));

    try {
      await fetch(`/api/categories/${id}`, {
        method: 'DELETE'
      });
    } catch (err) {}
    showNotification('Category deleted', 'info');
  };

  // Place Order
  const placeOrder = async (orderData: {
    customerName: string;
    phone: string;
    email: string;
    address: string;
    district: string;
    thana: string;
    notes?: string;
    paymentMethod: PaymentMethod;
    paymentPhoneNumber?: string;
    transactionId?: string;
  }): Promise<Order> => {
    const prefix = settings.store?.orderPrefix || 'DXS';
    const randomSuffix = Math.floor(10000 + Math.random() * 90000);
    const orderId = `${prefix}-${randomSuffix}`;

    const isInsideDhaka = orderData.district.toLowerCase().includes('dhaka');
    let deliveryFee = isInsideDhaka
      ? settings.delivery.insideDhakaCharge
      : settings.delivery.outsideDhakaCharge;

    if (
      settings.delivery.freeDeliveryThreshold > 0 &&
      cartSubtotal >= settings.delivery.freeDeliveryThreshold
    ) {
      deliveryFee = 0;
    }

    if (orderData.paymentMethod === 'cod' && settings.payment.codCharge > 0) {
      deliveryFee += settings.payment.codCharge;
    }

    const grandTotal = cartSubtotal + deliveryFee;

    const newOrder: Order = {
      id: orderId,
      customerName: orderData.customerName,
      phone: orderData.phone,
      email: orderData.email,
      address: orderData.address,
      district: orderData.district,
      thana: orderData.thana,
      notes: orderData.notes,
      items: cart.map(item => ({
        productId: item.product.id,
        name: item.product.name,
        price: item.product.discountPrice ?? item.product.price,
        quantity: item.quantity,
        image: item.product.mainImage || (item.product.images && item.product.images[0]) || './placeholder-security.svg',
        sku: item.product.sku
      })),
      subtotal: cartSubtotal,
      deliveryCharge: deliveryFee,
      total: grandTotal,
      paymentMethod: orderData.paymentMethod,
      paymentStatus: 'Pending',
      paymentPhoneNumber: orderData.paymentPhoneNumber,
      transactionId: orderData.transactionId,
      orderStatus: 'Pending',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      timeline: [
        {
          status: 'Order Placed',
          timestamp: new Date().toISOString(),
          note: `Order submitted via website. Payment method: ${orderData.paymentMethod.toUpperCase()}${
            orderData.transactionId ? ` (TrxID: ${orderData.transactionId})` : ''
          }`
        }
      ]
    };

    setOrders(prev => [newOrder, ...prev]);

    setCustomers(prev => {
      const idx = prev.findIndex(c => c.phone === newOrder.phone);
      if (idx >= 0) {
        const updated = [...prev];
        updated[idx] = {
          ...updated[idx],
          ordersCount: updated[idx].ordersCount + 1,
          totalSpent: updated[idx].totalSpent + newOrder.total,
          lastOrderDate: newOrder.createdAt,
          address: newOrder.address
        };
        return updated;
      } else {
        return [
          {
            id: `cust-${Date.now()}`,
            name: newOrder.customerName,
            phone: newOrder.phone,
            email: newOrder.email,
            address: newOrder.address,
            district: newOrder.district,
            ordersCount: 1,
            totalSpent: newOrder.total,
            lastOrderDate: newOrder.createdAt
          },
          ...prev
        ];
      }
    });

    setProducts(prevProducts =>
      prevProducts.map(p => {
        const orderedItem = newOrder.items.find(item => item.productId === p.id);
        if (orderedItem) {
          const newStock = Math.max(0, p.stock - orderedItem.quantity);
          return {
            ...p,
            stock: newStock,
            status: newStock === 0 ? 'out_of_stock' : p.status
          };
        }
        return p;
      })
    );

    try {
      await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newOrder)
      });
    } catch (e) {}

    clearCart();
    return newOrder;
  };

  const updateOrderStatus = async (orderId: string, status: OrderStatus, note?: string) => {
    const timestamp = new Date().toISOString();
    setOrders(prev =>
      prev.map(ord => {
        if (ord.id === orderId) {
          const newTimeline = [
            ...ord.timeline,
            {
              status: `Status changed to ${status}`,
              timestamp,
              note: note || `Order updated to ${status} by admin.`
            }
          ];
          return {
            ...ord,
            orderStatus: status,
            updatedAt: timestamp,
            timeline: newTimeline
          };
        }
        return ord;
      })
    );

    try {
      await fetch(`/api/orders/${orderId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ orderStatus: status })
      });
    } catch (e) {}

    showNotification(`Order ${orderId} marked as ${status}`, 'success');
  };

  const updatePaymentStatus = async (orderId: string, status: PaymentStatus, note?: string) => {
    const timestamp = new Date().toISOString();
    setOrders(prev =>
      prev.map(ord => {
        if (ord.id === orderId) {
          const newTimeline = [
            ...ord.timeline,
            {
              status: `Payment ${status}`,
              timestamp,
              note: note || `Payment verification changed to ${status} by admin verification desk.`
            }
          ];
          return {
            ...ord,
            paymentStatus: status,
            updatedAt: timestamp,
            timeline: newTimeline
          };
        }
        return ord;
      })
    );

    try {
      await fetch(`/api/orders/${orderId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ paymentStatus: status })
      });
    } catch (e) {}

    showNotification(`Payment for ${orderId} updated to ${status}`, 'success');
  };

  const resetToDefaults = async () => {
    setSettings(initialStoreSettings);
    setProducts(initialProducts);
    setCategories(initialCategories);
    setOrders(initialOrders);
    setCustomers(initialCustomers);

    try {
      await fetch('/api/reset', { method: 'POST' });
    } catch (e) {}

    showNotification('System reset to default configurations', 'info');
  };

  return (
    <StoreContext.Provider
      value={{
        settings,
        products,
        categories,
        orders,
        customers,
        cart,
        isAdminAuthenticated,
        adminUser,
        adminToken,
        activeView,
        selectedProductId,
        trackingOrderId,
        notification,
        setActiveView,
        setSelectedProductId,
        setTrackingOrderId,
        showNotification,
        addToCart,
        removeFromCart,
        updateCartQuantity,
        clearCart,
        cartTotal,
        cartSubtotal,
        cartCount,
        placeOrder,
        loginAdmin,
        logoutAdmin,
        changeAdminPassword,
        uploadProductImage,
        updateSettings,
        addProduct,
        updateProduct,
        deleteProduct,
        duplicateProduct,
        addCategory,
        updateCategory,
        deleteCategory,
        updateOrderStatus,
        updatePaymentStatus,
        resetToDefaults
      }}
    >
      {children}
    </StoreContext.Provider>
  );
};

export const useStore = () => {
  const context = useContext(StoreContext);
  if (!context) {
    throw new Error('useStore must be used within a StoreProvider');
  }
  return context;
};
