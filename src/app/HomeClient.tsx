'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { Product } from '@/types';
import ProductCard from '@/components/ProductCard';
import ProductModal from '@/components/ProductModal';
import Testimonials from '@/components/Testimonials';
import Footer from '@/components/Footer';
import { Sparkles, AlertCircle, ShoppingBag, ShieldCheck, Flame, Zap, Award, ArrowRight } from 'lucide-react';
import Link from 'next/link';

export default function HomeClient() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  useEffect(() => {
    async function fetchProducts() {
      try {
        setLoading(true);
        const { data, error: dbError } = await supabase
          .from('products')
          .select('*')
          .order('created_at', { ascending: false });

        if (dbError) throw dbError;
        setProducts(data || []);
      } catch (err: unknown) {
        console.error('Error fetching products:', err);
        setError('Could not connect to the database. Make sure your database tables are created.');
      } finally {
        setLoading(false);
      }
    }

    fetchProducts();
  }, []);

  return (
    <div className="flex flex-col min-h-screen bg-slate-50 text-slate-800">
      
      {/* Industrial Hero Banner (Charcoal + Yellow accents) - Capped to 450px max-height */}
      <section className="relative overflow-hidden bg-slate-900 border-b border-slate-950 min-h-[380px] max-h-[500px] md:h-[450px] flex items-center text-white py-8 md:py-0">
        {/* Tech Grid Effect */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#334155_1px,transparent_1px),linear-gradient(to_bottom,#334155_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] opacity-25 pointer-events-none" />
        
        {/* Glow */}
        <div className="absolute -top-10 left-1/2 -translate-x-1/2 w-[500px] h-[300px] bg-yellow-500/10 rounded-full blur-[140px] pointer-events-none" />

        <div className="relative mx-auto max-w-7xl w-full px-4 sm:px-6 lg:px-8 text-center flex flex-col items-center">
          
          {/* Top Sparks Badge restored */}
          <div className="flex items-center gap-2 rounded-full border border-yellow-500/20 bg-yellow-500/5 px-3 py-1 text-[10px] font-extrabold tracking-widest uppercase text-yellow-500 mb-3.5">
            <Sparkles className="h-3.5 w-3.5" />
            <span>Heavy-Duty & Professional Equipment</span>
          </div>

          <h1 className="text-2xl sm:text-4xl lg:text-5xl font-black tracking-tight text-white max-w-4xl leading-tight font-sans">
            Built for Professionals. <br />
            <span className="bg-gradient-to-r from-yellow-400 to-amber-500 bg-clip-text text-transparent">
              Engineered to Outperform.
            </span>
          </h1>

          <p className="mt-3.5 max-w-lg text-xs sm:text-sm text-slate-400 font-medium leading-relaxed">
            Professional-grade thermal fogger sprayers and heavy-duty cordless power toolsets.
          </p>

          {/* Hero CTAs */}
          <div className="mt-6 flex flex-col sm:flex-row gap-3">
            <Link
              href="/products"
              className="flex items-center justify-center gap-1.5 rounded-xl bg-yellow-500 px-6 py-2.5 text-xs font-black text-slate-950 hover:bg-yellow-600 transition-all duration-300 shadow-lg shadow-yellow-500/10"
            >
              Browse Equipment Catalog
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
            <Link
              href="/contact"
              className="flex items-center justify-center gap-1.5 rounded-xl bg-slate-800/80 border border-slate-700 px-6 py-2.5 text-xs font-bold text-white hover:bg-slate-700/80 transition-all duration-300"
            >
              Order via Hotline Call
            </Link>
          </div>

        </div>
      </section>

      {/* SECTION 1: Featured Products (Immediately follows Hero, partially visible on desktop) */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12 w-full flex-grow">
        
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between mb-8 border-b border-slate-200 pb-5 gap-3">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-yellow-600 block">Our Shop Catalog</span>
            <h2 className="text-xl font-black tracking-tight text-slate-900 mt-0.5">Featured Equipment</h2>
          </div>
          <Link
            href="/products"
            className="inline-flex items-center gap-1 text-xs font-bold text-slate-500 hover:text-yellow-600 transition-colors uppercase tracking-widest"
          >
            <span>All Products</span>
            <ChevronRightIcon />
          </Link>
        </div>

        {error && (
          <div className="rounded-xl bg-amber-500/10 border border-amber-500/20 p-4 mb-8 flex gap-3 text-sm text-amber-600">
            <AlertCircle className="h-5 w-5 shrink-0 mt-0.5" />
            <div>
              <p className="font-bold">Setup Connection Required</p>
              <p className="text-slate-655 mt-1 leading-relaxed">{error}</p>
            </div>
          </div>
        )}

        {/* Loading State */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="animate-pulse rounded-2xl border border-slate-200 bg-white p-5 h-[360px] flex flex-col justify-between shadow-sm">
                <div className="aspect-square w-full rounded-xl bg-slate-100" />
                <div className="h-4 bg-slate-100 rounded mt-4 w-3/4" />
                <div className="h-3 bg-slate-100 rounded mt-2 w-1/2" />
                <div className="h-8 bg-slate-100 rounded mt-4 w-full" />
              </div>
            ))}
          </div>
        ) : products.length > 0 ? (
          /* Products Grid */
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {products.slice(0, 6).map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onOpenDetails={setSelectedProduct}
              />
            ))}
          </div>
        ) : (
          /* Empty State */
          <div className="flex flex-col items-center justify-center py-20 text-center border-2 border-dashed border-slate-200 rounded-3xl bg-white shadow-sm">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-slate-50 border border-slate-200 mb-4 text-slate-400">
              <ShoppingBag className="h-6 w-6" />
            </div>
            <h3 className="text-base font-bold text-slate-900">No products found</h3>
            <p className="text-xs text-slate-500 mt-1 max-w-xs">
              Database is currently offline or products have not been seeded yet.
            </p>
          </div>
        )}
      </section>

      {/* SECTION 2: Feature Showcase Grid (Swapped to follow Products) */}
      <section className="py-16 bg-white border-b border-slate-200">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <h2 className="text-xl font-black text-slate-900 tracking-tight">Specialized Product Core Categories</h2>
            <p className="text-xs text-slate-500 mt-1.5">Engineered to meet the requirements of construction professionals, contractors, and vector control operators.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Category 1: Fogging Machine */}
            <div className="bg-slate-50 rounded-3xl p-6 border border-slate-200 shadow-sm flex flex-col justify-between hover:border-yellow-400 transition-all duration-300 group">
              <div>
                <div className="h-10 w-10 rounded-xl bg-slate-900 text-yellow-500 flex items-center justify-center mb-5">
                  <Flame className="h-5.5 w-5.5" />
                </div>
                <h3 className="text-lg font-extrabold text-slate-955">Thermal Fogging Equipment</h3>
                <p className="text-xs text-slate-500 mt-2 leading-relaxed">
                  Our Pulsed Power Sprayer Thermal Fogging Machines are optimized for sanitization, pest control, and disinfection. Outfitted with high-grade stainless steel barrels, rugged structural frames, and corrosion-resistant tanks, they are built to withstand intensive field use.
                </p>
                <ul className="mt-4 space-y-1.5 text-xs text-slate-600 font-semibold">
                  <li className="flex items-center gap-2">
                    <span className="h-1.5 w-1.5 rounded-full bg-yellow-500"></span>
                    High-Grade Stainless Steel Barrel & Body
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="h-1.5 w-1.5 rounded-full bg-yellow-500"></span>
                    Ideal for Pest Control, Disinfection & Sanitization
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="h-1.5 w-1.5 rounded-full bg-yellow-500"></span>
                    Dual Fuel & Chemical Solution Tanks
                  </li>
                </ul>
              </div>
              <div className="mt-6">
                <Link
                  href="/products"
                  className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-900 hover:text-yellow-600 transition-colors uppercase tracking-wider"
                >
                  <span>Explore Models</span>
                  <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>
            </div>

            {/* Category 2: Cordless Drills */}
            <div className="bg-slate-50 rounded-3xl p-6 border border-slate-200 shadow-sm flex flex-col justify-between hover:border-yellow-400 transition-all duration-300 group">
              <div>
                <div className="h-10 w-10 rounded-xl bg-slate-900 text-yellow-500 flex items-center justify-center mb-5">
                  <Zap className="h-5.5 w-5.5" />
                </div>
                <h3 className="text-lg font-extrabold text-slate-955">Cordless Power Toolsets</h3>
                <p className="text-xs text-slate-500 mt-2 leading-relaxed">
                  Mitofavour brushless drill/drivers and angle grinder combination kits. Powered by 18V XR 4.0Ah high-capacity lithium-ion battery packs, they allow contractors and DIYers to drill, cut, and break through hard masonry or steel on a single battery charge.
                </p>
                <ul className="mt-4 space-y-1.5 text-xs text-slate-655 font-semibold">
                  <li className="flex items-center gap-2">
                    <span className="h-1.5 w-1.5 rounded-full bg-yellow-500"></span>
                    18V Brushless Motors & Fast-Charger Pack
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="h-1.5 w-1.5 rounded-full bg-yellow-500"></span>
                    Includes Rotary Hammer & Angle Grinder set
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="h-1.5 w-1.5 rounded-full bg-yellow-500"></span>
                    Complete accessories (bits, saws, screwdrivers, case)
                  </li>
                </ul>
              </div>
              <div className="mt-6">
                <Link
                  href="/products"
                  className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-900 hover:text-yellow-600 transition-colors uppercase tracking-wider"
                >
                  <span>View Drill Combo Kits</span>
                  <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 2.5: Customer Testimonials */}
      <Testimonials />

      {/* SECTION 3: Why Mitofavour (Value Props) */}
      <section className="bg-slate-900 border-t border-slate-950 py-16 text-white text-center">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto mb-12">
            <span className="text-[10px] font-bold uppercase tracking-widest text-yellow-500">Service Highlights</span>
            <h2 className="text-xl font-black mt-1">Why Buy From Mitofavour?</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-left">
            <div className="p-6 bg-slate-800/50 rounded-2xl border border-slate-700/50 flex flex-col gap-3">
              <div className="h-10 w-10 rounded-xl bg-yellow-500 text-slate-950 flex items-center justify-center shrink-0">
                <ShieldCheck className="h-5.5 w-5.5 font-bold" />
              </div>
              <h3 className="text-base font-bold">100% Cash on Delivery</h3>
              <p className="text-xs text-slate-455 leading-relaxed">
                Pay only when the package reaches your doorstep. Inspect your machine or tools before you pay, ensuring complete safety and satisfaction.
              </p>
            </div>

            <div className="p-6 bg-slate-800/50 rounded-2xl border border-slate-700/50 flex flex-col gap-3">
              <div className="h-10 w-10 rounded-xl bg-yellow-500 text-slate-955 flex items-center justify-center shrink-0">
                <Award className="h-5.5 w-5.5" />
              </div>
              <h3 className="text-base font-bold">Vouched Contractors Choice</h3>
              <p className="text-xs text-slate-455 leading-relaxed">
                Our tools are widely used by professional plumbers, electricians, general contractors, and vector control agencies across the region.
              </p>
            </div>

            <div className="p-6 bg-slate-800/50 rounded-2xl border border-slate-700/50 flex flex-col gap-3">
              <div className="h-10 w-10 rounded-xl bg-yellow-500 text-slate-955 flex items-center justify-center shrink-0">
                <Zap className="h-5.5 w-5.5" />
              </div>
              <h3 className="text-base font-bold">Dual Batteries & Full Set</h3>
              <p className="text-xs text-slate-455 leading-relaxed">
                We do not sell bare tools. All our cordless sets come with dual 18V rechargeable battery packs, chargers, and extensive hand tools assortments.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <Footer />

      {/* Product Detail Modal */}
      {selectedProduct && (
        <ProductModal
          product={selectedProduct}
          onClose={() => setSelectedProduct(null)}
        />
      )}
    </div>
  );
}

function ChevronRightIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2.5" stroke="currentColor" className="h-3.5 w-3.5">
      <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
    </svg>
  );
}
