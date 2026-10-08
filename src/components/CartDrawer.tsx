import React from 'react';
import { useStore } from '../context/StoreContext';
import { X, Trash2, ShoppingBag, ArrowRight, ShieldCheck, Zap } from 'lucide-react';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onProceedToCheckout: () => void;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({
  isOpen,
  onClose,
  onProceedToCheckout
}) => {
  const { cart, removeFromCart, updateCartQuantity, cartSubtotal, settings } = useStore();
  const currency = settings.store?.currencySymbol || '৳';
  const freeThreshold = settings.delivery.freeDeliveryThreshold || 10000;
  const isFreeDelivery = cartSubtotal >= freeThreshold;
  const progressPercent = Math.min(100, Math.round((cartSubtotal / freeThreshold) * 100));

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="absolute inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-slate-900 border-l border-slate-800 shadow-2xl flex flex-col">
          
          {/* Header */}
          <div className="p-5 border-b border-slate-800 bg-slate-950/70 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ShoppingBag className="w-5 h-5 text-cyan-400" />
              <h2 className="text-base font-bold text-white">Your Shopping Cart</h2>
              <span className="text-xs bg-slate-800 text-slate-300 px-2 py-0.5 rounded-full font-mono">
                {cart.length} {cart.length === 1 ? 'item' : 'items'}
              </span>
            </div>
            <button
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-xl transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Free Shipping Tracker */}
          {freeThreshold > 0 && (
            <div className="p-4 bg-slate-950/40 border-b border-slate-800 text-xs">
              {isFreeDelivery ? (
                <div className="text-emerald-400 font-semibold flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4" />
                  <span>Congratulations! You qualify for Free Delivery across Bangladesh!</span>
                </div>
              ) : (
                <div className="space-y-1.5">
                  <div className="flex justify-between text-slate-300">
                    <span>Add {currency}{(freeThreshold - cartSubtotal).toLocaleString()} more for Free Shipping</span>
                    <span className="font-mono">{progressPercent}%</span>
                  </div>
                  <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-cyan-500 to-emerald-400 transition-all duration-300"
                      style={{ width: `${progressPercent}%` }}
                    />
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Items List */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {cart.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center p-6 space-y-4">
                <div className="w-16 h-16 rounded-full bg-slate-800 flex items-center justify-center text-slate-500">
                  <ShoppingBag className="w-8 h-8" />
                </div>
                <div>
                  <p className="text-base font-semibold text-slate-200">Your cart is empty</p>
                  <p className="text-xs text-slate-400 mt-1">
                    Select surveillance cameras, NVRs, or security accessories to get started.
                  </p>
                </div>
                <button
                  onClick={onClose}
                  className="px-6 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 text-xs font-bold transition-all"
                >
                  Browse Security Products
                </button>
              </div>
            ) : (
              cart.map(({ product, quantity }) => {
                const itemPrice = product.discountPrice ?? product.price;
                return (
                  <div
                    key={product.id}
                    className="p-3 bg-slate-950/70 border border-slate-800 rounded-2xl flex items-center gap-3"
                  >
                    <img
                      src={product.mainImage || (product.images && product.images[0]) || './placeholder-security.svg'}
                      alt={product.name}
                      className="w-16 h-16 object-cover rounded-xl border border-slate-800 shrink-0"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = './placeholder-security.svg';
                      }}
                    />

                    <div className="flex-1 min-w-0">
                      <h4 className="text-xs font-semibold text-white truncate">
                        {product.name}
                      </h4>
                      <p className="text-xs font-mono text-cyan-400 font-bold mt-0.5">
                        {currency}{itemPrice.toLocaleString()}
                      </p>

                      <div className="flex items-center justify-between mt-2">
                        <div className="flex items-center border border-slate-700 rounded-lg bg-slate-900">
                          <button
                            onClick={() => updateCartQuantity(product.id, quantity - 1)}
                            className="px-2 py-0.5 text-xs text-slate-300 hover:bg-slate-800 font-bold"
                          >
                            -
                          </button>
                          <span className="px-2 text-xs font-mono text-white">
                            {quantity}
                          </span>
                          <button
                            onClick={() => updateCartQuantity(product.id, quantity + 1)}
                            className="px-2 py-0.5 text-xs text-slate-300 hover:bg-slate-800 font-bold"
                            disabled={quantity >= product.stock}
                          >
                            +
                          </button>
                        </div>

                        <button
                          onClick={() => removeFromCart(product.id)}
                          className="p-1.5 text-slate-500 hover:text-red-400 rounded-lg hover:bg-slate-800 transition-colors"
                          title="Remove item"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* Footer */}
          {cart.length > 0 && (
            <div className="p-5 border-t border-slate-800 bg-slate-950/90 space-y-4">
              <div className="space-y-1.5 text-xs">
                <div className="flex justify-between text-slate-400">
                  <span>Subtotal</span>
                  <span className="font-mono font-semibold text-white">
                    {currency}{cartSubtotal.toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between text-slate-400">
                  <span>Estimated Delivery</span>
                  <span className="text-slate-300">
                    {isFreeDelivery ? 'Free Delivery' : 'Calculated at checkout'}
                  </span>
                </div>
                <div className="flex justify-between text-sm font-bold text-white pt-2 border-t border-slate-800">
                  <span>Total (Before Delivery)</span>
                  <span className="font-mono text-cyan-400 text-base">
                    {currency}{cartSubtotal.toLocaleString()}
                  </span>
                </div>
              </div>

              <button
                onClick={() => {
                  onClose();
                  onProceedToCheckout();
                }}
                className="w-full py-3.5 rounded-xl bg-gradient-to-r from-cyan-500 via-cyan-400 to-blue-500 hover:from-cyan-400 hover:to-blue-400 text-slate-950 font-bold text-sm tracking-wide shadow-xl shadow-cyan-500/25 transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>Proceed to Checkout</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <div className="text-center">
                <button
                  onClick={onClose}
                  className="text-xs text-slate-400 hover:text-cyan-400 transition-colors"
                >
                  Continue Shopping
                </button>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};
