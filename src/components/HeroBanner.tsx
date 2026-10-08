import React from 'react';
import { useStore } from '../context/StoreContext';
import { ShieldCheck, Video, Lock, ArrowRight, CheckCircle2, Award, Zap } from 'lucide-react';

export const HeroBanner: React.FC = () => {
  const { settings, setActiveView } = useStore();
  const hp = settings.homepage;

  return (
    <div className="relative overflow-hidden bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 border-b border-slate-800/60 py-12 lg:py-20">
      {/* Background Glows */}
      <div className="absolute top-1/4 left-1/4 -translate-x-1/2 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Left Column: Headlines & Actions */}
          <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-cyan-950/80 border border-cyan-800/80 text-cyan-400 text-xs font-semibold tracking-wide shadow-sm shadow-cyan-900/20">
              <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
              <span>{hp.heroBadge || "Authorized Security Distributor in Bangladesh"}</span>
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-extrabold tracking-tight text-white leading-[1.15]">
              {hp.heroTitle || "Next-Gen AI Surveillance & Smart Security"}
            </h1>

            <p className="text-base sm:text-lg text-slate-300 max-w-2xl leading-relaxed">
              {hp.heroSubtitle || "Protect your home, office, and enterprise with ultra HD 4K night-vision CCTV, biometric access, and 24/7 remote monitoring."}
            </p>

            {/* Value Highlights */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-2 text-xs text-slate-300">
              <div className="flex items-center gap-2 bg-slate-900/60 border border-slate-800 p-2.5 rounded-xl">
                <CheckCircle2 className="w-4 h-4 text-cyan-400 shrink-0" />
                <span>100% Genuine Brands</span>
              </div>
              <div className="flex items-center gap-2 bg-slate-900/60 border border-slate-800 p-2.5 rounded-xl">
                <Award className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>2-Year Warranty</span>
              </div>
              <div className="flex items-center gap-2 bg-slate-900/60 border border-slate-800 p-2.5 rounded-xl col-span-2 sm:col-span-1">
                <Zap className="w-4 h-4 text-amber-400 shrink-0" />
                <span>bKash / Nagad / COD</span>
              </div>
            </div>

            {/* CTAs */}
            <div className="pt-4 flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4">
              <button
                onClick={() => {
                  const target = document.getElementById('products-section');
                  if (target) {
                    target.scrollIntoView({ behavior: 'smooth' });
                  } else {
                    setActiveView('shop');
                  }
                }}
                className="w-full sm:w-auto px-8 py-4 rounded-xl bg-gradient-to-r from-cyan-500 via-cyan-400 to-blue-500 text-slate-950 font-bold text-sm tracking-wide shadow-xl shadow-cyan-500/20 hover:scale-102 hover:shadow-cyan-500/30 transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>{hp.heroBtnText || "Explore Security Systems"}</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                onClick={() => setActiveView('contact')}
                className="w-full sm:w-auto px-6 py-4 rounded-xl bg-slate-900/80 hover:bg-slate-800 text-slate-200 border border-slate-700/80 text-sm font-semibold transition-colors flex items-center justify-center gap-2 cursor-pointer"
              >
                <ShieldCheck className="w-4 h-4 text-cyan-400" />
                <span>Free Surveillance Consultation</span>
              </button>
            </div>
          </div>

          {/* Right Column: Hero Visual Showcase */}
          <div className="lg:col-span-5 relative">
            <div className="relative mx-auto max-w-md lg:max-w-none rounded-2xl overflow-hidden border border-slate-700/80 shadow-2xl shadow-cyan-950/40 group">
              <img
                src={hp.heroImage || "https://images.unsplash.com/photo-1557597774-9d273605dfa9?auto=format&fit=crop&w=1200&q=80"}
                alt="DX Security Surveillance Equipment"
                className="w-full h-80 sm:h-96 object-cover object-center group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent" />

              {/* High-tech badge overlay */}
              <div className="absolute top-4 left-4 bg-slate-950/80 backdrop-blur-md border border-cyan-500/30 px-3 py-1.5 rounded-lg flex items-center gap-2 text-xs font-mono text-cyan-300">
                <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                <span>LIVE 4K SURVEILLANCE FEED</span>
              </div>

              {/* Bottom Card Overlay */}
              <div className="absolute bottom-4 left-4 right-4 bg-slate-900/90 backdrop-blur-md border border-slate-800 p-4 rounded-xl">
                <div className="flex items-center justify-between text-xs">
                  <div>
                    <p className="font-bold text-white text-sm">DX Security Systems</p>
                    <p className="text-slate-400 text-xs">Full Hardware Packages & Free Cloud App Setup</p>
                  </div>
                  <div className="text-right">
                    <span className="font-mono text-cyan-400 font-bold">24/7 Monitoring</span>
                    <p className="text-[10px] text-emerald-400">Dhaka & Nationwide</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};
