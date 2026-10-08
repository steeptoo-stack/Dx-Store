import React from 'react';
import { Order } from '../types';
import { useStore } from '../context/StoreContext';
import { X, Printer, ShieldCheck } from 'lucide-react';

interface InvoiceModalProps {
  order: Order | null;
  onClose: () => void;
}

export const InvoiceModal: React.FC<InvoiceModalProps> = ({ order, onClose }) => {
  const { settings } = useStore();

  if (!order) return null;

  const currency = settings.store?.currencySymbol || '৳';

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 animate-in fade-in duration-200 print:p-0 print:bg-white print:static">
      <div 
        className="relative w-full max-w-3xl bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[95vh] print:max-h-none print:shadow-none print:border-none print:bg-white print:text-black"
        onClick={e => e.stopPropagation()}
      >
        {/* Actions bar (hidden in print) */}
        <div className="flex items-center justify-between p-4 border-b border-slate-800 bg-slate-950/70 print:hidden">
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono font-bold text-cyan-400 bg-cyan-950 px-2.5 py-1 rounded">
              OFFICIAL INVOICE
            </span>
            <span className="text-xs text-slate-400 font-mono">#{order.id}</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="px-4 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 text-xs font-bold transition-all flex items-center gap-1.5 shadow-md shadow-cyan-500/20 cursor-pointer"
            >
              <Printer className="w-4 h-4" />
              <span>Print Invoice</span>
            </button>
            <button
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-xl transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Printable Invoice Container */}
        <div id="printable-invoice" className="p-6 sm:p-10 overflow-y-auto space-y-8 bg-slate-950 text-slate-100 print:bg-white print:text-slate-900 print:p-8">
          
          {/* Header */}
          <div className="flex flex-col sm:flex-row justify-between items-start gap-4 pb-6 border-b border-slate-800 print:border-slate-300">
            <div>
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-cyan-500 flex items-center justify-center text-slate-950 font-black">
                  DX
                </div>
                <h1 className="text-2xl font-black tracking-tight text-white print:text-slate-900">
                  {settings.store.name || "DX Security"}
                </h1>
              </div>
              <p className="text-xs text-slate-400 print:text-slate-600 mt-1 max-w-sm">
                {settings.contact.address}
              </p>
              <p className="text-xs text-slate-400 print:text-slate-600 font-mono mt-0.5">
                Phone: {settings.contact.phone} | WhatsApp: {settings.contact.whatsapp}
              </p>
              {settings.contact.email !== 'Not configured' && (
                <p className="text-xs text-slate-400 print:text-slate-600 font-mono">
                  Email: {settings.contact.email}
                </p>
              )}
            </div>

            <div className="sm:text-right space-y-1">
              <span className="text-xl font-mono font-black text-cyan-400 print:text-cyan-700">
                INVOICE
              </span>
              <p className="text-sm font-mono font-bold text-white print:text-slate-900">
                Invoice No: {order.id}
              </p>
              <p className="text-xs text-slate-400 print:text-slate-600 font-mono">
                Date: {new Date(order.createdAt).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}
              </p>
              <div className="pt-1">
                <span className={`inline-block px-2 py-0.5 rounded text-[11px] font-bold uppercase print:border ${
                  order.paymentStatus === 'Verified'
                    ? 'bg-emerald-950 text-emerald-300 border-emerald-800 print:bg-emerald-100 print:text-emerald-800 print:border-emerald-300'
                    : 'bg-amber-950 text-amber-300 border-amber-800 print:bg-amber-100 print:text-amber-800 print:border-amber-300'
                }`}>
                  Payment: {order.paymentStatus}
                </span>
              </div>
            </div>
          </div>

          {/* Bill To & Shipping To */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-xs">
            <div className="p-4 rounded-xl bg-slate-900/60 print:bg-slate-100 border border-slate-800 print:border-slate-300 space-y-1">
              <p className="font-bold uppercase tracking-wider text-cyan-400 print:text-cyan-700 mb-1">
                Customer / Bill To:
              </p>
              <p className="font-bold text-sm text-white print:text-slate-900">{order.customerName}</p>
              <p className="font-mono text-slate-300 print:text-slate-700">Phone: {order.phone}</p>
              {order.email && <p className="text-slate-400 print:text-slate-600">Email: {order.email}</p>}
            </div>

            <div className="p-4 rounded-xl bg-slate-900/60 print:bg-slate-100 border border-slate-800 print:border-slate-300 space-y-1">
              <p className="font-bold uppercase tracking-wider text-cyan-400 print:text-cyan-700 mb-1">
                Shipping Destination:
              </p>
              <p className="text-slate-200 print:text-slate-800 font-medium">{order.address}</p>
              <p className="text-slate-300 print:text-slate-700">Thana/Upazila: {order.thana}</p>
              <p className="text-slate-300 print:text-slate-700">District: {order.district}</p>
              {order.notes && (
                <p className="text-[11px] text-amber-400 print:text-amber-700 italic mt-1">Note: {order.notes}</p>
              )}
            </div>
          </div>

          {/* Items Table */}
          <div className="border border-slate-800 print:border-slate-300 rounded-xl overflow-hidden">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-900 print:bg-slate-200 text-slate-400 print:text-slate-700 uppercase font-mono border-b border-slate-800 print:border-slate-300">
                <tr>
                  <th className="py-3 px-4">Item Description</th>
                  <th className="py-3 px-3">SKU</th>
                  <th className="py-3 px-3 text-center">Qty</th>
                  <th className="py-3 px-3 text-right">Unit Price</th>
                  <th className="py-3 px-4 text-right">Total</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800 print:divide-slate-200">
                {order.items.map((item, idx) => (
                  <tr key={idx} className="hover:bg-slate-900/40 print:hover:bg-transparent">
                    <td className="py-3 px-4 font-medium text-white print:text-slate-900">
                      <div className="flex items-center gap-2.5">
                        {item.image && (
                          <img
                            src={item.image}
                            alt={item.name}
                            className="w-7 h-7 rounded object-cover border border-slate-700 print:border-slate-300 shrink-0"
                            onError={(e) => {
                              (e.target as HTMLImageElement).style.display = 'none';
                            }}
                          />
                        )}
                        <span>{item.name}</span>
                      </div>
                    </td>
                    <td className="py-3 px-3 font-mono text-slate-400 print:text-slate-600 text-[11px]">
                      {item.sku}
                    </td>
                    <td className="py-3 px-3 font-mono text-center text-slate-300 print:text-slate-800">
                      {item.quantity}
                    </td>
                    <td className="py-3 px-3 font-mono text-right text-slate-300 print:text-slate-800">
                      {currency}{item.price.toLocaleString()}
                    </td>
                    <td className="py-3 px-4 font-mono text-right font-bold text-white print:text-slate-900">
                      {currency}{(item.price * item.quantity).toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Financial Totals & Payment Method */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-2">
            <div className="p-4 rounded-xl bg-slate-900/60 print:bg-slate-100 border border-slate-800 print:border-slate-300 text-xs space-y-1.5">
              <p className="font-bold text-slate-300 print:text-slate-800 uppercase tracking-wider">
                Payment Verification Details:
              </p>
              <p className="text-slate-400 print:text-slate-600">
                Method: <span className="text-white print:text-slate-900 font-bold uppercase">{order.paymentMethod}</span>
              </p>
              {order.transactionId && (
                <p className="text-slate-400 print:text-slate-600">
                  Transaction ID: <span className="font-mono text-cyan-400 print:text-cyan-800 font-bold">{order.transactionId}</span>
                </p>
              )}
              {order.paymentPhoneNumber && (
                <p className="text-slate-400 print:text-slate-600">
                  Sender Phone: <span className="font-mono text-white print:text-slate-900">{order.paymentPhoneNumber}</span>
                </p>
              )}
              <p className="text-slate-400 print:text-slate-600">
                Payment Status: <span className="font-bold text-white print:text-slate-900">{order.paymentStatus}</span>
              </p>
            </div>

            <div className="space-y-2 text-xs">
              <div className="flex justify-between text-slate-400 print:text-slate-600">
                <span>Subtotal</span>
                <span className="font-mono text-white print:text-slate-900 font-bold">
                  {currency}{order.subtotal.toLocaleString()}
                </span>
              </div>
              <div className="flex justify-between text-slate-400 print:text-slate-600">
                <span>Delivery Charge ({order.district})</span>
                <span className="font-mono text-white print:text-slate-900">
                  {currency}{order.deliveryCharge.toLocaleString()}
                </span>
              </div>
              <div className="flex justify-between items-baseline pt-2 border-t border-slate-800 print:border-slate-300 text-base font-bold">
                <span className="text-white print:text-slate-900">Total Payable</span>
                <span className="font-mono text-xl text-cyan-400 print:text-cyan-800">
                  {currency}{order.total.toLocaleString()}
                </span>
              </div>
            </div>
          </div>

          {/* Footer note & Stamp */}
          <div className="pt-8 border-t border-slate-800 print:border-slate-300 flex flex-col sm:flex-row justify-between items-end gap-6 text-xs text-slate-400 print:text-slate-600">
            <div className="space-y-1">
              <p className="font-semibold text-slate-300 print:text-slate-800">Terms & Warranty Support:</p>
              <p>• Official 2-Year Replacement Warranty on all surveillance hardware with original serial barcode.</p>
              <p>• Helpline & Technical Support: {settings.contact.phone || '01761861680'}</p>
            </div>

            <div className="text-center sm:text-right space-y-2">
              <div className="h-10 border-b border-dashed border-slate-600 print:border-slate-400 w-44 mx-auto sm:ml-auto" />
              <p className="font-mono text-[11px] text-slate-400 print:text-slate-600">
                Authorized Signatory / DX Security
              </p>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};
