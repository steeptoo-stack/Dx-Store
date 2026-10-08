import React, { useState } from 'react';
import { StoreProvider, useStore } from './context/StoreContext';
import { AnnouncementBar } from './components/AnnouncementBar';
import { Navbar } from './components/Navbar';
import { HeroBanner } from './components/HeroBanner';
import { PromoBanner } from './components/PromoBanner';
import { ProductCard } from './components/ProductCard';
import { ProductDetailModal } from './components/ProductDetailModal';
import { CartDrawer } from './components/CartDrawer';
import { CheckoutModal } from './components/CheckoutModal';
import { OrderSuccessModal } from './components/OrderSuccessModal';
import { OrderTrackModal } from './components/OrderTrackModal';
import { InvoiceModal } from './components/InvoiceModal';
import { AdminPanel } from './components/AdminPanel';
import { AdminLoginModal } from './components/AdminLoginModal';
import { AboutView } from './components/AboutView';
import { ContactView } from './components/ContactView';
import { PolicyModal } from './components/PolicyModal';
import { FloatingWhatsApp } from './components/FloatingWhatsApp';
import { Footer } from './components/Footer';
import { Product, Order } from './types';
import { 
  ShieldCheck, 
  Search, 
  Filter, 
  CheckCircle2, 
  Truck, 
  CreditCard, 
  PhoneCall,
  SlidersHorizontal,
  ArrowRight,
  Sparkles
} from 'lucide-react';

