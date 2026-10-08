import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { Order } from '../types';
import { X, Search, Truck, CheckCircle2, Clock, AlertCircle, Package } from 'lucide-react';

interface OrderTrackModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialOrderId?: string | null;
}

export const OrderTrackModal: React.FC<OrderTrackModalProps> = ({
  isOpen,
  onClose,
  initialOrderId
}) => {
  const { orders, settings } = useStore();
  const [searchInput, setSearchInput] = useState(initialOrderId || '');
  const [searchedOrder, setSearchedOrder] = useState<Order | null>(() => {
    if (initialOrderId) {
      return orders.find(o => o.id.toLowerCase() === initialOrderId.toLowerCase()) || null;
    }
    return null;
  });
  const [hasSearched, setHasSearched] = useState(Boolean(initialOrderId));

  if (!isOpen) return null;

  const currency = settings.store?.currencySymbol || '৳';

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const query = searchInput.trim().toLowerCase();
    if (!query) return;

    const match = orders.find(
      o => o.id.toLowerCase() === query || o.phone.replace(/[^0-9]/g, '') === query.replace(/[^0-9]/g, '')
    );

    setSearchedOrder(match || null);
    setHasSearched(true);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Delivered': return 'text-emerald-400 bg-emerald-950/80 border-emerald-800';
      case 'Shipped': return 'text-blue-400 bg-blue-950/80 border-blue-800';
      case 'Processing': return 'text-purple-400 bg-purple-950/80 border-purple-800';
      case 'Confirmed': return 'text-cyan-400 bg-cyan-950/80 border-cyan-800';
      case 'Cancelled': return 'text-red-400 bg-red-950/80 border-red-800';
      default: return 'text-amber-400 bg-amber-950/80 border-amber-800';
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-4 sm:p-6 animate-in fade-in duration-200">
      <div 
        className="relative w-full max-w-2xl bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-5 border-b border-slate-800 bg-slate-950/70 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Truck className="w-5 h-5 text-cyan-400" />
            <h2 className="text-base font-bold text-white">Track Security Order</h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-xl transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1">
          {/* Search Box */}
          <form onSubmit={handleSearch} className="flex gap-2">
            <input
              type="text"
              value={searchInput}
              onChange={e => setSearchInput(e.target.value)}
              placeholder="Enter Order ID (e.g. DXS-82914) or Phone Number"
              className="flex-1 px-4 py-3 rounded-xl bg-slate-950 border border-slate-800 text-sm text-white placeholder-slate-500 font-mono focus:outline-none focus:ring-2 focus:ring-cyan-500"
            />
            <button
              type="submit"
              className="px-5 py-3 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-sm transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <Search className="w-4 h-4" />
              <span>Track</span>
            </button>
          </form>

          {/* Result */}
          {hasSearched && (
            <div>
              {searchedOrder ? (
                <div className="space-y-5 bg-slate-950 border border-slate-800 rounded-2xl p-5">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-800">
                    <div>
                      <span className="text-xs text-slate-400">Order ID</span>
                      <p className="text-lg font-bold font-mono text-cyan-400">{searchedOrder.id}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${getStatusColor(searchedOrder.orderStatus)}`}>
                        {searchedOrder.orderStatus}
                      </span>
                      <span className={`px-2.5 py-1 rounded-full text-xs font-mono font-medium border ${
                        searchedOrder.paymentStatus === 'Verified' 
                          ? 'text-emerald-400 bg-emerald-950/60 border-emerald-800'
                          : searchedOrder.paymentStatus === 'Rejected'
                          ? 'text-red-400 bg-red-950/60 border-red-800'
                          : 'text-amber-400 bg-amber-950/60 border-amber-800'
                      }`}>
                        Payment: {searchedOrder.paymentStatus}
                      </span>
                    </div>
                  </div>

                  {/* Summary Details */}
                  <div className="grid grid-cols-2 gap-3 text-xs">
                    <div>
                      <p className="text-slate-400">Recipient</p>
                      <p className="text-white font-medium">{searchedOrder.customerName}</p>
                      <p className="text-slate-400 font-mono">{searchedOrder.phone}</p>
                    </div>
                    <div>
                      <p className="text-slate-400">Delivery Address</p>
                      <p className="text-white">{searchedOrder.address}, {searchedOrder.district}</p>
                    </div>
                  </div>

                  {/* Payment Details */}
                  <div className="p-3 bg-slate-900 rounded-xl text-xs space-y-1">
                    <p className="text-slate-400">
                      Payment Method: <span className="text-white font-semibold uppercase">{searchedOrder.paymentMethod}</span>
                    </p>
                    {searchedOrder.transactionId && (
                      <p className="text-slate-400">
                        Transaction ID: <span className="font-mono text-cyan-400 font-bold">{searchedOrder.transactionId}</span>
                      </p>
                    )}
                    <p className="text-slate-400">
                      Total Payable: <span className="font-mono text-white font-bold">{currency}{searchedOrder.total.toLocaleString()}</span>
                    </p>
                  </div>

                  {/* Items in Order */}
                  <div className="space-y-2">
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                      Ordered Products ({searchedOrder.items.length})
                    </p>
                    <div className="space-y-1.5">
                      {searchedOrder.items.map((item, idx) => (
                        <div key={idx} className="flex items-center justify-between text-xs p-2 rounded-lg bg-slate-900 border border-slate-800/80">
                          <div className="flex items-center gap-2 truncate pr-2">
                            <Package className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                            <span className="text-slate-200 truncate">{item.name}</span>
                          </div>
                          <span className="font-mono text-slate-400 shrink-0">
                            {item.quantity} × {currency}{item.price}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Timeline History */}
                  <div className="space-y-3 pt-3 border-t border-slate-800">
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                      Status History & Logs
                    </p>
                    <div className="space-y-3 pl-2 border-l border-slate-800">
                      {searchedOrder.timeline?.map((log, idx) => (
                        <div key={idx} className="relative pl-4 space-y-0.5">
                          <span className="absolute -left-[17px] top-1.5 w-2.5 h-2.5 rounded-full bg-cyan-400" />
                          <div className="flex items-center justify-between text-[11px]">
                            <span className="font-semibold text-cyan-300">{log.status}</span>
                            <span className="text-slate-500 font-mono">
                              {new Date(log.timestamp).toLocaleString()}
                            </span>
                          </div>
                          <p className="text-xs text-slate-300">{log.note}</p>
                        </div>
                      ))}
                    </div>
                  </div>

                </div>
              ) : (
                <div className="p-8 text-center bg-slate-950 border border-slate-800 rounded-2xl space-y-2">
                  <AlertCircle className="w-8 h-8 text-amber-400 mx-auto" />
                  <p className="text-sm font-semibold text-slate-200">No order found</p>
                  <p className="text-xs text-slate-400">
                    Please check your Order ID (e.g. DXS-82914) or contact our hotline directly at {settings.contact.phone || '01761861680'}.
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
