'use client';

import { Product } from '@/types';
import { Tag, Sparkles } from 'lucide-react';
import Link from 'next/link';

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
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
    <Link
      href={`/product/${product.id}`}
      className="group relative cursor-pointer overflow-hidden rounded-2xl border border-slate-200 bg-white hover:bg-slate-50 p-4 transition-all duration-300 hover:border-amber-300 hover:shadow-lg flex flex-col h-full"
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
          <div className="absolute top-3 right-3 flex items-center gap-1 rounded-lg bg-amber-100 border border-amber-200 px-2.5 py-1 text-[10px] font-black tracking-wider uppercase text-amber-700 shadow-sm">
            <Tag className="h-3 w-3" />
            <span>New</span>
          </div>
        )}
      </div>

      {/* Info Section */}
      <div className="mt-5 flex flex-col flex-grow">
        <h3 className="font-sans text-base font-black text-slate-900 group-hover:text-amber-600 transition-colors duration-300 line-clamp-1">
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
            </div>
            <span className="font-sans text-base font-black text-slate-900">
              {currencySymbol}{formattedPrice}
            </span>
          </div>
          
          <button className="rounded-xl bg-yellow-400 px-4 py-2.5 text-xs font-black text-slate-950 group-hover:bg-yellow-500 transition-all duration-300 shadow-sm cursor-pointer">
            Order Now
          </button>
        </div>
      </div>
    </Link>
  );
}
