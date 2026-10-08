import React from 'react';
import { useStore } from '../context/StoreContext';
import { MessageCircle } from 'lucide-react';

export const FloatingWhatsApp: React.FC = () => {
  const { settings } = useStore();
  const whatsappNumber = settings.contact.whatsapp || '01761861680';
  const cleanNumber = whatsappNumber.replace(/[^0-9]/g, '');

  const waUrl = `https://wa.me/88${cleanNumber.startsWith('88') ? cleanNumber.slice(2) : cleanNumber}?text=${encodeURIComponent(
    'Hello DX Security! I need technical consultation on security cameras / CCTV packages.'
  )}`;

  return (
    <aside aria-label="Support chat" className="fixed bottom-6 right-6 z-40 group">
      <a
        href={waUrl}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={`Chat with DX Security on WhatsApp at ${whatsappNumber}`}
        className="flex items-center gap-3 p-3.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold rounded-full shadow-2xl shadow-emerald-500/40 hover:scale-105 transition-all duration-300"
      >
        <MessageCircle className="w-6 h-6 fill-slate-950" />
        <span className="hidden sm:inline text-xs tracking-wide pr-1 font-bold">
          Chat on WhatsApp ({whatsappNumber})
        </span>
      </a>
    </aside>
  );
};
