import React from 'react';
import { useStore } from '../context/StoreContext';
import { X, ShieldCheck, FileText } from 'lucide-react';

interface PolicyModalProps {
  policyType: 'privacy' | 'terms' | 'return' | 'delivery' | null;
  onClose: () => void;
}

export const PolicyModal: React.FC<PolicyModalProps> = ({ policyType, onClose }) => {
  const { settings } = useStore();

  if (!policyType) return null;

  let title = '';
  let content = '';

  switch (policyType) {
    case 'privacy':
      title = 'Privacy Policy';
      content = settings.policies.privacyPolicy;
      break;
    case 'terms':
      title = 'Terms & Conditions';
      content = settings.policies.termsAndConditions;
      break;
    case 'return':
      title = 'Return & Refund Policy';
      content = settings.policies.returnAndRefundPolicy;
      break;
    case 'delivery':
      title = 'Delivery Policy';
      content = settings.policies.deliveryPolicy;
      break;
  }

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-4 sm:p-6 animate-in fade-in duration-200">
      <div 
        className="relative w-full max-w-2xl bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[85vh]"
        onClick={e => e.stopPropagation()}
      >
        <div className="flex items-center justify-between p-5 border-b border-slate-800 bg-slate-950/70">
          <div className="flex items-center gap-2">
            <FileText className="w-5 h-5 text-cyan-400" />
            <h2 className="text-base font-bold text-white">{title}</h2>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 overflow-y-auto text-xs sm:text-sm text-slate-300 leading-relaxed whitespace-pre-line space-y-4">
          {content}
        </div>

        <div className="p-4 border-t border-slate-800 bg-slate-950/50 text-right">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-white transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
