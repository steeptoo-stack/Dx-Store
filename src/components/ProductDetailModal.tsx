import React, { useState } from 'react';
import { Product } from '../types';
import { useStore } from '../context/StoreContext';
import { X, ShoppingCart, Zap, CheckCircle2, ShieldCheck, Truck, RotateCcw, AlertTriangle } from 'lucide-react';

interface ProductDetailModalProps {
  product: Product;
  onClose: () => void;
  onDirectCheckout: (product: Product, quantity: number) => void;
}

export const ProductDetailModal: React.FC<ProductDetailModalProps> = ({
  product,
  onClose,
  onDirectCheckout
}) => {
  const { settings, addToCart } = useStore();
  const [quantity, setQuantity] = useState(1);
  const currency = settings.store?.currencySymbol || '৳';
  const displayPrice = product.discountPrice ?? product.price;
  const rawImages = (product.images && product.images.length > 0) 
    ? product.images 
    : (product.mainImage ? [product.mainImage] : ['./placeholder-security.svg']);
  const allImages = rawImages.length > 0 ? rawImages : ['./placeholder-security.svg'];

  const [selectedImage, setSelectedImage] = useState(
    product.mainImage || (product.images && product.images[0]) || './placeholder-security.svg'
  );

  const handleAdd = () => {
    addToCart(product, quantity);
    onClose();
  };

  const handleBuy = () => {
    onDirectCheckout(product, quantity);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4 sm:p-6 animate-in fade-in duration-200">
      <div 
        className="relative w-full max-w-4xl bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
        onClick={e => e.stopPropagation()}
      >
        {/* Header with close button */}
        <div className="flex items-center justify-between p-4 sm:p-6 border-b border-slate-800/80 bg-slate-950/50">
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono uppercase bg-cyan-950 border border-cyan-800/60 text-cyan-400 px-2.5 py-1 rounded-md">
              {product.category}
            </span>
            <span className="text-xs text-slate-400 font-mono">SKU: {product.sku}</span>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable body */}
        <div className="overflow-y-auto p-4 sm:p-6 space-y-6 flex-1">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
            
            {/* Gallery Column */}
            <div className="md:col-span-5 space-y-3">
              <div className="aspect-[4/3] bg-slate-950 rounded-2xl overflow-hidden border border-slate-800 flex items-center justify-center">
                <img
                  src={selectedImage}
                  alt={product.name}
                  className="w-full h-full object-cover object-center"
                />
              </div>

              {/* Thumbnails */}
              {allImages.length > 1 && (
                <div className="flex items-center gap-2 overflow-x-auto pb-2">
                  {allImages.map((img, idx) => (
                    <button
                      key={idx}
                      onClick={() => setSelectedImage(img)}
                      className={`relative w-16 h-16 rounded-xl overflow-hidden border-2 transition-all shrink-0 ${
                        selectedImage === img
                          ? 'border-cyan-400 scale-98 shadow-md shadow-cyan-500/20'
                          : 'border-slate-800 opacity-60 hover:opacity-100'
                      }`}
                    >
                      <img src={img} alt="thumbnail" className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              )}

              {/* Service Badges */}
              <div className="grid grid-cols-2 gap-2 pt-2 text-[11px] text-slate-300">
                <div className="p-2.5 rounded-xl bg-slate-950/60 border border-slate-800/80 flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>{product.warranty || "2 Years Official Warranty"}</span>
                </div>
                <div className="p-2.5 rounded-xl bg-slate-950/60 border border-slate-800/80 flex items-center gap-2">
                  <Truck className="w-4 h-4 text-cyan-400 shrink-0" />
                  <span>Cash on Delivery</span>
                </div>
              </div>
            </div>

            {/* Info Column */}
            <div className="md:col-span-7 space-y-4">
              <h2 className="text-xl sm:text-2xl font-bold text-white leading-snug">
                {product.name}
              </h2>

              {/* Price Row */}
              <div className="flex items-baseline gap-3 p-3.5 rounded-xl bg-slate-950/80 border border-slate-800">
                <span className="text-2xl sm:text-3xl font-extrabold text-cyan-400 font-mono">
                  {currency}{displayPrice.toLocaleString()}
                </span>
                {product.discountPrice && (
                  <span className="text-sm text-slate-500 line-through font-mono">
                    {currency}{product.price.toLocaleString()}
                  </span>
                )}
                {product.discountPrice && (
                  <span className="text-xs font-bold text-red-400 bg-red-950/60 border border-red-800 px-2 py-0.5 rounded">
                    Save {currency}{(product.price - product.discountPrice).toLocaleString()}
                  </span>
                )}
              </div>

              {/* Stock Status */}
              <div className="flex items-center gap-2 text-xs">
                {product.stock <= 0 ? (
                  <span className="text-red-400 flex items-center gap-1 font-semibold">
                    <AlertTriangle className="w-4 h-4" /> Out of Stock (Contact for Pre-order)
                  </span>
                ) : (
                  <span className="text-emerald-400 flex items-center gap-1 font-semibold">
                    <CheckCircle2 className="w-4 h-4" /> Available in Stock ({product.stock} units ready in Dhaka warehouse)
                  </span>
                )}
              </div>

              {/* Description */}
              <p className="text-sm text-slate-300 leading-relaxed">
                {product.description || product.shortDescription}
              </p>

              {/* Features List */}
              {product.features && product.features.length > 0 && (
                <div className="space-y-1.5 pt-2">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                    Key Features
                  </h4>
                  <div className="grid grid-cols-1 gap-1 text-xs text-slate-300">
                    {product.features.map((feat, idx) => (
                      <div key={idx} className="flex items-start gap-2">
                        <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400 shrink-0 mt-0.5" />
                        <span>{feat}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Quantity & CTA Area */}
              <div className="pt-4 border-t border-slate-800 space-y-3">
                <div className="flex items-center gap-4">
                  <span className="text-xs font-semibold text-slate-400">Quantity:</span>
                  <div className="flex items-center border border-slate-700 rounded-xl bg-slate-950 overflow-hidden">
                    <button
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="px-3 py-1.5 text-slate-300 hover:bg-slate-800 text-sm font-bold"
                    >
                      -
                    </button>
                    <span className="px-4 py-1.5 text-sm font-mono text-white font-bold">
                      {quantity}
                    </span>
                    <button
                      onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                      className="px-3 py-1.5 text-slate-300 hover:bg-slate-800 text-sm font-bold"
                      disabled={quantity >= product.stock}
                    >
                      +
                    </button>
                  </div>
                  <span className="text-xs text-slate-500 font-mono">
                    Total: {currency}{(displayPrice * quantity).toLocaleString()}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-3 pt-2">
                  <button
                    onClick={handleAdd}
                    disabled={product.stock <= 0}
                    className="py-3 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-sm font-semibold border border-slate-700 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                  >
                    <ShoppingCart className="w-4 h-4" />
                    <span>Add to Cart</span>
                  </button>

                  <button
                    onClick={handleBuy}
                    disabled={product.stock <= 0}
                    className="py-3 px-4 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-400 hover:to-blue-400 text-slate-950 text-sm font-bold transition-all shadow-lg shadow-cyan-500/20 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                  >
                    <Zap className="w-4 h-4 fill-current" />
                    <span>Instant Checkout</span>
                  </button>
                </div>
              </div>

            </div>
          </div>

          {/* Specifications Table */}
          {product.specifications && product.specifications.length > 0 && (
            <div className="pt-6 border-t border-slate-800">
              <h3 className="text-sm font-bold uppercase tracking-wider text-cyan-400 mb-3">
                Technical Specifications
              </h3>
              <div className="rounded-xl border border-slate-800 overflow-hidden">
                <table className="w-full text-left text-xs">
                  <tbody>
                    {product.specifications.map((spec, i) => (
                      <tr 
                        key={i} 
                        className={i % 2 === 0 ? 'bg-slate-950/50' : 'bg-slate-900/50'}
                      >
                        <td className="py-2.5 px-4 font-semibold text-slate-400 w-1/3 border-b border-slate-800/60">
                          {spec.label}
                        </td>
                        <td className="py-2.5 px-4 text-slate-200 border-b border-slate-800/60">
                          {spec.value}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};
