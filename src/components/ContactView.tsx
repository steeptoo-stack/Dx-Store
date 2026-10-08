import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { Phone, MessageCircle, Mail, MapPin, Clock, Send, ShieldCheck } from 'lucide-react';

export const ContactView: React.FC = () => {
  const { settings, showNotification } = useStore();
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [message, setMessage] = useState('');

  const hotline = settings.contact.phone || '01761861680';
  const whatsapp = settings.contact.whatsapp || '01761861680';
  const cleanWA = whatsapp.replace(/[^0-9]/g, '');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !phone.trim() || !message.trim()) {
      showNotification('Please fill in your name, phone, and message', 'error');
      return;
    }

    const waText = `Hello DX Security Bangladesh!
Inquiry from Website:
Name: ${name}
Phone: ${phone}
Message: ${message}`;

    const waUrl = `https://wa.me/88${cleanWA.startsWith('88') ? cleanWA.slice(2) : cleanWA}?text=${encodeURIComponent(
      waText
    )}`;

    window.open(waUrl, '_blank');
    showNotification('Inquiry redirected to WhatsApp Technical Desk', 'success');
    setName('');
    setPhone('');
    setMessage('');
  };

  return (
    <div className="py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-12">
      <div className="text-center space-y-3 max-w-2xl mx-auto">
        <span className="text-xs font-mono font-bold uppercase tracking-widest text-cyan-400 bg-cyan-950 px-3 py-1 rounded-full border border-cyan-800">
          Customer Support & Quotations
        </span>
        <h1 className="text-3xl font-extrabold text-white">Contact DX Security</h1>
        <p className="text-sm text-slate-300">
          {settings.contact.supportMessage || 'Call or WhatsApp our technical surveillance desk for immediate quotation and consultation.'}
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Contact Info Cards */}
        <div className="lg:col-span-5 space-y-4">
          <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 space-y-5">
            <h3 className="font-bold text-white text-base border-b border-slate-800 pb-2">
              Get in Touch Directly
            </h3>

            {/* Phone */}
            <div className="flex items-start gap-3.5">
              <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400 shrink-0">
                <Phone className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs text-slate-400">Technical Hotline</p>
                <a href={`tel:${hotline}`} className="text-sm font-bold font-mono text-white hover:text-cyan-400">
                  {hotline}
                </a>
              </div>
            </div>

            {/* WhatsApp */}
            <div className="flex items-start gap-3.5">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shrink-0">
                <MessageCircle className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs text-slate-400">WhatsApp Instant Chat</p>
                <span className="text-sm font-bold font-mono text-emerald-400">
                  {whatsapp}
                </span>
                <p className="text-[10px] text-slate-500">Live support Saturday - Thursday</p>
              </div>
            </div>

            {/* Email */}
            {settings.contact.email !== 'Not configured' && (
              <div className="flex items-start gap-3.5">
                <div className="w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-500/30 flex items-center justify-center text-blue-400 shrink-0">
                  <Mail className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-xs text-slate-400">Official Email</p>
                  <a href={`mailto:${settings.contact.email}`} className="text-xs font-mono text-white hover:text-cyan-400">
                    {settings.contact.email}
                  </a>
                </div>
              </div>
            )}

            {/* Address */}
            <div className="flex items-start gap-3.5">
              <div className="w-10 h-10 rounded-xl bg-slate-800 border border-slate-700 flex items-center justify-center text-slate-300 shrink-0">
                <MapPin className="w-5 h-5 text-cyan-400" />
              </div>
              <div>
                <p className="text-xs text-slate-400">Physical Store Location</p>
                <p className="text-xs text-slate-200 leading-snug">
                  {settings.contact.address}
                </p>
              </div>
            </div>

            {/* Business hours */}
            <div className="flex items-start gap-3.5">
              <div className="w-10 h-10 rounded-xl bg-slate-800 border border-slate-700 flex items-center justify-center text-slate-300 shrink-0">
                <Clock className="w-5 h-5 text-amber-400" />
              </div>
              <div>
                <p className="text-xs text-slate-400">Operating Hours</p>
                <p className="text-xs text-slate-200">
                  {settings.contact.businessHours}
                </p>
              </div>
            </div>

          </div>
        </div>

        {/* Message form */}
        <div className="lg:col-span-7">
          <form onSubmit={handleSubmit} className="p-6 sm:p-8 rounded-3xl bg-slate-900 border border-slate-800 space-y-4">
            <div>
              <h3 className="font-bold text-white text-base">Request Security Consultation</h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Have questions about camera resolution, storage calculations, or installation? Send us a message!
              </p>
            </div>

            <div className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Your Full Name <span className="text-red-400">*</span>
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={e => setName(e.target.value)}
                  placeholder="e.g. Asif Mahmud"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-sm text-white focus:outline-none focus:ring-1 focus:ring-cyan-500"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Mobile Phone Number <span className="text-red-400">*</span>
                </label>
                <input
                  type="tel"
                  value={phone}
                  onChange={e => setPhone(e.target.value)}
                  placeholder="01xxxxxxxxx"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-sm font-mono text-white focus:outline-none focus:ring-1 focus:ring-cyan-500"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Inquiry / Security Requirements <span className="text-red-400">*</span>
                </label>
                <textarea
                  rows={4}
                  value={message}
                  onChange={e => setMessage(e.target.value)}
                  placeholder="Tell us what you want to protect (e.g. 4 cameras for 3-story home, factory warehouse, office attendance...)"
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:ring-1 focus:ring-cyan-500"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-3.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-400 hover:to-blue-400 text-slate-950 font-bold text-sm tracking-wide shadow-lg shadow-cyan-500/20 transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <Send className="w-4 h-4" />
              <span>Send Message to WhatsApp Desk</span>
            </button>
          </form>
        </div>

      </div>
    </div>
  );
};