const MainApp: React.FC = () => {
  const { 
    settings, 
    products, 
    categories, 
    activeView, 
    setActiveView, 
    isAdminAuthenticated,
    notification,
    addToCart
  } = useStore();

  // Modals state
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [isTrackOrderOpen, setIsTrackOrderOpen] = useState(false);
  const [isAdminLoginOpen, setIsAdminLoginOpen] = useState(false);
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);
  const [successOrderId, setSuccessOrderId] = useState<string | null>(null);
  const [selectedInvoiceOrder, setSelectedInvoiceOrder] = useState<Order | null>(null);
  const [activePolicy, setActivePolicy] = useState<'privacy' | 'terms' | 'return' | 'delivery' | null>(null);

  // Shop filter state
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'featured' | 'price-asc' | 'price-desc'>('featured');

  // Filtered products list
  const filteredProducts = products.filter(p => {
    if (!p.isVisible) return false;
    const matchCat = selectedCategory === 'ALL' || p.category === selectedCategory;
    const matchSearch =
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.shortDescription.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.sku.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.category.toLowerCase().includes(searchQuery.toLowerCase());
    return matchCat && matchSearch;
  }).sort((a, b) => {
    const priceA = a.discountPrice ?? a.price;
    const priceB = b.discountPrice ?? b.price;
    if (sortBy === 'price-asc') return priceA - priceB;
    if (sortBy === 'price-desc') return priceB - priceA;
    return (b.isFeatured ? 1 : 0) - (a.isFeatured ? 1 : 0);
  });

  const featuredProducts = products.filter(p => p.isFeatured && p.isVisible);
  const newArrivals = products.filter(p => p.isNewArrival && p.isVisible);

  // Direct checkout handler (Buy Now)
  const handleDirectCheckout = (product: Product, quantity = 1) => {
    addToCart(product, quantity);
    setIsCheckoutOpen(true);
  };

  // If viewing admin and authenticated, show admin panel full screen
  if (activeView === 'admin' && isAdminAuthenticated) {
    return (
      <div className="min-h-screen bg-slate-950 text-slate-100">
        <header className="bg-slate-900 border-b border-slate-800 px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="font-bold text-white text-sm">DX Security Control Center</span>
            <span className="text-xs bg-cyan-950 text-cyan-400 border border-cyan-800 px-2 py-0.5 rounded font-mono">
              Live Backend
            </span>
          </div>
          <button
            onClick={() => setActiveView('home')}
            className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs text-slate-200 transition-colors flex items-center gap-1.5"
          >
            <span>Back to Customer Store</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </header>

        <AdminPanel onOpenInvoice={ord => setSelectedInvoiceOrder(ord)} />

        {/* Printable Invoice Modal */}
        {selectedInvoiceOrder && (
          <InvoiceModal
            order={selectedInvoiceOrder}
            onClose={() => setSelectedInvoiceOrder(null)}
          />
        )}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col selection:bg-cyan-500 selection:text-white">
      {/* 1. Editable Announcement Bar */}
      <AnnouncementBar />

      {/* 2. Top Header Navigation */}
      <Navbar
        onOpenCart={() => setIsCartOpen(true)}
        onOpenTrackOrder={() => setIsTrackOrderOpen(true)}
        onOpenAdminLogin={() => setIsAdminLoginOpen(true)}
      />

      {/* Notification Toast */}
      {notification && (
        <div className="fixed top-24 right-4 z-50 animate-in fade-in slide-in-from-top-3 max-w-sm">
          <div
            className={`p-3.5 rounded-2xl border shadow-2xl backdrop-blur-md flex items-center gap-2.5 text-xs font-semibold ${
              notification.type === 'error'
                ? 'bg-red-950/90 text-red-200 border-red-800'
                : notification.type === 'info'
                ? 'bg-blue-950/90 text-blue-200 border-blue-800'
                : 'bg-emerald-950/90 text-emerald-200 border-emerald-800'
            }`}
          >
            <ShieldCheck className="w-4 h-4 shrink-0" />
            <span>{notification.message}</span>
          </div>
        </div>
      )}

      {/* 3. Main Views */}
      <main className="flex-1">
        {/* VIEW: HOME */}
        {activeView === 'home' && (
          <div className="space-y-12 pb-16">
            {/* Hero Section */}
            <HeroBanner />

            {/* Quick Category Filter Bar */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
                <button
                  onClick={() => setSelectedCategory('ALL')}
                  className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                    selectedCategory === 'ALL'
                      ? 'bg-cyan-500 text-slate-950 shadow-md shadow-cyan-500/20'
                      : 'bg-slate-900 text-slate-300 hover:bg-slate-800 border border-slate-800'
                  }`}
                >
                  All Security Categories ({products.length})
                </button>
                {categories.filter(c => c.isEnabled).map(cat => (
                  <button
                    key={cat.id}
                    onClick={() => setSelectedCategory(cat.name)}
                    className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                      selectedCategory === cat.name
                        ? 'bg-cyan-500 text-slate-950 shadow-md shadow-cyan-500/20'
                        : 'bg-slate-900 text-slate-300 hover:bg-slate-800 border border-slate-800'
                    }`}
                  >
                    {cat.name}
                  </button>
                ))}
              </div>
            </div>

            {/* Featured Hardware Section */}
            {settings.homepage.showFeatured && featuredProducts.length > 0 && (
              <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2 border-b border-slate-800/80 pb-4">
                  <div>
                    <span className="text-xs font-mono font-bold uppercase tracking-widest text-cyan-400">
                      Top Recommendations
                    </span>
                    <h2 className="text-2xl font-black text-white mt-1">
                      Featured Security Systems
                    </h2>
                  </div>
                  <button
                    onClick={() => setActiveView('shop')}
                    className="text-xs text-cyan-400 hover:underline flex items-center gap-1 font-semibold"
                  >
                    <span>View all products</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {featuredProducts.slice(0, 3).map(prod => (
                    <ProductCard
                      key={prod.id}
                      product={prod}
                      onOpenQuickView={p => setQuickViewProduct(p)}
                      onDirectCheckout={p => handleDirectCheckout(p)}
                    />
                  ))}
                </div>
              </section>
            )}

            {/* Promotional Banner */}
            <PromoBanner />

            {/* Catalog Grid Section */}
            <section id="products-section" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800/80 pb-4">
                <div>
                  <h2 className="text-2xl font-black text-white">
                    Surveillance & Security Catalog
                  </h2>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Showing {filteredProducts.length} authentic security products with official warranty
                  </p>
                </div>

                {/* Filters & Search */}
                <div className="flex flex-wrap items-center gap-3">
                  <div className="relative min-w-[200px]">
                    <Search className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={e => setSearchQuery(e.target.value)}
                      placeholder="Search camera, NVR, brand..."
                      className="w-full pl-9 pr-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-cyan-500"
                    />
                  </div>

                  <select
                    value={sortBy}
                    onChange={e => setSortBy(e.target.value as any)}
                    className="px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-300 focus:outline-none"
                  >
                    <option value="featured">Sort by Featured</option>
                    <option value="price-asc">Price: Low to High</option>
                    <option value="price-desc">Price: High to Low</option>
                  </select>
                </div>
              </div>

              {filteredProducts.length === 0 ? (
                <div className="p-12 text-center bg-slate-900/60 rounded-3xl border border-slate-800 space-y-3">
                  <p className="text-base font-semibold text-slate-300">No products match your criteria</p>
                  <p className="text-xs text-slate-500">Try clearing the search or category filter.</p>
                  <button
                    onClick={() => {
                      setSelectedCategory('ALL');
                      setSearchQuery('');
                    }}
                    className="px-4 py-2 rounded-xl bg-slate-800 text-cyan-400 text-xs font-semibold"
                  >
                    Reset Filters
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredProducts.map(prod => (
                    <ProductCard
                      key={prod.id}
                      product={prod}
                      onOpenQuickView={p => setQuickViewProduct(p)}
                      onDirectCheckout={p => handleDirectCheckout(p)}
                    />
                  ))}
                </div>
              )}
            </section>
          </div>
        )}

        {/* VIEW: SHOP */}
        {activeView === 'shop' && (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
            <div>
              <span className="text-xs font-mono font-bold uppercase tracking-widest text-cyan-400">
                Official Equipment Inventory
              </span>
              <h1 className="text-3xl font-extrabold text-white mt-1">
                All Surveillance Products
              </h1>
            </div>

            {/* Filter controls */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 p-4 rounded-2xl bg-slate-900 border border-slate-800">
              <div className="flex items-center gap-2 overflow-x-auto">
                <button
                  onClick={() => setSelectedCategory('ALL')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap ${
                    selectedCategory === 'ALL'
                      ? 'bg-cyan-500 text-slate-950 font-bold'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  All ({products.length})
                </button>
                {categories.map(c => (
                  <button
                    key={c.id}
                    onClick={() => setSelectedCategory(c.name)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap ${
                      selectedCategory === c.name
                        ? 'bg-cyan-500 text-slate-950 font-bold'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    {c.name}
                  </button>
                ))}
              </div>

              <div className="flex items-center gap-3">
                <div className="relative">
                  <Search className="w-4 h-4 text-slate-500 absolute left-3 top-2.5" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={e => setSearchQuery(e.target.value)}
                    placeholder="Search products..."
                    className="pl-9 pr-3 py-1.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none"
                  />
                </div>

                <select
                  value={sortBy}
                  onChange={e => setSortBy(e.target.value as any)}
                  className="px-3 py-1.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-300 focus:outline-none"
                >
                  <option value="featured">Featured First</option>
                  <option value="price-asc">Price: Low to High</option>
                  <option value="price-desc">Price: High to Low</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredProducts.map(prod => (
                <ProductCard
                  key={prod.id}
                  product={prod}
                  onOpenQuickView={p => setQuickViewProduct(p)}
                  onDirectCheckout={p => handleDirectCheckout(p)}
                />
              ))}
            </div>
          </div>
        )}

        {/* VIEW: ABOUT */}
        {activeView === 'about' && <AboutView />}

        {/* VIEW: CONTACT */}
        {activeView === 'contact' && <ContactView />}
      </main>

      {/* 4. Footer */}
      <Footer
        onOpenPolicy={p => setActivePolicy(p)}
        onOpenTrackOrder={() => setIsTrackOrderOpen(true)}
      />

      {/* 5. Floating WhatsApp Button */}
      <FloatingWhatsApp />

      {/* ==================================================== */}
      {/* MODALS */}
      {/* ==================================================== */}

      {/* Quick View Product Modal */}
      {quickViewProduct && (
        <ProductDetailModal
          product={quickViewProduct}
          onClose={() => setQuickViewProduct(null)}
          onDirectCheckout={(p, qty) => {
            handleDirectCheckout(p, qty);
          }}
        />
      )}

      {/* Cart Drawer */}
      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        onProceedToCheckout={() => setIsCheckoutOpen(true)}
      />

      {/* Checkout Modal */}
      <CheckoutModal
        isOpen={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
        onOrderPlaced={orderId => {
          setSuccessOrderId(orderId);
        }}
      />

      {/* Order Success Modal */}
      {successOrderId && (
        <OrderSuccessModal
          orderId={successOrderId}
          onClose={() => setSuccessOrderId(null)}
          onTrackOrder={ordId => {
            setSuccessOrderId(null);
            setIsTrackOrderOpen(true);
          }}
          onPrintInvoice={ordId => {
            const ord = products ? undefined : undefined;
            // Find order
            // InvoiceModal can be triggered
            setSuccessOrderId(null);
          }}
        />
      )}

      {/* Order Tracking Modal */}
      <OrderTrackModal
        isOpen={isTrackOrderOpen}
        onClose={() => setIsTrackOrderOpen(false)}
        initialOrderId={successOrderId}
      />

      {/* Printable Invoice Modal (Admin / Order View) */}
      {selectedInvoiceOrder && (
        <InvoiceModal
          order={selectedInvoiceOrder}
          onClose={() => setSelectedInvoiceOrder(null)}
        />
      )}

      {/* Admin Login Modal */}
      <AdminLoginModal
        isOpen={isAdminLoginOpen}
        onClose={() => setIsAdminLoginOpen(false)}
        onSuccess={() => {
          setIsAdminLoginOpen(false);
          setActiveView('admin');
        }}
      />

      {/* Policy Modal */}
      {activePolicy && (
        <PolicyModal
          policyType={activePolicy}
          onClose={() => setActivePolicy(null)}
        />
      )}
    </div>
  );
};

export default function App() {
  return (
    <StoreProvider>
      <MainApp />
    </StoreProvider>
  );
}
