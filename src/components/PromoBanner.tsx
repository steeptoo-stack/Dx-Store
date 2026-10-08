import React from 'react';
import { useStore } from '../context/StoreContext';
import { Sparkles, ArrowRight, ShieldCheck, Tag } from 'lucide-react';

export const PromoBanner: React.FC = () => {
  const { settings, setActiveView } = useStore();
  const hp = settings.homepage;

  if (!hp.bannerEnabled) return null;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 my-12">
      <div className="relative rounded-3xl overflow-hidden border border-cyan-500/30 bg-gradient-to-r from-cyan-950 via-slate-900 to-blue-950 shadow-2xl shadow-cyan-950/30">
        <div className="grid grid-cols-1 lg:grid-cols-12 items-center">
          
          <div className="lg:col-span-8 p-8 sm:p-12 space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/20 text-cyan-300 text-xs font-bold uppercase tracking-wider border border-cyan-500/30">
              <Tag className="w-3.5 h-3.5" />
              <span>Special Security Package Offer</span>
            </div>

            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-white tracking-tight leading-tight">
              {hp.bannerTitle}
            </h2>

            <p className="text-slate-300 text-sm sm:text-base leading-relaxed max-w-xl">
              {hp.bannerSubtitle}
            </p>

            <div className="pt-2 flex flex-wrap items-center gap-4">
              <button
                onClick={() => setActiveView('shop')}
                className="px-6 py-3 rounded-xl bg-cyan-400 hover:bg-cyan-300 text-slate-950 font-bold text-sm tracking-wide shadow-lg shadow-cyan-400/25 transition-all flex items-center gap-2 cursor-pointer"
              >
                <span>{hp.bannerBtnText || "View Package Details"}</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <div className="flex items-center gap-2 text-xs text-slate-400">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <span>Includes Free Configuration & Warranty</span>
              </div>
            </div>
          </div>

          <div className="lg:col-span-4 h-64 lg:h-full relative overflow-hidden hidden sm:block">
            <img
              src={hp.bannerImage || "https://images.unsplash.com/photo-1582139329536-e7284fece509?auto=format&fit=crop&w=800&q=80"}
              alt="Security Bundle"
              className="w-full h-full object-cover object-center opacity-80 hover:opacity-100 hover:scale-105 transition-all duration-500"
            />
            <div className="absolute inset-0 bg-gradient-to-t lg:bg-gradient-to-r from-slate-900 via-transparent to-transparent" />
          </div>

        </div>
      </div>
    </div>
  );
};
