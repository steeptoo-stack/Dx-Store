import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { ProductImageManager } from './ProductImageManager';
import { 
  Order, 
  Product, 
  Category, 
  Customer, 
  OrderStatus, 
  PaymentStatus, 
  StoreSettings 
} from '../types';
import { 
  LayoutDashboard, 
  ShoppingBag, 
  Package, 
  FolderTree, 
  Users, 
  CreditCard, 
  Truck, 
  Settings, 
  Globe, 
  FileText, 
  ShieldAlert, 
  Search, 
  Plus, 
  Edit, 
  Trash2, 
  Copy, 
  Check, 
  Printer, 
  ArrowUpRight, 
  DollarSign, 
  AlertTriangle, 
  CheckCircle2, 
  Clock, 
  Save, 
  RefreshCw, 
  Eye, 
  LogOut,
  ChevronRight,
  Layers,
  Sparkles,
  Phone,
  MessageCircle,
  HelpCircle,
  Sliders,
  X
} from 'lucide-react';

interface AdminPanelProps {
  onOpenInvoice: (order: Order) => void;
}

export const AdminPanel: React.FC<AdminPanelProps> = ({ onOpenInvoice }) => {
  const { 
    settings, 
    products, 
    categories, 
    orders, 
    customers, 
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
    resetToDefaults,
    logoutAdmin,
    changeAdminPassword,
    adminToken,
    showNotification
  } = useStore();

  const [activeTab, setActiveTab] = useState<string>('dashboard');
  const currency = settings.store?.currencySymbol || '৳';

  // --- ORDER STATE ---
  const [orderSearch, setOrderSearch] = useState('');
  const [orderStatusFilter, setOrderStatusFilter] = useState<string>('ALL');
  const [orderPaymentFilter, setOrderPaymentFilter] = useState<string>('ALL');
  const [selectedOrderDetails, setSelectedOrderDetails] = useState<Order | null>(null);

  // --- PRODUCT FORM MODAL ---
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [productForm, setProductForm] = useState<Partial<Product>>({});

  // --- CATEGORY FORM MODAL ---
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
  const [categoryForm, setCategoryForm] = useState<Partial<Category>>({});

  // --- CUSTOMER DETAILS MODAL ---
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);

  // --- SETTINGS FORM COPIES ---
  const [paymentSettings, setPaymentSettings] = useState(settings.payment);
  const [storeSettings, setStoreSettings] = useState(settings.store);
  const [contactSettings, setContactSettings] = useState(settings.contact);
  const [deliverySettings, setDeliverySettings] = useState(settings.delivery);
  const [homepageSettings, setHomepageSettings] = useState(settings.homepage);
  const [websiteSettings, setWebsiteSettings] = useState(settings.website);
  const [socialSettings, setSocialSettings] = useState(settings.social);
  const [aboutSettings, setAboutSettings] = useState(settings.about);
  const [policySettings, setPolicySettings] = useState(settings.policies);
  
  // --- PASSWORD CHANGE FORM ---
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordChangeLoading, setPasswordChangeLoading] = useState(false);
  const [passwordChangeError, setPasswordChangeError] = useState<string | null>(null);
  const [passwordChangeSuccess, setPasswordChangeSuccess] = useState<string | null>(null);

  // Keep local setting forms in sync when settings change
  React.useEffect(() => {
    setPaymentSettings(settings.payment);
    setStoreSettings(settings.store);
    setContactSettings(settings.contact);
    setDeliverySettings(settings.delivery);
    setHomepageSettings(settings.homepage);
    setWebsiteSettings(settings.website);
    setSocialSettings(settings.social);
    setAboutSettings(settings.about);
    setPolicySettings(settings.policies);
  }, [settings]);

  // --- DASHBOARD CALCULATIONS ---
  const totalSales = orders
    .filter(o => o.orderStatus !== 'Cancelled')
    .reduce((sum, o) => sum + o.total, 0);

  const todayStr = new Date().toISOString().split('T')[0];
  const todaySales = orders
    .filter(o => o.orderStatus !== 'Cancelled' && o.createdAt.startsWith(todayStr))
    .reduce((sum, o) => sum + o.total, 0);

  const pendingOrders = orders.filter(o => o.orderStatus === 'Pending').length;
  const confirmedOrders = orders.filter(o => o.orderStatus === 'Confirmed').length;
  const deliveredOrders = orders.filter(o => o.orderStatus === 'Delivered').length;
  const cancelledOrders = orders.filter(o => o.orderStatus === 'Cancelled').length;
  const lowStockProducts = products.filter(p => p.stock <= 5);

  // Filtered orders
  const filteredOrders = orders.filter(order => {
    const matchSearch =
      order.id.toLowerCase().includes(orderSearch.toLowerCase()) ||
      order.customerName.toLowerCase().includes(orderSearch.toLowerCase()) ||
      order.phone.includes(orderSearch) ||
      (order.transactionId && order.transactionId.toLowerCase().includes(orderSearch.toLowerCase()));

    const matchStatus = orderStatusFilter === 'ALL' || order.orderStatus === orderStatusFilter;
    const matchPayment = orderPaymentFilter === 'ALL' || order.paymentStatus === orderPaymentFilter;

    return matchSearch && matchStatus && matchPayment;
  });

  // Open product editor
  const handleOpenProductModal = (prod?: Product) => {
    if (prod) {
      setEditingProduct(prod);
      const existingImages = Array.isArray(prod.images) && prod.images.length > 0
        ? [...prod.images]
        : prod.mainImage
        ? [prod.mainImage]
        : [];

      setProductForm({ 
        ...prod,
        images: existingImages,
        mainImage: prod.mainImage || existingImages[0] || ''
      });
    } else {
      setEditingProduct(null);
      setProductForm({
        name: '',
        slug: '',
        category: categories[0]?.name || 'IP Surveillance Cameras',
        price: 5000,
        discountPrice: null,
        stock: 20,
        sku: `DXS-${Math.floor(100 + Math.random() * 900)}`,
        images: [],
        mainImage: '',
        status: 'active',
        isFeatured: true,
        isNewArrival: false,
        isVisible: true,
        shortDescription: 'High resolution security camera with infrared night vision and remote mobile streaming.',
        description: 'Professional grade surveillance camera designed for 24/7 reliability in indoor and outdoor settings across Bangladesh.',
        specifications: [
          { label: 'Resolution', value: '4MP (2560 × 1440)' },
          { label: 'Night Vision', value: '30m Smart IR' },
          { label: 'Housing', value: 'IP67 Weatherproof Metal' }
        ],
        features: ['Full HD Crystal Clear Video', 'Mobile Remote View via Free App', 'POE Single Cable Setup'],
        warranty: '2 Years Official Warranty'
      });
    }
    setIsProductModalOpen(true);
  };

  const handleSaveProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!productForm.name || !productForm.price) {
      showNotification('Product name and price are required', 'error');
      return;
    }

    const currentImages = Array.isArray(productForm.images) ? productForm.images : [];
    const currentMain = productForm.mainImage || currentImages[0] || '';

    const payload = {
      ...productForm,
      images: currentImages,
      mainImage: currentMain
    };

    if (editingProduct) {
      await updateProduct(editingProduct.id, payload);
    } else {
      await addProduct(payload as any);
    }
    setIsProductModalOpen(false);
  };

  // Open Category Modal
  const handleOpenCategoryModal = (cat?: Category) => {
    if (cat) {
      setEditingCategory(cat);
      setCategoryForm({ ...cat });
    } else {
      setEditingCategory(null);
      setCategoryForm({
        name: '',
        slug: '',
        description: '',
        image: 'https://images.unsplash.com/photo-1557597774-9d273605dfa9?auto=format&fit=crop&w=600&q=80',
        isEnabled: true
      });
    }
    setIsCategoryModalOpen(true);
  };

  const handleSaveCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!categoryForm.name) {
      showNotification('Category name is required', 'error');
      return;
    }

    if (editingCategory) {
      await updateCategory(editingCategory.id, categoryForm);
    } else {
      await addCategory(categoryForm as any);
    }
    setIsCategoryModalOpen(false);
  };

  // Settings Save Handlers
  const savePaymentSettings = async () => {
    await updateSettings({ payment: paymentSettings });
  };

  const saveStoreAndContactSettings = async () => {
    await updateSettings({
      store: storeSettings,
      contact: contactSettings,
      social: socialSettings
    });
  };

  const saveDeliverySettings = async () => {
    await updateSettings({ delivery: deliverySettings });
  };

  const saveHomepageSettings = async () => {
    await updateSettings({ homepage: homepageSettings });
  };

  const saveWebsiteAndSeoSettings = async () => {
    await updateSettings({ website: websiteSettings });
  };

  const saveAboutAndPolicies = async () => {
    await updateSettings({
      about: aboutSettings,
      policies: policySettings
    });
  };

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordChangeError(null);
    setPasswordChangeSuccess(null);

    if (!currentPassword) {
      setPasswordChangeError('Current password is required');
      return;
    }
    if (newPassword.length < 8) {
      setPasswordChangeError('New password must be at least 8 characters long');
      return;
    }
    if (newPassword !== confirmPassword) {
      setPasswordChangeError('New password and confirmation do not match');
      return;
    }

    setPasswordChangeLoading(true);
    const res = await changeAdminPassword(currentPassword, newPassword, confirmPassword);
    setPasswordChangeLoading(false);

    if (res.success) {
      setPasswordChangeSuccess('Password changed successfully.');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } else {
      setPasswordChangeError(res.error || 'Failed to update password.');
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col md:flex-row">
      {/* Sidebar Navigation */}
      <aside className="w-full md:w-64 bg-slate-900 border-r border-slate-800 p-4 shrink-0 flex flex-col justify-between">
        <div className="space-y-6">
          {/* Logo / Header */}
          <div className="flex items-center gap-3 px-2 py-2">
            <div className="w-9 h-9 rounded-xl bg-cyan-500/20 border border-cyan-500/40 flex items-center justify-center text-cyan-400 font-black">
              DX
            </div>
            <div>
              <h2 className="text-base font-bold text-white tracking-tight">Admin Console</h2>
              <span className="text-[10px] text-cyan-400 font-mono">DX Security Portal</span>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="space-y-1 text-xs">
            <button
              onClick={() => setActiveTab('dashboard')}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all cursor-pointer ${
                activeTab === 'dashboard'
                  ? 'bg-cyan-500/20 text-cyan-300 font-bold border border-cyan-500/30'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
            >
              <LayoutDashboard className="w-4 h-4" />
              <span>Dashboard Overview</span>
            </button>

            <button
              onClick={() => setActiveTab('orders')}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl transition-all cursor-pointer ${
                activeTab === 'orders'
                  ? 'bg-cyan-500/20 text-cyan-300 font-bold border border-cyan-500/30'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
            >
              <div className="flex items-center gap-3">
                <ShoppingBag className="w-4 h-4" />
                <span>Orders Management</span>
              </div>
              {pendingOrders > 0 && (
                <span className="px-1.5 py-0.5 rounded-full bg-amber-500 text-slate-950 font-bold text-[10px]">
                  {pendingOrders}
                </span>
              )}
            </button>

            <button
              onClick={() => setActiveTab('products')}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all cursor-pointer ${
                activeTab === 'products'
                  ? 'bg-cyan-500/20 text-cyan-300 font-bold border border-cyan-500/30'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
            >
              <Package className="w-4 h-4" />
              <span>Products Catalog</span>
            </button>

            <button
              onClick={() => setActiveTab('categories')}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all cursor-pointer ${
                activeTab === 'categories'
                  ? 'bg-cyan-500/20 text-cyan-300 font-bold border border-cyan-500/30'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
            >
              <FolderTree className="w-4 h-4" />
              <span>Categories</span>
            </button>

            <button
              onClick={() => setActiveTab('customers')}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all cursor-pointer ${
                activeTab === 'customers'
                  ? 'bg-cyan-500/20 text-cyan-300 font-bold border border-cyan-500/30'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
            >
              <Users className="w-4 h-4" />
              <span>Customers List</span>
            </button>

            <div className="pt-3 pb-1 px-3 text-[10px] font-bold text-slate-500 uppercase tracking-widest">
              Store Control & Settings
            </div>

            <button
              onClick={() => setActiveTab('payment')}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all cursor-pointer ${
                activeTab === 'payment'
                  ? 'bg-pink-500/20 text-pink-300 font-bold border border-pink-500/30'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
            >
              <CreditCard className="w-4 h-4 text-pink-400" />
              <span>Payment Settings (bKash/Nagad)</span>
            </button>

            <button
              onClick={() => setActiveTab('delivery')}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all cursor-pointer ${
                activeTab === 'delivery'
                  ? 'bg-cyan-500/20 text-cyan-300 font-bold border border-cyan-500/30'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
            >
              <Truck className="w-4 h-4" />
              <span>Delivery Charges</span>
            </button>

            <button
              onClick={() => setActiveTab('store_contact')}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all cursor-pointer ${
                activeTab === 'store_contact'
                  ? 'bg-cyan-500/20 text-cyan-300 font-bold border border-cyan-500/30'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
            >
              <Settings className="w-4 h-4" />
              <span>Store & Contact Info</span>
            </button>

            <button
              onClick={() => setActiveTab('homepage')}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all cursor-pointer ${
                activeTab === 'homepage'
                  ? 'bg-cyan-500/20 text-cyan-300 font-bold border border-cyan-500/30'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
            >
              <Layers className="w-4 h-4" />
              <span>Homepage & Banners</span>
            </button>

            <button
              onClick={() => setActiveTab('website_seo')}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all cursor-pointer ${
                activeTab === 'website_seo'
                  ? 'bg-cyan-500/20 text-cyan-300 font-bold border border-cyan-500/30'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
            >
              <Globe className="w-4 h-4" />
              <span>SEO & Announcement</span>
            </button>

            <button
              onClick={() => setActiveTab('policies')}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all cursor-pointer ${
                activeTab === 'policies'
                  ? 'bg-cyan-500/20 text-cyan-300 font-bold border border-cyan-500/30'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
            >
              <FileText className="w-4 h-4" />
              <span>Policies & About</span>
            </button>

            <button
              onClick={() => setActiveTab('security')}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all cursor-pointer ${
                activeTab === 'security'
                  ? 'bg-red-500/20 text-red-300 font-bold border border-red-500/30'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
            >
              <ShieldAlert className="w-4 h-4" />
              <span>Admin Security</span>
            </button>
          </nav>
        </div>

        {/* Bottom Actions */}
        <div className="pt-6 border-t border-slate-800 space-y-2">
          <button
            onClick={logoutAdmin}
            className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-xs text-red-400 hover:bg-red-950/40 transition-colors"
          >
            <LogOut className="w-4 h-4" />
            <span>Sign Out of Admin</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 p-4 sm:p-8 overflow-y-auto max-h-screen">
        
        {/* ==================================================== */}
        {/* 1. DASHBOARD OVERVIEW */}
        {/* ==================================================== */}
        {activeTab === 'dashboard' && (
          <div className="space-y-6 animate-in fade-in">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div>
                <h1 className="text-2xl font-black text-white">Dashboard Overview</h1>
                <p className="text-xs text-slate-400">
                  Real-time sales, order verification queue, and inventory alerts
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setActiveTab('payment')}
                  className="px-3.5 py-2 rounded-xl bg-pink-950 border border-pink-700/60 text-pink-300 text-xs font-semibold hover:bg-pink-900 transition-colors flex items-center gap-1.5"
                >
                  <CreditCard className="w-3.5 h-3.5" />
                  <span>bKash Number: {settings.payment.bkashNumber}</span>
                </button>
                <button
                  onClick={() => handleOpenProductModal()}
                  className="px-4 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 text-xs font-bold transition-all flex items-center gap-1.5 shadow-md shadow-cyan-500/20"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add Product</span>
                </button>
              </div>
            </div>

            {/* KPI Cards Grid */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-1">
                <span className="text-xs text-slate-400 font-medium">Total Revenue</span>
                <p className="text-2xl font-black text-cyan-400 font-mono">
                  {currency}{totalSales.toLocaleString()}
                </p>
                <span className="text-[11px] text-slate-500">All completed & active orders</span>
              </div>

              <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-1">
                <span className="text-xs text-slate-400 font-medium">Today's Sales</span>
                <p className="text-2xl font-black text-emerald-400 font-mono">
                  {currency}{todaySales.toLocaleString()}
                </p>
                <span className="text-[11px] text-slate-500">Orders placed today</span>
              </div>

              <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-1">
                <span className="text-xs text-slate-400 font-medium">Pending Verification</span>
                <p className="text-2xl font-black text-amber-400 font-mono">{pendingOrders}</p>
                <span className="text-[11px] text-amber-400/80">Requires admin confirmation</span>
              </div>

              <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-1">
                <span className="text-xs text-slate-400 font-medium">Total Products</span>
                <p className="text-2xl font-black text-white font-mono">{products.length}</p>
                <span className="text-[11px] text-slate-500">
                  {lowStockProducts.length > 0 ? (
                    <span className="text-red-400 font-semibold">{lowStockProducts.length} low stock alerts</span>
                  ) : (
                    'Stock healthy'
                  )}
                </span>
              </div>
            </div>

            {/* Status Statistics */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="p-3 bg-slate-900/60 border border-slate-800 rounded-xl text-center">
                <p className="text-xs text-slate-400">Confirmed Orders</p>
                <p className="text-lg font-bold font-mono text-cyan-300 mt-0.5">{confirmedOrders}</p>
              </div>
              <div className="p-3 bg-slate-900/60 border border-slate-800 rounded-xl text-center">
                <p className="text-xs text-slate-400">Delivered Orders</p>
                <p className="text-lg font-bold font-mono text-emerald-400 mt-0.5">{deliveredOrders}</p>
              </div>
              <div className="p-3 bg-slate-900/60 border border-slate-800 rounded-xl text-center">
                <p className="text-xs text-slate-400">Cancelled Orders</p>
                <p className="text-lg font-bold font-mono text-red-400 mt-0.5">{cancelledOrders}</p>
              </div>
              <div className="p-3 bg-slate-900/60 border border-slate-800 rounded-xl text-center">
                <p className="text-xs text-slate-400">Registered Customers</p>
                <p className="text-lg font-bold font-mono text-purple-400 mt-0.5">{customers.length}</p>
              </div>
            </div>

            {/* Quick Action: Recent Orders Waiting Verification */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-white uppercase tracking-wider">
                  Recent Orders
                </h3>
                <button
                  onClick={() => setActiveTab('orders')}
                  className="text-xs text-cyan-400 hover:underline flex items-center gap-1"
                >
                  <span>View All Orders ({orders.length})</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>

              <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-slate-950 text-slate-400 font-mono uppercase border-b border-slate-800">
                      <tr>
                        <th className="py-3 px-4">Order ID</th>
                        <th className="py-3 px-4">Customer</th>
                        <th className="py-3 px-4">Total</th>
                        <th className="py-3 px-4">Payment Method</th>
                        <th className="py-3 px-4">TrxID</th>
                        <th className="py-3 px-4">Payment Status</th>
                        <th className="py-3 px-4">Order Status</th>
                        <th className="py-3 px-4 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800">
                      {orders.slice(0, 5).map(ord => (
                        <tr key={ord.id} className="hover:bg-slate-800/40">
                          <td className="py-3 px-4 font-mono font-bold text-cyan-400">
                            {ord.id}
                          </td>
                          <td className="py-3 px-4">
                            <p className="font-semibold text-white">{ord.customerName}</p>
                            <p className="text-[11px] text-slate-400 font-mono">{ord.phone}</p>
                          </td>
                          <td className="py-3 px-4 font-mono font-bold text-white">
                            {currency}{ord.total.toLocaleString()}
                          </td>
                          <td className="py-3 px-4 uppercase font-semibold text-slate-300">
                            {ord.paymentMethod}
                          </td>
                          <td className="py-3 px-4 font-mono text-cyan-300">
                            {ord.transactionId || '—'}
                          </td>
                          <td className="py-3 px-4">
                            <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                              ord.paymentStatus === 'Verified'
                                ? 'bg-emerald-950 text-emerald-400 border border-emerald-800'
                                : ord.paymentStatus === 'Rejected'
                                ? 'bg-red-950 text-red-400 border border-red-800'
                                : 'bg-amber-950 text-amber-400 border border-amber-800'
                            }`}>
                              {ord.paymentStatus}
                            </span>
                          </td>
                          <td className="py-3 px-4">
                            <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-slate-800 text-slate-200">
                              {ord.orderStatus}
                            </span>
                          </td>
                          <td className="py-3 px-4 text-right">
                            <button
                              onClick={() => {
                                setSelectedOrderDetails(ord);
                              }}
                              className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-cyan-400 rounded-lg text-xs"
                            >
                              Manage
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            {/* Low stock alerts if any */}
            {lowStockProducts.length > 0 && (
              <div className="p-4 rounded-2xl bg-amber-950/30 border border-amber-800/80 space-y-2">
                <div className="flex items-center gap-2 text-amber-300 font-bold text-xs uppercase tracking-wider">
                  <AlertTriangle className="w-4 h-4" />
                  <span>Low Inventory Warning</span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
                  {lowStockProducts.map(p => (
                    <div key={p.id} className="p-2.5 rounded-xl bg-slate-950/80 border border-slate-800 text-xs flex justify-between items-center">
                      <span className="text-white truncate pr-2">{p.name}</span>
                      <span className="font-mono font-bold text-amber-400 shrink-0">
                        {p.stock} left
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* ==================================================== */}
        {/* 2. ORDERS MANAGEMENT */}
        {/* ==================================================== */}
        {activeTab === 'orders' && (
          <div className="space-y-6 animate-in fade-in">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div>
                <h1 className="text-2xl font-black text-white">Orders Management</h1>
                <p className="text-xs text-slate-400">
                  Inspect manual bKash/Nagad transactions, verify payments, and change shipment status
                </p>
              </div>
            </div>

            {/* Filter and Search Bar */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="relative">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                <input
                  type="text"
                  value={orderSearch}
                  onChange={e => setOrderSearch(e.target.value)}
                  placeholder="Search by Order ID, Phone, Customer, TrxID..."
                  className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-cyan-500"
                />
              </div>

              <div>
                <select
                  value={orderStatusFilter}
                  onChange={e => setOrderStatusFilter(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white focus:outline-none"
                >
                  <option value="ALL">All Order Statuses</option>
                  <option value="Pending">Pending</option>
                  <option value="Confirmed">Confirmed</option>
                  <option value="Processing">Processing</option>
                  <option value="Shipped">Shipped</option>
                  <option value="Delivered">Delivered</option>
                  <option value="Cancelled">Cancelled</option>
                </select>
              </div>

              <div>
                <select
                  value={orderPaymentFilter}
                  onChange={e => setOrderPaymentFilter(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white focus:outline-none"
                >
                  <option value="ALL">All Payment Statuses</option>
                  <option value="Pending">Pending Verification</option>
                  <option value="Verified">Verified</option>
                  <option value="Rejected">Rejected</option>
                </select>
              </div>
            </div>

            {/* Orders Table */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-950 text-slate-400 font-mono uppercase border-b border-slate-800">
                    <tr>
                      <th className="py-3 px-4">Order ID & Date</th>
                      <th className="py-3 px-4">Customer & District</th>
                      <th className="py-3 px-4">Items</th>
                      <th className="py-3 px-4">Total</th>
                      <th className="py-3 px-4">Payment Details</th>
                      <th className="py-3 px-4">Payment Status</th>
                      <th className="py-3 px-4">Order Status</th>
                      <th className="py-3 px-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800">
                    {filteredOrders.length === 0 ? (
                      <tr>
                        <td colSpan={8} className="py-8 text-center text-slate-500">
                          No matching orders found
                        </td>
                      </tr>
                    ) : (
                      filteredOrders.map(ord => (
                        <tr key={ord.id} className="hover:bg-slate-800/40">
                          <td className="py-3 px-4">
                            <span className="font-mono font-bold text-cyan-400 block">{ord.id}</span>
                            <span className="text-[10px] text-slate-500 font-mono">
                              {new Date(ord.createdAt).toLocaleDateString()}
                            </span>
                          </td>

                          <td className="py-3 px-4">
                            <p className="font-semibold text-white">{ord.customerName}</p>
                            <p className="text-[11px] text-slate-400 font-mono">{ord.phone}</p>
                            <span className="text-[10px] text-slate-500">{ord.district}</span>
                          </td>

                          <td className="py-3 px-4 text-slate-300">
                            {ord.items.length} {ord.items.length === 1 ? 'item' : 'items'}
                          </td>

                          <td className="py-3 px-4 font-mono font-bold text-white">
                            {currency}{ord.total.toLocaleString()}
                          </td>

                          <td className="py-3 px-4">
                            <div className="space-y-0.5">
                              <span className="font-semibold text-slate-200 uppercase text-[11px] block">
                                {ord.paymentMethod}
                              </span>
                              {ord.transactionId ? (
                                <span className="font-mono text-cyan-300 text-[11px] block font-bold">
                                  Trx: {ord.transactionId}
                                </span>
                              ) : null}
                              {ord.paymentPhoneNumber && (
                                <span className="text-slate-400 font-mono text-[10px] block">
                                  From: {ord.paymentPhoneNumber}
                                </span>
                              )}
                            </div>
                          </td>

                          <td className="py-3 px-4">
                            <select
                              value={ord.paymentStatus}
                              onChange={e => updatePaymentStatus(ord.id, e.target.value as PaymentStatus)}
                              className={`text-[11px] font-bold px-2 py-1 rounded-lg border focus:outline-none ${
                                ord.paymentStatus === 'Verified'
                                  ? 'bg-emerald-950 text-emerald-300 border-emerald-800'
                                  : ord.paymentStatus === 'Rejected'
                                  ? 'bg-red-950 text-red-300 border-red-800'
                                  : 'bg-amber-950 text-amber-300 border-amber-800'
                              }`}
                            >
                              <option value="Pending">Pending</option>
                              <option value="Verified">Verified</option>
                              <option value="Rejected">Rejected</option>
                            </select>
                          </td>

                          <td className="py-3 px-4">
                            <select
                              value={ord.orderStatus}
                              onChange={e => updateOrderStatus(ord.id, e.target.value as OrderStatus)}
                              className="text-[11px] font-semibold px-2 py-1 rounded-lg bg-slate-950 border border-slate-700 text-slate-200 focus:outline-none"
                            >
                              <option value="Pending">Pending</option>
                              <option value="Confirmed">Confirmed</option>
                              <option value="Processing">Processing</option>
                              <option value="Shipped">Shipped</option>
                              <option value="Delivered">Delivered</option>
                              <option value="Cancelled">Cancelled</option>
                            </select>
                          </td>

                          <td className="py-3 px-4 text-right space-x-1">
                            <button
                              onClick={() => setSelectedOrderDetails(ord)}
                              className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors"
                              title="View Order Details"
                            >
                              <Eye className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => onOpenInvoice(ord)}
                              className="p-1.5 rounded-lg bg-cyan-950 hover:bg-cyan-900 text-cyan-300 border border-cyan-800/80 transition-colors"
                              title="Print Invoice"
                            >
                              <Printer className="w-3.5 h-3.5" />
                            </button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* ==================================================== */}
        {/* 3. PRODUCTS MANAGEMENT */}
        {/* ==================================================== */}
        {activeTab === 'products' && (
          <div className="space-y-6 animate-in fade-in">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div>
                <h1 className="text-2xl font-black text-white">Product Catalog Management</h1>
                <p className="text-xs text-slate-400">
                  Add, update, duplicate, and adjust prices/stock without touching code
                </p>
              </div>

              <button
                onClick={() => handleOpenProductModal()}
                className="px-4 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 text-xs font-bold transition-all flex items-center gap-2 shadow-lg shadow-cyan-500/20"
              >
                <Plus className="w-4 h-4" />
                <span>Add New Security Product</span>
              </button>
            </div>

            {/* Products Grid / Table */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-950 text-slate-400 font-mono uppercase border-b border-slate-800">
                    <tr>
                      <th className="py-3 px-4">Product</th>
                      <th className="py-3 px-4">Category</th>
                      <th className="py-3 px-4">SKU</th>
                      <th className="py-3 px-4">Price</th>
                      <th className="py-3 px-4">Discount</th>
                      <th className="py-3 px-4">Stock</th>
                      <th className="py-3 px-4">Status</th>
                      <th className="py-3 px-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800">
                    {products.map(prod => (
                      <tr key={prod.id} className="hover:bg-slate-800/40">
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-3">
                            <img
                              src={prod.mainImage || (prod.images && prod.images[0]) || './placeholder-security.svg'}
                              alt={prod.name}
                              className="w-10 h-10 object-cover rounded-lg border border-slate-800 shrink-0"
                              onError={(e) => {
                                (e.target as HTMLImageElement).src = './placeholder-security.svg';
                              }}
                            />
                            <div className="min-w-0">
                              <p className="font-semibold text-white truncate max-w-xs">{prod.name}</p>
                              <div className="flex items-center gap-1.5 mt-0.5">
                                {prod.isFeatured && (
                                  <span className="text-[9px] bg-amber-950 text-amber-400 px-1.5 py-0.2 rounded">Featured</span>
                                )}
                                {prod.isNewArrival && (
                                  <span className="text-[9px] bg-cyan-950 text-cyan-400 px-1.5 py-0.2 rounded">New</span>
                                )}
                              </div>
                            </div>
                          </div>
                        </td>

                        <td className="py-3 px-4 text-slate-300">{prod.category}</td>
                        <td className="py-3 px-4 font-mono text-slate-400">{prod.sku}</td>

                        <td className="py-3 px-4 font-mono text-white font-semibold">
                          {currency}{prod.price.toLocaleString()}
                        </td>

                        <td className="py-3 px-4 font-mono text-cyan-400">
                          {prod.discountPrice ? `${currency}${prod.discountPrice.toLocaleString()}` : '—'}
                        </td>

                        <td className="py-3 px-4">
                          <span className={`font-mono font-bold ${
                            prod.stock <= 5 ? 'text-amber-400' : 'text-emerald-400'
                          }`}>
                            {prod.stock}
                          </span>
                        </td>

                        <td className="py-3 px-4">
                          <span className={`px-2 py-0.5 rounded text-[10px] font-semibold ${
                            prod.status === 'active'
                              ? 'bg-emerald-950 text-emerald-400 border border-emerald-800'
                              : 'bg-slate-800 text-slate-400'
                          }`}>
                            {prod.status}
                          </span>
                        </td>

                        <td className="py-3 px-4 text-right space-x-1">
                          <button
                            onClick={() => handleOpenProductModal(prod)}
                            className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 transition-colors"
                            title="Edit Product"
                          >
                            <Edit className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => duplicateProduct(prod.id)}
                            className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-cyan-400 transition-colors"
                            title="Duplicate Product"
                          >
                            <Copy className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => {
                              if (confirm(`Delete ${prod.name}?`)) {
                                deleteProduct(prod.id);
                              }
                            }}
                            className="p-1.5 rounded-lg bg-slate-800 hover:bg-red-950 text-red-400 transition-colors"
                            title="Delete Product"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* ==================================================== */}
        {/* 4. CATEGORIES MANAGEMENT */}
        {/* ==================================================== */}
        {activeTab === 'categories' && (
          <div className="space-y-6 animate-in fade-in">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div>
                <h1 className="text-2xl font-black text-white">Categories Management</h1>
                <p className="text-xs text-slate-400">
                  Organize security hardware categories, banner images, and display visibility
                </p>
              </div>

              <button
                onClick={() => handleOpenCategoryModal()}
                className="px-4 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 text-xs font-bold transition-all flex items-center gap-2 shadow-lg shadow-cyan-500/20"
              >
                <Plus className="w-4 h-4" />
                <span>Add Category</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {categories.map(cat => (
                <div key={cat.id} className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-3">
                  <div className="aspect-[2/1] rounded-xl overflow-hidden bg-slate-950 border border-slate-800">
                    <img src={cat.image} alt={cat.name} className="w-full h-full object-cover" />
                  </div>

                  <div>
                    <div className="flex items-center justify-between">
                      <h3 className="font-bold text-white text-sm">{cat.name}</h3>
                      <span className={`px-2 py-0.5 rounded text-[10px] font-semibold ${
                        cat.isEnabled ? 'bg-emerald-950 text-emerald-400' : 'bg-slate-800 text-slate-400'
                      }`}>
                        {cat.isEnabled ? 'Active' : 'Disabled'}
                      </span>
                    </div>
                    <p className="text-xs text-slate-400 mt-1 line-clamp-2">{cat.description}</p>
                  </div>

                  <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-800">
                    <button
                      onClick={() => handleOpenCategoryModal(cat)}
                      className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs text-slate-200 transition-colors"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => {
                        if (confirm(`Delete category ${cat.name}?`)) {
                          deleteCategory(cat.id);
                        }
                      }}
                      className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-red-950 text-xs text-red-400 transition-colors"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ==================================================== */}
        {/* 5. CUSTOMERS LIST */}
        {/* ==================================================== */}
        {activeTab === 'customers' && (
          <div className="space-y-6 animate-in fade-in">
            <div>
              <h1 className="text-2xl font-black text-white">Customers Directory</h1>
              <p className="text-xs text-slate-400">
                Track loyal buyers, order counts, and lifetime expenditure
              </p>
            </div>

            <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-950 text-slate-400 font-mono uppercase border-b border-slate-800">
                    <tr>
                      <th className="py-3 px-4">Customer Name</th>
                      <th className="py-3 px-4">Phone Number</th>
                      <th className="py-3 px-4">Email</th>
                      <th className="py-3 px-4">District / Address</th>
                      <th className="py-3 px-4">Orders Count</th>
                      <th className="py-3 px-4">Total Spent</th>
                      <th className="py-3 px-4">Last Order</th>
                      <th className="py-3 px-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800">
                    {customers.map(c => (
                      <tr key={c.id} className="hover:bg-slate-800/40">
                        <td className="py-3 px-4 font-semibold text-white">{c.name}</td>
                        <td className="py-3 px-4 font-mono text-cyan-300">{c.phone}</td>
                        <td className="py-3 px-4 text-slate-400">{c.email || '—'}</td>
                        <td className="py-3 px-4 text-slate-300 max-w-xs truncate">{c.address || c.district}</td>
                        <td className="py-3 px-4 font-mono font-bold text-white">{c.ordersCount}</td>
                        <td className="py-3 px-4 font-mono font-bold text-emerald-400">
                          {currency}{c.totalSpent.toLocaleString()}
                        </td>
                        <td className="py-3 px-4 font-mono text-slate-400 text-[11px]">
                          {c.lastOrderDate ? new Date(c.lastOrderDate).toLocaleDateString() : '—'}
                        </td>
                        <td className="py-3 px-4 text-right">
                          <button
                            onClick={() => setSelectedCustomer(c)}
                            className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-cyan-400 text-xs"
                          >
                            History
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* ==================================================== */}
        {/* 6. PAYMENT SETTINGS (CRITICAL REQUIREMENT) */}
        {/* ==================================================== */}
        {activeTab === 'payment' && (
          <div className="space-y-6 animate-in fade-in max-w-4xl">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div>
                <h1 className="text-2xl font-black text-white">Payment Settings</h1>
                <p className="text-xs text-slate-400">
                  Update bKash number, Nagad number, COD toggles, and checkout instructions in real time
                </p>
              </div>

              <button
                onClick={savePaymentSettings}
                className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-400 hover:to-blue-400 text-slate-950 font-bold text-xs shadow-lg shadow-cyan-500/20 flex items-center gap-2 cursor-pointer"
              >
                <Save className="w-4 h-4" />
                <span>Save Payment Changes</span>
              </button>
            </div>

            <div className="p-4 bg-cyan-950/30 border border-cyan-800/80 rounded-2xl text-xs text-cyan-200 flex items-start gap-2.5">
              <Sparkles className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
              <span>
                <strong>Live Sync:</strong> Any number or instruction you update here immediately appears on the customer checkout page. No code editing or redeployments required!
              </span>
            </div>

            {/* bKash Configuration Card */}
            <div className="p-6 rounded-2xl bg-slate-900 border border-pink-500/30 space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-pink-600/20 flex items-center justify-center text-pink-400 font-black">
                    ৳
                  </div>
                  <div>
                    <h3 className="font-bold text-white text-sm">bKash Manual Payment Settings</h3>
                    <p className="text-[11px] text-pink-300">Send Money / Manual Transfer</p>
                  </div>
                </div>

                <label className="flex items-center gap-2 cursor-pointer">
                  <span className="text-xs text-slate-300">Enable bKash</span>
                  <input
                    type="checkbox"
                    checked={paymentSettings.bkashEnabled}
                    onChange={e => setPaymentSettings({ ...paymentSettings, bkashEnabled: e.target.checked })}
                    className="w-4 h-4 text-pink-500 rounded bg-slate-950 border-slate-700"
                  />
                </label>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    bKash Personal / Payment Number <span className="text-pink-400">*</span>
                  </label>
                  <input
                    type="text"
                    value={paymentSettings.bkashNumber}
                    onChange={e => setPaymentSettings({ ...paymentSettings, bkashNumber: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-sm font-mono text-white focus:outline-none focus:ring-1 focus:ring-pink-500"
                    placeholder="01761861680"
                  />
                  <p className="text-[10px] text-slate-500 mt-1">Default: 01761861680</p>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    bKash Payment Type Label
                  </label>
                  <input
                    type="text"
                    value={paymentSettings.bkashType}
                    onChange={e => setPaymentSettings({ ...paymentSettings, bkashType: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-sm text-white focus:outline-none focus:ring-1 focus:ring-pink-500"
                    placeholder="Manual Payment / Send Money"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  bKash Payment Instructions shown to Customer
                </label>
                <textarea
                  rows={4}
                  value={paymentSettings.bkashInstructions}
                  onChange={e => setPaymentSettings({ ...paymentSettings, bkashInstructions: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:ring-1 focus:ring-pink-500"
                />
              </div>
            </div>

            {/* Nagad Configuration Card */}
            <div className="p-6 rounded-2xl bg-slate-900 border border-orange-500/30 space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-orange-600/20 flex items-center justify-center text-orange-400 font-black">
                    ৳
                  </div>
                  <div>
                    <h3 className="font-bold text-white text-sm">Nagad Payment Settings</h3>
                    <p className="text-[11px] text-orange-300">Configurable Nagad Account</p>
                  </div>
                </div>

                <label className="flex items-center gap-2 cursor-pointer">
                  <span className="text-xs text-slate-300">Enable Nagad</span>
                  <input
                    type="checkbox"
                    checked={paymentSettings.nagadEnabled}
                    onChange={e => setPaymentSettings({ ...paymentSettings, nagadEnabled: e.target.checked })}
                    className="w-4 h-4 text-orange-500 rounded bg-slate-950 border-slate-700"
                  />
                </label>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Nagad Number (Default: Not configured)
                  </label>
                  <input
                    type="text"
                    value={paymentSettings.nagadNumber}
                    onChange={e => setPaymentSettings({ ...paymentSettings, nagadNumber: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-sm font-mono text-white focus:outline-none focus:ring-1 focus:ring-orange-500"
                    placeholder="Enter Nagad number or keep 'Not configured'"
                  />
                  <p className="text-[10px] text-slate-500 mt-1">
                    If set to "Not configured", customers will see that Nagad is currently awaiting setup.
                  </p>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Nagad Payment Type Label
                  </label>
                  <input
                    type="text"
                    value={paymentSettings.nagadType}
                    onChange={e => setPaymentSettings({ ...paymentSettings, nagadType: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-sm text-white focus:outline-none focus:ring-1 focus:ring-orange-500"
                    placeholder="Manual Payment / Send Money"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Nagad Payment Instructions
                </label>
                <textarea
                  rows={3}
                  value={paymentSettings.nagadInstructions}
                  onChange={e => setPaymentSettings({ ...paymentSettings, nagadInstructions: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:ring-1 focus:ring-orange-500"
                />
              </div>
            </div>

            {/* Cash on Delivery Configuration Card */}
            <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                <div className="flex items-center gap-2">
                  <Truck className="w-5 h-5 text-emerald-400" />
                  <h3 className="font-bold text-white text-sm">Cash on Delivery (COD)</h3>
                </div>

                <label className="flex items-center gap-2 cursor-pointer">
                  <span className="text-xs text-slate-300">Enable Cash on Delivery</span>
                  <input
                    type="checkbox"
                    checked={paymentSettings.codEnabled}
                    onChange={e => setPaymentSettings({ ...paymentSettings, codEnabled: e.target.checked })}
                    className="w-4 h-4 text-emerald-500 rounded bg-slate-950 border-slate-700"
                  />
                </label>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Extra COD Handling Charge ({currency})
                  </label>
                  <input
                    type="number"
                    value={paymentSettings.codCharge}
                    onChange={e => setPaymentSettings({ ...paymentSettings, codCharge: Number(e.target.value) })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-sm font-mono text-white focus:outline-none"
                  />
                  <p className="text-[10px] text-slate-500 mt-1">Set to 0 for standard free COD handling.</p>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Minimum Order Amount for Checkout ({currency})
                  </label>
                  <input
                    type="number"
                    value={paymentSettings.minOrderAmount}
                    onChange={e => setPaymentSettings({ ...paymentSettings, minOrderAmount: Number(e.target.value) })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-sm font-mono text-white focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Cash on Delivery Customer Instructions
                </label>
                <input
                  type="text"
                  value={paymentSettings.codInstructions}
                  onChange={e => setPaymentSettings({ ...paymentSettings, codInstructions: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none"
                />
              </div>
            </div>

            <div className="pt-2">
              <button
                onClick={savePaymentSettings}
                className="w-full py-3.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-400 hover:to-blue-400 text-slate-950 font-bold text-sm shadow-xl shadow-cyan-500/25 flex items-center justify-center gap-2 cursor-pointer"
              >
                <Save className="w-4 h-4" />
                <span>Save All Payment Settings</span>
              </button>
            </div>
          </div>
        )}

        {/* ==================================================== */}
        {/* 7. STORE & CONTACT INFORMATION */}
        {/* ==================================================== */}
        {activeTab === 'store_contact' && (
          <div className="space-y-6 animate-in fade-in max-w-4xl">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div>
                <h1 className="text-2xl font-black text-white">Store & Contact Settings</h1>
                <p className="text-xs text-slate-400">
                  Manage store name, phone numbers, WhatsApp, physical address, and social links
                </p>
              </div>

              <button
                onClick={saveStoreAndContactSettings}
                className="px-6 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs shadow-lg shadow-cyan-500/20 flex items-center gap-2 cursor-pointer"
              >
                <Save className="w-4 h-4" />
                <span>Save Store Changes</span>
              </button>
            </div>

            {/* Store Identity */}
            <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
              <h3 className="font-bold text-white text-sm border-b border-slate-800 pb-2">
                Store Identity
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Store Name
                  </label>
                  <input
                    type="text"
                    value={storeSettings.name}
                    onChange={e => setStoreSettings({ ...storeSettings, name: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-sm text-white focus:outline-none"
                    placeholder="DX Security"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Tagline
                  </label>
                  <input
                    type="text"
                    value={storeSettings.tagline}
                    onChange={e => setStoreSettings({ ...storeSettings, tagline: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-sm text-white focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Currency Symbol
                  </label>
                  <input
                    type="text"
                    value={storeSettings.currencySymbol}
                    onChange={e => setStoreSettings({ ...storeSettings, currencySymbol: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-sm font-mono text-white focus:outline-none"
                    placeholder="৳"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Order ID Prefix
                  </label>
                  <input
                    type="text"
                    value={storeSettings.orderPrefix}
                    onChange={e => setStoreSettings({ ...storeSettings, orderPrefix: e.target.value.toUpperCase() })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-sm font-mono text-white focus:outline-none"
                    placeholder="DXS"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Store Description
                </label>
                <textarea
                  rows={2}
                  value={storeSettings.description}
                  onChange={e => setStoreSettings({ ...storeSettings, description: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none"
                />
              </div>
            </div>

            {/* Contact Details */}
            <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
              <h3 className="font-bold text-white text-sm border-b border-slate-800 pb-2">
                Hotline & Official Contact Information
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Customer Hotline / Phone
                  </label>
                  <input
                    type="text"
                    value={contactSettings.phone}
                    onChange={e => setContactSettings({ ...contactSettings, phone: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-sm font-mono text-white focus:outline-none"
                    placeholder="01761861680"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    WhatsApp Number
                  </label>
                  <input
                    type="text"
                    value={contactSettings.whatsapp}
                    onChange={e => setContactSettings({ ...contactSettings, whatsapp: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-sm font-mono text-white focus:outline-none"
                    placeholder="01761861680"
                  />
                  <p className="text-[10px] text-slate-500 mt-1">Default: 01761861680 (+8801761861680)</p>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Official Store Email
                  </label>
                  <input
                    type="text"
                    value={contactSettings.email}
                    onChange={e => setContactSettings({ ...contactSettings, email: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-sm text-white focus:outline-none"
                    placeholder="Not configured"
                  />
                  <p className="text-[10px] text-slate-500 mt-1">Default: Not configured</p>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Physical Store Address
                </label>
                <input
                  type="text"
                  value={contactSettings.address}
                  onChange={e => setContactSettings({ ...contactSettings, address: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Business Operating Hours
                </label>
                <input
                  type="text"
                  value={contactSettings.businessHours}
                  onChange={e => setContactSettings({ ...contactSettings, businessHours: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Customer Support Consultation Message
                </label>
                <input
                  type="text"
                  value={contactSettings.supportMessage}
                  onChange={e => setContactSettings({ ...contactSettings, supportMessage: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none"
                />
              </div>
            </div>

            {/* Social Media */}
            <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
              <h3 className="font-bold text-white text-sm border-b border-slate-800 pb-2">
                Social Media Channels
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Facebook Page URL
                  </label>
                  <input
                    type="text"
                    value={socialSettings.facebookUrl}
                    onChange={e => setSocialSettings({ ...socialSettings, facebookUrl: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    YouTube Channel URL
                  </label>
                  <input
                    type="text"
                    value={socialSettings.youtubeUrl}
                    onChange={e => setSocialSettings({ ...socialSettings, youtubeUrl: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none"
                  />
                </div>
              </div>
            </div>

            <button
              onClick={saveStoreAndContactSettings}
              className="w-full py-3.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-sm shadow-lg shadow-cyan-500/25 flex items-center justify-center gap-2 cursor-pointer"
            >
              <Save className="w-4 h-4" />
              <span>Save Store Information</span>
            </button>
          </div>
        )}

        {/* ==================================================== */}
        {/* 8. DELIVERY CHARGES SETTINGS */}
        {/* ==================================================== */}
        {activeTab === 'delivery' && (
          <div className="space-y-6 animate-in fade-in max-w-4xl">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div>
                <h1 className="text-2xl font-black text-white">Delivery Charges & Policy</h1>
                <p className="text-xs text-slate-400">
                  Configure Dhaka Metro delivery charge, outside districts shipping rate, and free shipping threshold
                </p>
              </div>

              <button
                onClick={saveDeliverySettings}
                className="px-6 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs shadow-lg shadow-cyan-500/20 flex items-center gap-2 cursor-pointer"
              >
                <Save className="w-4 h-4" />
                <span>Save Delivery Charges</span>
              </button>
            </div>

            <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Inside Dhaka Fee ({currency})
                  </label>
                  <input
                    type="number"
                    value={deliverySettings.insideDhakaCharge}
                    onChange={e => setDeliverySettings({ ...deliverySettings, insideDhakaCharge: Number(e.target.value) })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-sm font-mono text-white focus:outline-none"
                  />
                  <p className="text-[10px] text-slate-500 mt-1">Default: 80</p>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Outside Dhaka Fee ({currency})
                  </label>
                  <input
                    type="number"
                    value={deliverySettings.outsideDhakaCharge}
                    onChange={e => setDeliverySettings({ ...deliverySettings, outsideDhakaCharge: Number(e.target.value) })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-sm font-mono text-white focus:outline-none"
                  />
                  <p className="text-[10px] text-slate-500 mt-1">Default: 150</p>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Free Delivery Threshold ({currency})
                  </label>
                  <input
                    type="number"
                    value={deliverySettings.freeDeliveryThreshold}
                    onChange={e => setDeliverySettings({ ...deliverySettings, freeDeliveryThreshold: Number(e.target.value) })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-sm font-mono text-white focus:outline-none"
                  />
                  <p className="text-[10px] text-slate-500 mt-1">Orders above this receive 0 shipping</p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Estimated Delivery Time (Inside Dhaka)
                  </label>
                  <input
                    type="text"
                    value={deliverySettings.estimatedDeliveryInside}
                    onChange={e => setDeliverySettings({ ...deliverySettings, estimatedDeliveryInside: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Estimated Delivery Time (Outside Dhaka)
                  </label>
                  <input
                    type="text"
                    value={deliverySettings.estimatedDeliveryOutside}
                    onChange={e => setDeliverySettings({ ...deliverySettings, estimatedDeliveryOutside: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Delivery Packaging & Warranty Instructions
                </label>
                <input
                  type="text"
                  value={deliverySettings.deliveryInstructions}
                  onChange={e => setDeliverySettings({ ...deliverySettings, deliveryInstructions: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none"
                />
              </div>
            </div>

            <button
              onClick={saveDeliverySettings}
              className="w-full py-3.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-sm shadow-lg shadow-cyan-500/25 flex items-center justify-center gap-2 cursor-pointer"
            >
              <Save className="w-4 h-4" />
              <span>Save Delivery Settings</span>
            </button>
          </div>
        )}

        {/* ==================================================== */}
        {/* 9. HOMEPAGE & BANNER MANAGEMENT */}
        {/* ==================================================== */}
        {activeTab === 'homepage' && (
          <div className="space-y-6 animate-in fade-in max-w-4xl">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div>
                <h1 className="text-2xl font-black text-white">Homepage & Banner Settings</h1>
                <p className="text-xs text-slate-400">
                  Update hero headlines, promotional banners, button links, and section visibility
                </p>
              </div>

              <button
                onClick={saveHomepageSettings}
                className="px-6 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs shadow-lg shadow-cyan-500/20 flex items-center gap-2 cursor-pointer"
              >
                <Save className="w-4 h-4" />
                <span>Save Homepage</span>
              </button>
            </div>

            {/* Hero Section */}
            <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
              <h3 className="font-bold text-white text-sm border-b border-slate-800 pb-2">
                Hero Section Configuration
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Hero Badge Text
                  </label>
                  <input
                    type="text"
                    value={homepageSettings.heroBadge}
                    onChange={e => setHomepageSettings({ ...homepageSettings, heroBadge: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Hero CTA Button Text
                  </label>
                  <input
                    type="text"
                    value={homepageSettings.heroBtnText}
                    onChange={e => setHomepageSettings({ ...homepageSettings, heroBtnText: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Hero Title
                </label>
                <input
                  type="text"
                  value={homepageSettings.heroTitle}
                  onChange={e => setHomepageSettings({ ...homepageSettings, heroTitle: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-sm font-bold text-white focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Hero Subtitle
                </label>
                <textarea
                  rows={2}
                  value={homepageSettings.heroSubtitle}
                  onChange={e => setHomepageSettings({ ...homepageSettings, heroSubtitle: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Hero Image URL
                </label>
                <input
                  type="text"
                  value={homepageSettings.heroImage}
                  onChange={e => setHomepageSettings({ ...homepageSettings, heroImage: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none font-mono"
                />
              </div>
            </div>

            {/* Promotional Banner */}
            <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
              <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                <h3 className="font-bold text-white text-sm">Promotional Package Banner</h3>
                <label className="flex items-center gap-2 cursor-pointer">
                  <span className="text-xs text-slate-300">Banner Enabled</span>
                  <input
                    type="checkbox"
                    checked={homepageSettings.bannerEnabled}
                    onChange={e => setHomepageSettings({ ...homepageSettings, bannerEnabled: e.target.checked })}
                    className="w-4 h-4 text-cyan-500 rounded bg-slate-950 border-slate-700"
                  />
                </label>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Banner Title
                  </label>
                  <input
                    type="text"
                    value={homepageSettings.bannerTitle}
                    onChange={e => setHomepageSettings({ ...homepageSettings, bannerTitle: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none font-bold"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Banner Button Text
                  </label>
                  <input
                    type="text"
                    value={homepageSettings.bannerBtnText}
                    onChange={e => setHomepageSettings({ ...homepageSettings, bannerBtnText: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Banner Subtitle / Description
                </label>
                <input
                  type="text"
                  value={homepageSettings.bannerSubtitle}
                  onChange={e => setHomepageSettings({ ...homepageSettings, bannerSubtitle: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Banner Image URL
                </label>
                <input
                  type="text"
                  value={homepageSettings.bannerImage}
                  onChange={e => setHomepageSettings({ ...homepageSettings, bannerImage: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none font-mono"
                />
              </div>
            </div>

            <button
              onClick={saveHomepageSettings}
              className="w-full py-3.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-sm shadow-lg shadow-cyan-500/25 flex items-center justify-center gap-2 cursor-pointer"
            >
              <Save className="w-4 h-4" />
              <span>Save Homepage Configuration</span>
            </button>
          </div>
        )}

        {/* ==================================================== */}
        {/* 10. SEO & ANNOUNCEMENT BAR SETTINGS */}
        {/* ==================================================== */}
        {activeTab === 'website_seo' && (
          <div className="space-y-6 animate-in fade-in max-w-4xl">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div>
                <h1 className="text-2xl font-black text-white">SEO & Announcement Settings</h1>
                <p className="text-xs text-slate-400">
                  Manage website announcement banner, meta descriptions, and footer credits
                </p>
              </div>

              <button
                onClick={saveWebsiteAndSeoSettings}
                className="px-6 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs shadow-lg shadow-cyan-500/20 flex items-center gap-2 cursor-pointer"
              >
                <Save className="w-4 h-4" />
                <span>Save Website Settings</span>
              </button>
            </div>

            {/* Announcement Bar */}
            <div className="p-6 rounded-2xl bg-slate-900 border border-cyan-500/30 space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                <div>
                  <h3 className="font-bold text-white text-sm">Top Announcement Bar</h3>
                  <p className="text-[11px] text-cyan-400">Highlight nationwide cash on delivery or hotlines</p>
                </div>

                <label className="flex items-center gap-2 cursor-pointer">
                  <span className="text-xs text-slate-300">Show Announcement</span>
                  <input
                    type="checkbox"
                    checked={websiteSettings.announcementBarEnabled}
                    onChange={e => setWebsiteSettings({ ...websiteSettings, announcementBarEnabled: e.target.checked })}
                    className="w-4 h-4 text-cyan-500 rounded bg-slate-950 border-slate-700"
                  />
                </label>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Announcement Bar Text
                </label>
                <input
                  type="text"
                  value={websiteSettings.announcementBarText}
                  onChange={e => setWebsiteSettings({ ...websiteSettings, announcementBarText: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none"
                  placeholder="🚚 সারাদেশে Cash on Delivery Available"
                />
              </div>
            </div>

            {/* SEO Metadata */}
            <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
              <h3 className="font-bold text-white text-sm border-b border-slate-800 pb-2">
                SEO Search Engine Tags
              </h3>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Website Title (Browser Tab)
                </label>
                <input
                  type="text"
                  value={websiteSettings.siteTitle}
                  onChange={e => setWebsiteSettings({ ...websiteSettings, siteTitle: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-sm text-white focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Meta Description
                </label>
                <textarea
                  rows={2}
                  value={websiteSettings.metaDescription}
                  onChange={e => setWebsiteSettings({ ...websiteSettings, metaDescription: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Footer Copyright Text
                </label>
                <input
                  type="text"
                  value={websiteSettings.copyrightText}
                  onChange={e => setWebsiteSettings({ ...websiteSettings, copyrightText: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none"
                />
              </div>
            </div>

            <button
              onClick={saveWebsiteAndSeoSettings}
              className="w-full py-3.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-sm shadow-lg shadow-cyan-500/25 flex items-center justify-center gap-2 cursor-pointer"
            >
              <Save className="w-4 h-4" />
              <span>Save All Website Settings</span>
            </button>
          </div>
        )}

        {/* ==================================================== */}
        {/* 11. POLICIES & ABOUT EDITING */}
        {/* ==================================================== */}
        {activeTab === 'policies' && (
          <div className="space-y-6 animate-in fade-in max-w-4xl">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div>
                <h1 className="text-2xl font-black text-white">Policies & About Page Content</h1>
                <p className="text-xs text-slate-400">
                  Directly edit Privacy Policy, Terms & Conditions, Return & Refund Policy, and Delivery Guidelines
                </p>
              </div>

              <button
                onClick={saveAboutAndPolicies}
                className="px-6 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs shadow-lg shadow-cyan-500/20 flex items-center gap-2 cursor-pointer"
              >
                <Save className="w-4 h-4" />
                <span>Save Policies</span>
              </button>
            </div>

            <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
              <h3 className="font-bold text-white text-sm border-b border-slate-800 pb-2">
                About Company & Mission
              </h3>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  About Title
                </label>
                <input
                  type="text"
                  value={aboutSettings.title}
                  onChange={e => setAboutSettings({ ...aboutSettings, title: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-sm text-white focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  About Story / Description
                </label>
                <textarea
                  rows={3}
                  value={aboutSettings.description}
                  onChange={e => setAboutSettings({ ...aboutSettings, description: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none"
                />
              </div>
            </div>

            {/* Individual Policies */}
            <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
              <h3 className="font-bold text-white text-sm border-b border-slate-800 pb-2">
                Legal & Customer Policies
              </h3>

              <div>
                <label className="block text-xs font-semibold text-cyan-400 mb-1 uppercase tracking-wider">
                  Return & Replacement Policy
                </label>
                <textarea
                  rows={4}
                  value={policySettings.returnAndRefundPolicy}
                  onChange={e => setPolicySettings({ ...policySettings, returnAndRefundPolicy: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-cyan-400 mb-1 uppercase tracking-wider">
                  Delivery & Courier Guidelines
                </label>
                <textarea
                  rows={4}
                  value={policySettings.deliveryPolicy}
                  onChange={e => setPolicySettings({ ...policySettings, deliveryPolicy: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-cyan-400 mb-1 uppercase tracking-wider">
                  Terms & Conditions
                </label>
                <textarea
                  rows={4}
                  value={policySettings.termsAndConditions}
                  onChange={e => setPolicySettings({ ...policySettings, termsAndConditions: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-cyan-400 mb-1 uppercase tracking-wider">
                  Privacy Policy
                </label>
                <textarea
                  rows={4}
                  value={policySettings.privacyPolicy}
                  onChange={e => setPolicySettings({ ...policySettings, privacyPolicy: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none font-mono"
                />
              </div>
            </div>

            <button
              onClick={saveAboutAndPolicies}
              className="w-full py-3.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-sm shadow-lg shadow-cyan-500/25 flex items-center justify-center gap-2 cursor-pointer"
            >
              <Save className="w-4 h-4" />
              <span>Save Policies Content</span>
            </button>
          </div>
        )}

        {/* ==================================================== */}
        {/* 12. ADMIN SECURITY & PASSWORD */}
        {/* ==================================================== */}
        {activeTab === 'security' && (
          <div className="space-y-6 animate-in fade-in max-w-xl">
            <div>
              <h1 className="text-2xl font-black text-white">Admin Security Settings</h1>
              <p className="text-xs text-slate-400">
                Change your Admin access password or reset data if needed
              </p>
            </div>

            <form onSubmit={handlePasswordChange} className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
              <h3 className="font-bold text-white text-sm border-b border-slate-800 pb-2">
                Change Admin Login Password
              </h3>

              {passwordChangeError && (
                <div className="p-3 rounded-xl bg-red-950/60 border border-red-800 text-xs text-red-200 flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 text-red-400 shrink-0" />
                  <span>{passwordChangeError}</span>
                </div>
              )}

              {passwordChangeSuccess && (
                <div className="p-3 rounded-xl bg-emerald-950/60 border border-emerald-800 text-xs text-emerald-200 flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>{passwordChangeSuccess}</span>
                </div>
              )}

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Current Password
                </label>
                <input
                  type="password"
                  value={currentPassword}
                  onChange={e => setCurrentPassword(e.target.value)}
                  placeholder="Enter your current password"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-sm text-white focus:outline-none focus:ring-1 focus:ring-cyan-500"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  New Password (Minimum 8 characters)
                </label>
                <input
                  type="password"
                  value={newPassword}
                  onChange={e => setNewPassword(e.target.value)}
                  placeholder="Enter new secure password"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-sm text-white focus:outline-none focus:ring-1 focus:ring-cyan-500"
                  minLength={8}
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Confirm New Password
                </label>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={e => setConfirmPassword(e.target.value)}
                  placeholder="Confirm new secure password"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-sm text-white focus:outline-none focus:ring-1 focus:ring-cyan-500"
                  minLength={8}
                  required
                />
              </div>

              <button
                type="submit"
                disabled={passwordChangeLoading}
                className="w-full py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs shadow-md transition-all cursor-pointer disabled:opacity-50 flex items-center justify-center gap-2"
              >
                <span>{passwordChangeLoading ? 'Updating Password...' : 'Save New Password'}</span>
              </button>
            </form>

            <div className="p-6 rounded-2xl bg-red-950/20 border border-red-900/60 space-y-3">
              <h3 className="font-bold text-red-400 text-sm">System Factory Reset</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Reset all settings, sample products, orders, and payment numbers to default initial states (bKash: 01761861680, Nagad: Not configured).
              </p>
              <button
                type="button"
                onClick={() => {
                  if (confirm('Are you sure you want to reset everything to initial defaults?')) {
                    resetToDefaults();
                  }
                }}
                className="px-4 py-2 rounded-xl bg-red-900 hover:bg-red-800 text-red-200 text-xs font-bold transition-colors cursor-pointer"
              >
                Reset to Factory Defaults
              </button>
            </div>
          </div>
        )}

      </main>

      {/* ==================================================== */}
      {/* PRODUCT ADD / EDIT MODAL */}
      {/* ==================================================== */}
      {isProductModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 animate-in fade-in">
          <div className="relative w-full max-w-3xl bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
            <div className="flex items-center justify-between p-4 sm:p-6 border-b border-slate-800 bg-slate-950/70">
              <h2 className="text-base font-bold text-white">
                {editingProduct ? 'Edit Product Details' : 'Add New Security Product'}
              </h2>
              <button
                onClick={() => setIsProductModalOpen(false)}
                className="p-2 text-slate-400 hover:text-white rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveProduct} className="p-4 sm:p-6 overflow-y-auto space-y-4 flex-1">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Product Name <span className="text-red-400">*</span>
                </label>
                <input
                  type="text"
                  value={productForm.name || ''}
                  onChange={e => setProductForm({ ...productForm, name: e.target.value })}
                  placeholder="e.g. Hikvision 4MP ColorVu Bullet IP Camera"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-sm text-white focus:outline-none"
                  required
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Category <span className="text-red-400">*</span>
                  </label>
                  <select
                    value={productForm.category || categories[0]?.name}
                    onChange={e => setProductForm({ ...productForm, category: e.target.value })}
                    className="w-full px-3 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none"
                  >
                    {categories.map(c => (
                      <option key={c.id} value={c.name}>{c.name}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Regular Price ({currency}) <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="number"
                    value={productForm.price || ''}
                    onChange={e => setProductForm({ ...productForm, price: Number(e.target.value) })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs font-mono text-white focus:outline-none"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Discount Price ({currency})
                  </label>
                  <input
                    type="number"
                    value={productForm.discountPrice || ''}
                    onChange={e => setProductForm({ ...productForm, discountPrice: e.target.value ? Number(e.target.value) : null })}
                    placeholder="Leave empty if no discount"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs font-mono text-white focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Stock Units <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="number"
                    value={productForm.stock ?? 10}
                    onChange={e => setProductForm({ ...productForm, stock: Number(e.target.value) })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs font-mono text-white focus:outline-none"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    SKU Code
                  </label>
                  <input
                    type="text"
                    value={productForm.sku || ''}
                    onChange={e => setProductForm({ ...productForm, sku: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs font-mono text-white focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Warranty Statement
                  </label>
                  <input
                    type="text"
                    value={productForm.warranty || '2 Years Official Warranty'}
                    onChange={e => setProductForm({ ...productForm, warranty: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none"
                  />
                </div>
              </div>

              {/* Product Images Management */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Product Images & Gallery (Upload from device, preview, set main, remove, reorder)
                </label>
                <ProductImageManager
                  images={productForm.images || []}
                  mainImage={productForm.mainImage || ''}
                  onChange={(updatedImages, updatedMain) => {
                    setProductForm(prev => ({
                      ...prev,
                      images: updatedImages,
                      mainImage: updatedMain
                    }));
                  }}
                  token={adminToken}
                />
              </div>

              {/* Short Description */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Short Description
                </label>
                <textarea
                  rows={2}
                  value={productForm.shortDescription || ''}
                  onChange={e => setProductForm({ ...productForm, shortDescription: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none"
                />
              </div>

              {/* Full Description */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Full Technical Description
                </label>
                <textarea
                  rows={3}
                  value={productForm.description || ''}
                  onChange={e => setProductForm({ ...productForm, description: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none"
                />
              </div>

              {/* Visibility & Badges Toggles */}
              <div className="flex flex-wrap items-center gap-6 pt-2 border-t border-slate-800">
                <label className="flex items-center gap-2 cursor-pointer text-xs text-slate-300">
                  <input
                    type="checkbox"
                    checked={productForm.isFeatured || false}
                    onChange={e => setProductForm({ ...productForm, isFeatured: e.target.checked })}
                    className="w-4 h-4 text-cyan-500 rounded bg-slate-950 border-slate-700"
                  />
                  <span>Mark Featured Product</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer text-xs text-slate-300">
                  <input
                    type="checkbox"
                    checked={productForm.isNewArrival || false}
                    onChange={e => setProductForm({ ...productForm, isNewArrival: e.target.checked })}
                    className="w-4 h-4 text-cyan-500 rounded bg-slate-950 border-slate-700"
                  />
                  <span>Mark New Arrival</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer text-xs text-slate-300">
                  <input
                    type="checkbox"
                    checked={productForm.isVisible ?? true}
                    onChange={e => setProductForm({ ...productForm, isVisible: e.target.checked })}
                    className="w-4 h-4 text-cyan-500 rounded bg-slate-950 border-slate-700"
                  />
                  <span>Product Visible in Store</span>
                </label>
              </div>

              <div className="pt-4 border-t border-slate-800 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsProductModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl bg-slate-800 text-slate-300 text-xs font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 text-xs font-bold transition-all shadow-md"
                >
                  Save Product
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ==================================================== */}
      {/* CATEGORY ADD / EDIT MODAL */}
      {/* ==================================================== */}
      {isCategoryModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 animate-in fade-in">
          <div className="relative w-full max-w-lg bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl overflow-hidden p-6 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h2 className="text-base font-bold text-white">
                {editingCategory ? 'Edit Category' : 'Add New Category'}
              </h2>
              <button onClick={() => setIsCategoryModalOpen(false)} className="p-1 text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveCategory} className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-slate-300 mb-1">Category Name</label>
                <input
                  type="text"
                  value={categoryForm.name || ''}
                  onChange={e => setCategoryForm({ ...categoryForm, name: e.target.value })}
                  placeholder="e.g. Smart Alarm Systems"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-sm text-white focus:outline-none"
                  required
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-300 mb-1">Description</label>
                <textarea
                  rows={2}
                  value={categoryForm.description || ''}
                  onChange={e => setCategoryForm({ ...categoryForm, description: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-300 mb-1">Banner Image URL</label>
                <input
                  type="text"
                  value={categoryForm.image || ''}
                  onChange={e => setCategoryForm({ ...categoryForm, image: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 font-mono text-white focus:outline-none"
                />
              </div>

              <label className="flex items-center gap-2 cursor-pointer pt-2">
                <input
                  type="checkbox"
                  checked={categoryForm.isEnabled ?? true}
                  onChange={e => setCategoryForm({ ...categoryForm, isEnabled: e.target.checked })}
                  className="w-4 h-4 text-cyan-500 rounded bg-slate-950 border-slate-700"
                />
                <span className="text-slate-300 font-medium">Category Enabled in Navigation</span>
              </label>

              <div className="pt-4 border-t border-slate-800 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsCategoryModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold"
                >
                  Save Category
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ==================================================== */}
      {/* ORDER DETAILS MODAL */}
      {/* ==================================================== */}
      {selectedOrderDetails && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 animate-in fade-in">
          <div className="relative w-full max-w-2xl bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
            <div className="flex items-center justify-between p-4 sm:p-6 border-b border-slate-800 bg-slate-950/70">
              <div>
                <span className="text-xs text-cyan-400 font-mono font-bold block">
                  ORDER DETAILS
                </span>
                <h2 className="text-lg font-bold text-white font-mono">{selectedOrderDetails.id}</h2>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    const ord = selectedOrderDetails;
                    setSelectedOrderDetails(null);
                    onOpenInvoice(ord);
                  }}
                  className="px-3 py-1.5 rounded-lg bg-cyan-500 text-slate-950 text-xs font-bold flex items-center gap-1.5"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span>Invoice</span>
                </button>
                <button
                  onClick={() => setSelectedOrderDetails(null)}
                  className="p-1.5 text-slate-400 hover:text-white"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            <div className="p-6 overflow-y-auto space-y-5 text-xs">
              {/* Customer & Address */}
              <div className="grid grid-cols-2 gap-4 p-4 rounded-xl bg-slate-950 border border-slate-800">
                <div>
                  <p className="text-slate-400 font-semibold">Customer</p>
                  <p className="text-white font-bold text-sm mt-0.5">{selectedOrderDetails.customerName}</p>
                  <p className="font-mono text-cyan-300 mt-0.5">{selectedOrderDetails.phone}</p>
                  {selectedOrderDetails.email && <p className="text-slate-400">{selectedOrderDetails.email}</p>}
                </div>
                <div>
                  <p className="text-slate-400 font-semibold">Delivery Address</p>
                  <p className="text-slate-200 mt-0.5">{selectedOrderDetails.address}</p>
                  <p className="text-slate-300">Thana: {selectedOrderDetails.thana}</p>
                  <p className="text-slate-300">District: {selectedOrderDetails.district}</p>
                </div>
              </div>

              {/* Payment Verification Box */}
              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-300 uppercase tracking-wider">
                    Manual Payment Verification
                  </span>
                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                    selectedOrderDetails.paymentStatus === 'Verified'
                      ? 'bg-emerald-950 text-emerald-400 border border-emerald-800'
                      : selectedOrderDetails.paymentStatus === 'Rejected'
                      ? 'bg-red-950 text-red-400 border border-red-800'
                      : 'bg-amber-950 text-amber-400 border border-amber-800'
                  }`}>
                    {selectedOrderDetails.paymentStatus}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-2 pt-1 text-slate-300">
                  <div>
                    <span className="text-slate-500">Method:</span>{' '}
                    <span className="font-bold uppercase text-white">{selectedOrderDetails.paymentMethod}</span>
                  </div>
                  <div>
                    <span className="text-slate-500">Transaction ID:</span>{' '}
                    <span className="font-mono text-cyan-400 font-bold">{selectedOrderDetails.transactionId || 'N/A'}</span>
                  </div>
                  {selectedOrderDetails.paymentPhoneNumber && (
                    <div className="col-span-2">
                      <span className="text-slate-500">Customer Payment Phone:</span>{' '}
                      <span className="font-mono text-white font-bold">{selectedOrderDetails.paymentPhoneNumber}</span>
                    </div>
                  )}
                </div>

                <div className="pt-2 flex items-center gap-2">
                  <button
                    onClick={() => {
                      updatePaymentStatus(selectedOrderDetails.id, 'Verified');
                      setSelectedOrderDetails({ ...selectedOrderDetails, paymentStatus: 'Verified' });
                    }}
                    className="px-3 py-1.5 rounded-lg bg-emerald-900 hover:bg-emerald-800 text-emerald-200 font-bold text-xs"
                  >
                    Mark Payment Verified
                  </button>
                  <button
                    onClick={() => {
                      updatePaymentStatus(selectedOrderDetails.id, 'Rejected');
                      setSelectedOrderDetails({ ...selectedOrderDetails, paymentStatus: 'Rejected' });
                    }}
                    className="px-3 py-1.5 rounded-lg bg-red-950 hover:bg-red-900 text-red-300 font-bold text-xs"
                  >
                    Reject Transaction
                  </button>
                </div>
              </div>

              {/* Items */}
              <div className="space-y-2">
                <p className="font-bold uppercase tracking-wider text-slate-400">Products Ordered</p>
                <div className="space-y-1.5">
                  {selectedOrderDetails.items.map((it, idx) => (
                    <div key={idx} className="flex justify-between items-center p-2.5 rounded-xl bg-slate-950 border border-slate-800">
                      <div className="flex items-center gap-3">
                        <img
                          src={it.image || './placeholder-security.svg'}
                          alt={it.name}
                          className="w-10 h-10 rounded-lg object-cover border border-slate-800 shrink-0"
                          onError={(e) => {
                            (e.target as HTMLImageElement).src = './placeholder-security.svg';
                          }}
                        />
                        <div>
                          <p className="font-semibold text-white">{it.name}</p>
                          <p className="text-[10px] text-slate-500 font-mono">SKU: {it.sku}</p>
                        </div>
                      </div>
                      <div className="text-right font-mono">
                        <span className="text-slate-400">{it.quantity} × {currency}{it.price}</span>
                        <p className="font-bold text-white">{currency}{(it.quantity * it.price).toLocaleString()}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Timeline */}
              <div className="space-y-2 pt-2 border-t border-slate-800">
                <p className="font-bold uppercase tracking-wider text-slate-400">Order Logs & Timeline</p>
                <div className="space-y-2 pl-2 border-l border-slate-800">
                  {selectedOrderDetails.timeline?.map((log, i) => (
                    <div key={i} className="pl-3 relative text-[11px]">
                      <span className="absolute -left-[15px] top-1.5 w-2 h-2 rounded-full bg-cyan-400" />
                      <div className="flex justify-between text-slate-400">
                        <span className="font-semibold text-cyan-300">{log.status}</span>
                        <span className="font-mono">{new Date(log.timestamp).toLocaleTimeString()}</span>
                      </div>
                      <p className="text-slate-300">{log.note}</p>
                    </div>
                  ))}
                </div>
              </div>

            </div>
          </div>
        </div>
      )}

      {/* ==================================================== */}
      {/* CUSTOMER HISTORY MODAL */}
      {/* ==================================================== */}
      {selectedCustomer && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 animate-in fade-in">
          <div className="relative w-full max-w-xl bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl p-6 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div>
                <h2 className="text-base font-bold text-white">{selectedCustomer.name}</h2>
                <p className="text-xs text-cyan-400 font-mono">{selectedCustomer.phone}</p>
              </div>
              <button onClick={() => setSelectedCustomer(null)} className="p-1 text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                <span className="text-slate-400">Total Orders</span>
                <p className="text-xl font-bold font-mono text-white mt-1">{selectedCustomer.ordersCount}</p>
              </div>
              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                <span className="text-slate-400">Total Spent</span>
                <p className="text-xl font-bold font-mono text-emerald-400 mt-1">
                  {currency}{selectedCustomer.totalSpent.toLocaleString()}
                </p>
              </div>
            </div>

            <div className="space-y-2 text-xs">
              <p className="font-bold text-slate-300 uppercase tracking-wider">Customer Orders</p>
              <div className="space-y-1.5 max-h-60 overflow-y-auto">
                {orders.filter(o => o.phone === selectedCustomer.phone).map(ord => (
                  <div key={ord.id} className="p-3 rounded-xl bg-slate-950 border border-slate-800 flex justify-between items-center">
                    <div>
                      <p className="font-mono font-bold text-cyan-400">{ord.id}</p>
                      <p className="text-slate-400 text-[10px]">{new Date(ord.createdAt).toLocaleDateString()}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-mono font-bold text-white">{currency}{ord.total.toLocaleString()}</p>
                      <span className="text-[10px] text-slate-400">{ord.orderStatus}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
