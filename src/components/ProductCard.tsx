import React from 'react';
import { Product } from '../types';
import { useStore } from '../context/StoreContext';
import { ShoppingCart, Eye, Zap, Shield, CheckCircle2 } from 'lucide-react';

interface ProductCardProps {
  product: Product;
  onOpenQuickView: (product: Product) => void;
  onDirectCheckout: (product: Product) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  onOpenQuickView,
  onDirectCheckout
}) => {
  const { addToCart, settings } = useStore();
  const currency = settings.store?.currencySymbol || '৳';

  const discountPercent = product.discountPrice
    ? Math.round(((product.price - product.discountPrice) / product.price) * 100)
    : 0;

  const displayPrice = product.discountPrice ?? product.price;

  return (
    <div className="group relative bg-slate-900/90 border border-slate-800 hover:border-cyan-500/50 rounded-2xl overflow-hidden flex flex-col transition-all duration-300 hover:shadow-xl hover:shadow-cyan-950/30">
      {/* Product Image Area */}
      <div className="relative aspect-[4/3] bg-slate-950 overflow-hidden cursor-pointer" onClick={() => onOpenQuickView(product)}>
        <img
          src={product.mainImage || (product.images && product.images[0]) || './placeholder-security.svg'}
          alt={product.name}
          className="w-full h-full object-cover object-center group-hover:scale-108 transition-transform duration-500"
          loading="lazy"
          onError={(e) => {
            (e.target as HTMLImageElement).src = './placeholder-security.svg';
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent opacity-60 group-hover:opacity-40 transition-opacity" />

        {/* Badges Area */}
        <div className="absolute top-3 left-3 flex flex-col gap-1.5 z-10">
          {discountPercent > 0 && (
            <span className="px-2 py-0.5 rounded-md bg-red-600 text-white font-bold text-[11px] shadow-md shadow-red-900/40">
              -{discountPercent}% OFF
            </span>
          )}
          {product.isNewArrival && (
            <span className="px-2 py-0.5 rounded-md bg-cyan-500 text-slate-950 font-bold text-[10px] uppercase tracking-wider">
              NEW
            </span>
          )}
          {product.isFeatured && (
            <span className="px-2 py-0.5 rounded-md bg-amber-500 text-slate-950 font-bold text-[10px] uppercase tracking-wider">
              FEATURED
            </span>
          )}
        </div>

        {/* Stock Badge */}
        <div className="absolute top-3 right-3 z-10">
          {product.stock <= 0 ? (
            <span className="px-2 py-0.5 rounded bg-red-950/90 border border-red-800 text-red-400 text-[10px] font-semibold">
              Out of Stock
            </span>
          ) : product.stock <= 5 ? (
            <span className="px-2 py-0.5 rounded bg-amber-950/90 border border-amber-800 text-amber-400 text-[10px] font-semibold">
              Low Stock ({product.stock})
            </span>
          ) : (
            <span className="px-2 py-0.5 rounded bg-slate-900/90 border border-slate-700 text-emerald-400 text-[10px] font-medium flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
              In Stock
            </span>
          )}
        </div>

        {/* Hover Quick Actions */}
        <div className="absolute inset-0 bg-slate-950/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onOpenQuickView(product);
            }}
            className="p-3 rounded-xl bg-slate-900/90 hover:bg-cyan-500 text-white hover:text-slate-950 border border-slate-700 shadow-xl transition-all"
            title="Quick View Details"
          >
            <Eye className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Content Area */}
      <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between space-y-3">
        <div>
          <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
            <span className="text-cyan-400 font-medium truncate">{product.category}</span>
            <span className="font-mono text-[10px] text-slate-500">{product.sku}</span>
          </div>

          <h3 
            onClick={() => onOpenQuickView(product)}
            className="font-bold text-sm sm:text-base text-slate-100 hover:text-cyan-400 transition-colors line-clamp-2 cursor-pointer"
          >
            {product.name}
          </h3>

          <p className="text-xs text-slate-400 line-clamp-2 mt-1 leading-relaxed">
            {product.shortDescription}
          </p>
        </div>

        {/* Pricing & Warranty */}
        <div className="pt-2 border-t border-slate-800/80">
          <div className="flex items-baseline justify-between mb-3">
            <div className="flex items-baseline gap-2">
              <span className="text-xl sm:text-2xl font-black text-cyan-400 font-mono">
                {currency}{displayPrice.toLocaleString()}
              </span>
              {product.discountPrice && (
                <span className="text-xs text-slate-500 line-through font-mono">
                  {currency}{product.price.toLocaleString()}
                </span>
              )}
            </div>
            {product.warranty && (
              <span className="text-[10px] text-emerald-400/90 font-medium">
                {product.warranty}
              </span>
            )}
          </div>

          {/* Action Buttons */}
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => addToCart(product)}
              disabled={product.stock <= 0}
              className="px-3 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 active:scale-98 disabled:opacity-50 disabled:cursor-not-allowed text-xs font-semibold text-slate-200 border border-slate-700 transition-all flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <ShoppingCart className="w-3.5 h-3.5" />
              <span>Add to Cart</span>
            </button>

            <button
              onClick={() => onDirectCheckout(product)}
              disabled={product.stock <= 0}
              className="px-3 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-400 hover:to-blue-400 active:scale-98 disabled:opacity-50 disabled:cursor-not-allowed text-xs font-bold text-slate-950 transition-all flex items-center justify-center gap-1.5 shadow-md shadow-cyan-500/20 cursor-pointer"
            >
              <Zap className="w-3.5 h-3.5 fill-current" />
              <span>Buy Now</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
