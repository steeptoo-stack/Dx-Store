import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { 
  Shield, 
  Search, 
  ShoppingCart, 
  Phone, 
  MessageCircle, 
  Lock, 
  Menu, 
  X, 
  Truck, 
  CheckCircle, 
  Camera,
  ChevronDown
} from 'lucide-react';

interface NavbarProps {
  onOpenCart: () => void;
  onOpenTrackOrder: () => void;
  onOpenAdminLogin: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  onOpenCart,
  onOpenTrackOrder,
  onOpenAdminLogin
}) => {
  const { 
    settings, 
    cartCount, 
    categories, 
    activeView, 
    setActiveView, 
    isAdminAuthenticated 
  } = useStore();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryDropdownOpen, setCategoryDropdownOpen] = useState(false);

  const whatsappNumber = settings.contact.whatsapp || '01761861680';
  const cleanWhatsApp = whatsappNumber.replace(/[^0-9]/g, '');
  const waUrl = `https://wa.me/88${cleanWhatsApp.startsWith('88') ? cleanWhatsApp.slice(2) : cleanWhatsApp}?text=${encodeURIComponent(
    'Hello DX Security! I want to consult regarding security camera systems.'
  )}`;

  const handleNavClick = (view: string) => {
    setActiveView(view);
    setMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <header className="sticky top-0 z-30 bg-slate-950/95 backdrop-blur-md border-b border-slate-800/80 shadow-xl shadow-black/40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20 gap-4">
          
          {/* Logo & Brand */}
          <div 
            onClick={() => handleNavClick('home')}
            className="flex items-center gap-3 cursor-pointer group select-none"
          >
            <div className="relative flex items-center justify-center w-11 h-11 rounded-xl bg-gradient-to-tr from-cyan-600 via-cyan-500 to-blue-600 shadow-lg shadow-cyan-500/25 group-hover:scale-105 transition-transform duration-200">
              <Shield className="w-6 h-6 text-white" />
              <div className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-emerald-500 border-2 border-slate-950 flex items-center justify-center">
                <CheckCircle className="w-2.5 h-2.5 text-slate-950" />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-2xl font-black tracking-tight text-white group-hover:text-cyan-400 transition-colors">
                  {settings.store.name || 'DX Security'}
                </span>
                <span className="text-[10px] uppercase font-bold tracking-widest bg-cyan-950 text-cyan-400 border border-cyan-800/80 px-1.5 py-0.5 rounded">
                  BD
                </span>
              </div>
              <p className="text-[11px] text-slate-400 hidden sm:block tracking-wide">
                Surveillance & Smart Security
              </p>
            </div>
          </div>

          {/* Desktop Nav Links */}
          <nav className="hidden lg:flex items-center gap-6 text-sm font-medium text-slate-300">
            <button
              onClick={() => handleNavClick('home')}
              className={`hover:text-cyan-400 transition-colors ${
                activeView === 'home' ? 'text-cyan-400 font-semibold' : ''
              }`}
            >
              Home
            </button>
            <button
              onClick={() => handleNavClick('shop')}
              className={`hover:text-cyan-400 transition-colors ${
                activeView === 'shop' ? 'text-cyan-400 font-semibold' : ''
              }`}
            >
              All Products
            </button>

            {/* Categories dropdown */}
            <div className="relative">
              <button
                onClick={() => setCategoryDropdownOpen(!categoryDropdownOpen)}
                onBlur={() => setTimeout(() => setCategoryDropdownOpen(false), 200)}
                className="flex items-center gap-1 hover:text-cyan-400 transition-colors"
              >
                <span>Categories</span>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
              </button>

              {categoryDropdownOpen && (
                <div className="absolute left-0 mt-2 w-64 bg-slate-900 border border-slate-800 rounded-xl shadow-2xl p-2 z-50 animate-in fade-in zoom-in-95">
                  {categories.filter(c => c.isEnabled).map(cat => (
                    <button
                      key={cat.id}
                      onClick={() => {
                        handleNavClick('shop');
                        setCategoryDropdownOpen(false);
                      }}
                      className="w-full text-left px-3 py-2 text-xs text-slate-300 hover:text-cyan-400 hover:bg-slate-800/60 rounded-lg transition-colors flex items-center justify-between"
                    >
                      <span>{cat.name}</span>
                      <Camera className="w-3.5 h-3.5 text-slate-500" />
                    </button>
                  ))}
                </div>
              )}
            </div>

            <button
              onClick={() => handleNavClick('about')}
              className={`hover:text-cyan-400 transition-colors ${
                activeView === 'about' ? 'text-cyan-400 font-semibold' : ''
              }`}
            >
              About
            </button>
            <button
              onClick={() => handleNavClick('contact')}
              className={`hover:text-cyan-400 transition-colors ${
                activeView === 'contact' ? 'text-cyan-400 font-semibold' : ''
              }`}
            >
              Contact
            </button>
            <button
              onClick={onOpenTrackOrder}
              className="flex items-center gap-1.5 text-slate-400 hover:text-emerald-400 transition-colors"
            >
              <Truck className="w-4 h-4 text-emerald-400" />
              <span>Track Order</span>
            </button>
          </nav>

          {/* Action CTAs */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Direct WhatsApp Call */}
            <a
              href={waUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="hidden sm:inline-flex items-center gap-2 px-3 py-2 rounded-lg bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-xs font-semibold transition-all hover:scale-102"
              title="Chat on WhatsApp"
            >
              <MessageCircle className="w-4 h-4 fill-emerald-400/20" />
              <span className="hidden xl:inline">WhatsApp:</span>
              <span className="font-mono">{whatsappNumber}</span>
            </a>

            {/* Direct Call Button */}
            <a
              href={`tel:${settings.contact.phone || '01761861680'}`}
              className="hidden md:inline-flex items-center gap-1.5 px-3 py-2 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-800 text-xs font-medium transition-colors"
            >
              <Phone className="w-3.5 h-3.5 text-cyan-400" />
              <span>Call Us</span>
            </a>

            {/* Cart Button */}
            <button
              onClick={onOpenCart}
              className="relative p-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-800 transition-all hover:border-cyan-500/40"
              aria-label="Shopping Cart"
            >
              <ShoppingCart className="w-5 h-5" />
              {cartCount > 0 && (
                <span className="absolute -top-1.5 -right-1.5 bg-gradient-to-r from-cyan-500 to-blue-500 text-white font-bold text-[10px] w-5 h-5 rounded-full flex items-center justify-center shadow-lg shadow-cyan-500/40 animate-pulse">
                  {cartCount}
                </span>
              )}
            </button>

            {/* Admin Access Button */}
            <button
              onClick={() => {
                if (isAdminAuthenticated) {
                  handleNavClick('admin');
                } else {
                  onOpenAdminLogin();
                }
              }}
              className={`p-2.5 rounded-xl border transition-all text-xs flex items-center gap-1.5 ${
                activeView === 'admin'
                  ? 'bg-cyan-500/20 border-cyan-500 text-cyan-300'
                  : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-cyan-400 hover:border-slate-700'
              }`}
              title="Admin Dashboard"
            >
              <Lock className="w-4 h-4" />
              <span className="hidden sm:inline font-mono font-medium">
                {isAdminAuthenticated ? 'Admin' : 'Admin'}
              </span>
            </button>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2.5 rounded-xl bg-slate-900 text-slate-300 border border-slate-800"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Dropdown Menu */}
        {mobileMenuOpen && (
          <div className="lg:hidden py-4 border-t border-slate-800 space-y-3 animate-in fade-in slide-in-from-top-4">
            <div className="grid grid-cols-2 gap-2 pb-2">
              <button
                onClick={() => handleNavClick('home')}
                className={`px-3 py-2 text-left rounded-lg text-sm ${
                  activeView === 'home' ? 'bg-cyan-950 text-cyan-400 font-bold' : 'text-slate-300 bg-slate-900'
                }`}
              >
                Home
              </button>
              <button
                onClick={() => handleNavClick('shop')}
                className={`px-3 py-2 text-left rounded-lg text-sm ${
                  activeView === 'shop' ? 'bg-cyan-950 text-cyan-400 font-bold' : 'text-slate-300 bg-slate-900'
                }`}
              >
                All Products
              </button>
              <button
                onClick={() => handleNavClick('about')}
                className={`px-3 py-2 text-left rounded-lg text-sm ${
                  activeView === 'about' ? 'bg-cyan-950 text-cyan-400 font-bold' : 'text-slate-300 bg-slate-900'
                }`}
              >
                About Us
              </button>
              <button
                onClick={() => handleNavClick('contact')}
                className={`px-3 py-2 text-left rounded-lg text-sm ${
                  activeView === 'contact' ? 'bg-cyan-950 text-cyan-400 font-bold' : 'text-slate-300 bg-slate-900'
                }`}
              >
                Contact
              </button>
            </div>

            <div className="pt-2 border-t border-slate-800 flex flex-col gap-2">
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  onOpenTrackOrder();
                }}
                className="flex items-center justify-between w-full px-4 py-2.5 bg-slate-900 rounded-lg text-sm text-emerald-400 border border-emerald-500/20"
              >
                <span className="flex items-center gap-2">
                  <Truck className="w-4 h-4" /> Track My Order
                </span>
                <span className="text-xs text-slate-400">Order ID / Phone</span>
              </button>

              <a
                href={waUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 w-full py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-sm font-semibold shadow-lg shadow-emerald-600/30"
              >
                <MessageCircle className="w-4 h-4" /> Chat on WhatsApp ({whatsappNumber})
              </a>

              <a
                href={`tel:${settings.contact.phone || '01761861680'}`}
                className="flex items-center justify-center gap-2 w-full py-2.5 bg-slate-900 text-cyan-400 border border-cyan-800 rounded-lg text-sm font-semibold"
              >
                <Phone className="w-4 h-4" /> Hotline: {settings.contact.phone || '01761861680'}
              </a>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};
