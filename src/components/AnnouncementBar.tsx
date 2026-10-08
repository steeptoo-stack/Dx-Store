import React from 'react';
import { useStore } from '../context/StoreContext';
import { Phone, ShieldCheck, Zap } from 'lucide-react';

export const AnnouncementBar: React.FC = () => {
  const { settings } = useStore();

  if (!settings.website.announcementBarEnabled) {
    return null;
  }

  const phone = settings.contact.phone || '01761861680';

  return (
    <div className="bg-gradient-to-r from-cyan-950 via-slate-900 to-blue-950 text-slate-200 text-xs sm:text-sm py-2 px-4 border-b border-cyan-800/40 relative z-40">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
        <div className="flex items-center gap-2 font-medium tracking-wide text-cyan-200">
          <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-cyan-500/20 text-cyan-400">
            <ShieldCheck className="w-3.5 h-3.5" />
          </span>
          <span>{settings.website.announcementBarText}</span>
        </div>

        <div className="flex items-center gap-4 text-xs text-slate-300">
          <a
            href={`tel:${phone}`}
            className="flex items-center gap-1.5 hover:text-cyan-400 transition-colors font-mono font-medium"
          >
            <Phone className="w-3.5 h-3.5 text-cyan-400" />
            <span>Hotline: {phone}</span>
          </a>
          <span className="hidden md:inline-block text-slate-600">|</span>
          <span className="hidden md:inline-flex items-center gap-1 text-emerald-400">
            <Zap className="w-3 h-3" />
            <span>2-Year Official Warranty</span>
          </span>
        </div>
      </div>
    </div>
  );
};
