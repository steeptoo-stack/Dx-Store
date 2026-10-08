import React from 'react';
import { useStore } from '../context/StoreContext';
import { 
  Shield, 
  Phone, 
  MessageCircle, 
  Mail, 
  MapPin, 
  CheckCircle, 
  Clock, 
  Truck,
  Facebook,
  Youtube,
  Instagram
} from 'lucide-react';

interface FooterProps {
  onOpenPolicy: (policy: 'privacy' | 'terms' | 'return' | 'delivery') => void;
  onOpenTrackOrder: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onOpenPolicy, onOpenTrackOrder }) => {
  const { settings, setActiveView } = useStore();

  const phone = settings.contact.phone || '01761861680';
  const whatsapp = settings.contact.whatsapp || '01761861680';
  const email = settings.contact.email;

  return (
    <footer className="bg-slate-950 border-t border-slate-800 text-slate-400 text-xs">
      {/* Upper features strip */}
      <div className="border-b border-slate-800/80 bg-slate-900/40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400 shrink-0">
                <Shield className="w-5 h-5" />
              </div>
              <div>
                <p className="font-bold text-white text-xs">2 Years Warranty</p>
                <p className="text-[11px] text-slate-400">Official brand replacement</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 shrink-0">
                <Truck className="w-5 h-5" />
              </div>
              <div>
                <p className="font-bold text-white text-xs">Nationwide Delivery</p>
                <p className="text-[11px] text-slate-400">All 64 districts in Bangladesh</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-pink-500/10 border border-pink-500/20 flex items-center justify-center text-pink-400 shrink-0">
                <CheckCircle className="w-5 h-5" />
              </div>
              <div>
                <p className="font-bold text-white text-xs">bKash, Nagad & COD</p>
                <p className="text-[11px] text-slate-400">Convenient manual payments</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400 shrink-0">
                <Clock className="w-5 h-5" />
              </div>
              <div>
                <p className="font-bold text-white text-xs">Surveillance Support</p>
                <p className="text-[11px] text-slate-400">Field engineer guidance</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Links */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
          
          {/* Brand info */}
          <div className="md:col-span-4 space-y-4">
            <div className="flex items-center gap-2">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-cyan-600 to-blue-600 flex items-center justify-center text-white font-black text-sm shadow-md shadow-cyan-500/25">
                DX
              </div>
              <span className="text-xl font-black text-white tracking-tight">
                {settings.store.name || 'DX Security'}
              </span>
            </div>

            <p className="text-xs text-slate-400 leading-relaxed max-w-sm">
              {settings.store.description || 'Bangladesh’s premier destination for enterprise & residential CCTV cameras, NVRs, biometric attendance devices, and video intercoms.'}
            </p>

            {/* Accepted Payments Strip */}
            <div className="space-y-1.5 pt-2">
              <p className="text-[10px] uppercase font-bold tracking-wider text-slate-500">
                Accepted Payment Methods:
              </p>
              <div className="flex flex-wrap items-center gap-2">
                <span className="px-2.5 py-1 rounded bg-slate-900 border border-slate-800 text-[11px] font-medium text-slate-200">
                  Cash on Delivery
                </span>
                <span className="px-2.5 py-1 rounded bg-pink-950/80 border border-pink-800 text-[11px] font-mono font-bold text-pink-300">
                  bKash ({settings.payment.bkashNumber})
                </span>
                <span className="px-2.5 py-1 rounded bg-orange-950/80 border border-orange-800 text-[11px] font-mono font-bold text-orange-300">
                  Nagad
                </span>
              </div>
            </div>
          </div>

          {/* Quick Nav */}
          <div className="md:col-span-2 space-y-3">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider">
              Navigation
            </h4>
            <ul className="space-y-2">
              <li>
                <button onClick={() => { setActiveView('home'); window.scrollTo(0,0); }} className="hover:text-cyan-400 transition-colors">
                  Home
                </button>
              </li>
              <li>
                <button onClick={() => { setActiveView('shop'); window.scrollTo(0,0); }} className="hover:text-cyan-400 transition-colors">
                  All Products
                </button>
              </li>
              <li>
                <button onClick={onOpenTrackOrder} className="hover:text-cyan-400 transition-colors">
                  Track Your Order
                </button>
              </li>
              <li>
                <button onClick={() => { setActiveView('about'); window.scrollTo(0,0); }} className="hover:text-cyan-400 transition-colors">
                  About DX Security
                </button>
              </li>
              <li>
                <button onClick={() => { setActiveView('contact'); window.scrollTo(0,0); }} className="hover:text-cyan-400 transition-colors">
                  Contact Support
                </button>
              </li>
            </ul>
          </div>

          {/* Policies */}
          <div className="md:col-span-3 space-y-3">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider">
              Legal & Policies
            </h4>
            <ul className="space-y-2">
              <li>
                <button onClick={() => onOpenPolicy('return')} className="hover:text-cyan-400 transition-colors text-left">
                  Return & Replacement Policy
                </button>
              </li>
              <li>
                <button onClick={() => onOpenPolicy('delivery')} className="hover:text-cyan-400 transition-colors text-left">
                  Delivery Guidelines
                </button>
              </li>
              <li>
                <button onClick={() => onOpenPolicy('terms')} className="hover:text-cyan-400 transition-colors text-left">
                  Terms & Conditions
                </button>
              </li>
              <li>
                <button onClick={() => onOpenPolicy('privacy')} className="hover:text-cyan-400 transition-colors text-left">
                  Privacy Policy
                </button>
              </li>
            </ul>
          </div>

          {/* Contact Details */}
          <div className="md:col-span-3 space-y-3">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider">
              Contact & Hotline
            </h4>
            <div className="space-y-2.5 text-xs text-slate-300">
              <div className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
                <span className="leading-snug">{settings.contact.address}</span>
              </div>

              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-cyan-400 shrink-0" />
                <a href={`tel:${phone}`} className="font-mono hover:text-cyan-400 transition-colors">
                  Hotline: {phone}
                </a>
              </div>

              <div className="flex items-center gap-2">
                <MessageCircle className="w-4 h-4 text-emerald-400 shrink-0" />
                <span className="font-mono">WhatsApp: {whatsapp}</span>
              </div>

              {email && email !== 'Not configured' && (
                <div className="flex items-center gap-2">
                  <Mail className="w-4 h-4 text-slate-400 shrink-0" />
                  <a href={`mailto:${email}`} className="hover:text-cyan-400 transition-colors">
                    {email}
                  </a>
                </div>
              )}
            </div>

            {/* Social Icons */}
            <div className="pt-2 flex items-center gap-3">
              {settings.social.facebookUrl && (
                <a
                  href={settings.social.facebookUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-8 h-8 rounded-lg bg-slate-900 hover:bg-cyan-500 hover:text-slate-950 flex items-center justify-center transition-colors text-slate-400"
                  aria-label="Facebook"
                >
                  <Facebook className="w-4 h-4" />
                </a>
              )}
              {settings.social.youtubeUrl && (
                <a
                  href={settings.social.youtubeUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-8 h-8 rounded-lg bg-slate-900 hover:bg-red-500 hover:text-white flex items-center justify-center transition-colors text-slate-400"
                  aria-label="YouTube"
                >
                  <Youtube className="w-4 h-4" />
                </a>
              )}
            </div>
          </div>

        </div>
      </div>

      {/* Bottom Copyright */}
      <div className="border-t border-slate-800/80 py-4 px-4 text-center text-[11px] text-slate-500">
        <p>{settings.website.copyrightText || '© 2026 DX Security Bangladesh. All rights reserved.'}</p>
      </div>
    </footer>
  );
};
