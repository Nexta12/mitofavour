'use client';

import { Product } from '@/types';
import { Tag, Sparkles } from 'lucide-react';

interface ProductCardProps {
  product: Product;
  onOpenDetails: (product: Product) => void;
}

export default function ProductCard({ product, onOpenDetails }: ProductCardProps) {
  const currencySymbol = process.env.NEXT_PUBLIC_CURRENCY_SYMBOL || '₦';

  // Check if product is less than 7 days old
  const isNew = (() => {
    if (!product.created_at) return false;
    const createdDate = new Date(product.created_at);
    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
    return createdDate > oneWeekAgo;
  })();

  // Format price with commas
  const formattedPrice = new Intl.NumberFormat().format(product.price);

  return (
    <div
      onClick={() => onOpenDetails(product)}
      className="group relative cursor-pointer overflow-hidden rounded-2xl border border-slate-200 bg-white hover:bg-slate-50/50 p-4 transition-all duration-300 hover:border-yellow-400 hover:shadow-md flex flex-col h-full"
    >
      {/* Product Image */}
      <div className="relative aspect-square w-full overflow-hidden rounded-xl bg-slate-50 border border-slate-100">
        {product.image_url ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={product.image_url}
            alt={product.name}
            className="h-full w-full object-cover object-center group-hover:scale-105 transition-transform duration-500 ease-out"
            loading="lazy"
          />
        ) : (
          <div className="flex h-full w-full flex-col items-center justify-center text-slate-400 gap-2">
            <Sparkles className="h-8 w-8 text-slate-355 group-hover:text-yellow-500 transition-colors" />
            <span className="text-[10px] uppercase tracking-widest font-bold">No Image</span>
          </div>
        )}
        
        {/* Floating New Tag */}
        {isNew && (
          <div className="absolute top-3 right-3 flex items-center gap-1 rounded-lg bg-slate-900 border border-slate-800 px-2.5 py-1 text-[10px] font-bold tracking-wider uppercase text-yellow-500">
            <Tag className="h-3 w-3" />
            <span>New</span>
          </div>
        )}
      </div>

      {/* Info Section */}
      <div className="mt-4 flex flex-col flex-grow">
        <h3 className="font-sans text-sm font-extrabold text-slate-900 group-hover:text-yellow-600 transition-colors duration-300 line-clamp-1">
          {product.name}
        </h3>
        
        <p className="mt-1 text-xs text-slate-500 line-clamp-2 flex-grow leading-relaxed">
          {product.description || 'No description available.'}
        </p>

        {/* Bottom Section */}
        <div className="mt-4 flex items-center justify-between border-t border-slate-100 pt-3">
          <div className="flex flex-col">
            <div className="flex items-center gap-1.5">
              <span className="text-[9px] uppercase tracking-wider text-slate-400 font-bold">Price</span>
              <span className="inline-flex rounded bg-emerald-50 px-1.5 py-0.5 text-[8px] font-bold text-emerald-700 uppercase tracking-wide border border-emerald-100 leading-none">
                Free Delivery
              </span>
            </div>
            <span className="font-sans text-base font-black text-slate-900">
              {currencySymbol}{formattedPrice}
            </span>
          </div>
          
          <button className="rounded-xl bg-slate-900 px-3.5 py-2 text-xs font-bold text-yellow-500 group-hover:bg-yellow-500 group-hover:text-slate-950 transition-all duration-300 shadow-sm cursor-pointer ">
            Place Order
          </button>
        </div>
      </div>
    </div>
  );
}
