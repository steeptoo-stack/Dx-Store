import React from 'react';
import { useStore } from '../context/StoreContext';
import { ShieldCheck, Target, Eye, CheckCircle2, Award, Users, PhoneCall } from 'lucide-react';

export const AboutView: React.FC = () => {
  const { settings, setActiveView } = useStore();
  const ab = settings.about;

  return (
    <div className="py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-12">
      {/* Hero section */}
      <div className="text-center space-y-4 max-w-3xl mx-auto">
        <span className="text-xs font-mono font-bold uppercase tracking-widest text-cyan-400 bg-cyan-950 px-3 py-1 rounded-full border border-cyan-800">
          About DX Security Bangladesh
        </span>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
          {ab.title}
        </h1>
        <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
          {ab.description}
        </p>
      </div>

      {/* Mission & Vision Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="p-6 sm:p-8 rounded-3xl bg-slate-900 border border-slate-800 space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
            <Target className="w-6 h-6" />
          </div>
          <h2 className="text-xl font-bold text-white">Our Mission</h2>
          <p className="text-sm text-slate-300 leading-relaxed">{ab.mission}</p>
        </div>

        <div className="p-6 sm:p-8 rounded-3xl bg-slate-900 border border-slate-800 space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-blue-500/10 border border-blue-500/30 flex items-center justify-center text-blue-400">
            <Eye className="w-6 h-6" />
          </div>
          <h2 className="text-xl font-bold text-white">Our Vision</h2>
          <p className="text-sm text-slate-300 leading-relaxed">{ab.vision}</p>
        </div>
      </div>

      {/* Company Info Box */}
      <div className="p-8 rounded-3xl bg-gradient-to-r from-slate-900 to-slate-950 border border-slate-800 space-y-4">
        <h2 className="text-xl font-bold text-white">Surveillance Reliability & Engineering</h2>
        <p className="text-sm text-slate-300 leading-relaxed">{ab.companyInfo}</p>
      </div>

      {/* Why Choose Us */}
      <div className="space-y-6">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-white">Why Businesses & Families Choose Us</h2>
          <p className="text-xs text-slate-400 mt-1">Our commitment to quality assurance across Bangladesh</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {ab.whyChooseUs.map((item, idx) => (
            <div key={idx} className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 flex items-start gap-3">
              <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
              <p className="text-xs text-slate-200 font-medium leading-relaxed">{item}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Call to action */}
      <div className="text-center pt-6">
        <button
          onClick={() => setActiveView('shop')}
          className="px-8 py-3.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-sm tracking-wide shadow-lg shadow-cyan-500/20 transition-all cursor-pointer"
        >
          Browse Surveillance Catalog
        </button>
      </div>
    </div>
  );
};
