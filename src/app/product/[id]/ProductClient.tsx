'use client';

import { ArrowRight, CheckCircle2, ShieldCheck, Truck, Zap, Flame, Award } from 'lucide-react';
import FakeSalesNotification from '@/components/FakeSalesNotification';
import CountdownTimer from '@/components/CountdownTimer';
import OrderForm from '@/components/OrderForm';
import Footer from '@/components/Footer';
import { Product } from '@/types';

export default function ProductClient({ product }: { product: Product }) {
  // Use price if available, otherwise fallback to a generic formatting
  const priceDisplay = product.price 
    ? new Intl.NumberFormat('en-NG', { style: 'currency', currency: 'NGN', maximumFractionDigits: 0 }).format(product.price)
    : '₦185,000';
    
  // Format the promo price (original price) slightly higher
  const originalPriceDisplay = product.details?._original_price
    ? new Intl.NumberFormat('en-NG', { style: 'currency', currency: 'NGN', maximumFractionDigits: 0 }).format(Number(product.details._original_price))
    : product.price
      ? new Intl.NumberFormat('en-NG', { style: 'currency', currency: 'NGN', maximumFractionDigits: 0 }).format(Math.floor(product.price * 1.35))
      : '₦250,000';

  const tagline = product.details?._tagline || '⚙️ Premium Industrial Equipment';
  const catchphrase = product.details?._catchphrase || `${product.name}. Built for Professionals.`;

  const mainImage = product.image_url || '/thermal_fogging_machine.jpg';

  return (
    <div className="flex flex-col min-h-screen bg-slate-50 text-slate-800 font-sans selection:bg-amber-200">
      <FakeSalesNotification />

      {/* Promo Bar */}
      <div className="bg-amber-600 text-white text-center py-2.5 px-4 text-xs sm:text-sm font-bold tracking-wide shadow-md relative z-10">
        🔥 <span className="text-amber-100">LIMITED PROMO:</span> {product.name} now {priceDisplay} — Promo ends soon. Order before stock runs out!
      </div>

      {/* Header/Hero Section */}
      <section className="bg-white border-b border-slate-200 pt-8 pb-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center">
          
          <div className="inline-flex items-center justify-center bg-amber-50 border border-amber-200 text-amber-700 px-5 py-1.5 rounded-full text-xs font-black tracking-widest uppercase mb-6">
            {tagline}
          </div>

          <h1 className="text-3xl sm:text-5xl font-black text-slate-900 tracking-tight leading-tight mb-4">
            {catchphrase}
          </h1>

          <div className="flex justify-center mb-8">
            <div className="bg-emerald-100 border border-emerald-200 text-emerald-800 px-5 py-2.5 rounded-xl text-sm font-black uppercase tracking-widest flex items-center gap-2.5 shadow-sm transform hover:scale-105 transition-transform">
              <Truck className="w-5 h-5 text-emerald-600" />
              100% PAYMENT ON DELIVERY
            </div>
          </div>

          {/* Product Images Gallery (No Slider) */}
          <div className="max-w-2xl mx-auto mb-8 space-y-3 sm:space-y-4">
            {/* Main Image */}
            <div className="relative rounded-2xl overflow-hidden shadow-2xl border-4 border-white bg-slate-100 aspect-video flex items-center justify-center">
              <div className="absolute inset-0 bg-gradient-to-tr from-slate-200 to-slate-100 animate-pulse -z-10"></div>
              <img 
                src={mainImage} 
                alt={`${product.name} - Main View`}
                className="object-cover w-full h-full"
                onError={(e) => {
                  e.currentTarget.src = 'https://placehold.co/800x450/e2e8f0/475569?text=Product+Image+1';
                }}
              />
            </div>
            
            {/* Additional Angles/Images */}
            {(product.details?._image2 || product.details?._image3) && (
              <div className="flex flex-col gap-3 sm:gap-4">
                {product.details?._image2 && (
                  <div className="relative rounded-2xl overflow-hidden shadow-2xl border-4 border-white bg-slate-100 aspect-video flex items-center justify-center">
                    <div className="absolute inset-0 bg-gradient-to-tr from-slate-200 to-slate-100 animate-pulse -z-10"></div>
                    <img 
                      src={product.details._image2 as string} 
                      alt={`${product.name} - View 2`} 
                      className="object-cover w-full h-full"
                    />
                  </div>
                )}
                {product.details?._image3 && (
                  <div className="relative rounded-2xl overflow-hidden shadow-2xl border-4 border-white bg-slate-100 aspect-video flex items-center justify-center">
                    <div className="absolute inset-0 bg-gradient-to-tr from-slate-200 to-slate-100 animate-pulse -z-10"></div>
                    <img 
                      src={product.details._image3 as string} 
                      alt={`${product.name} - View 3`} 
                      className="object-cover w-full h-full"
                    />
                  </div>
                )}
              </div>
            )}
          </div>

          <div className="text-[15px] sm:text-base text-slate-700 font-medium max-w-2xl mx-auto mb-8 leading-relaxed text-left bg-amber-50/50 p-6 sm:p-8 rounded-2xl border border-amber-100 shadow-sm">
            {product.description ? (
              <div className="whitespace-pre-wrap">
                {product.description.includes('\n') 
                  ? product.description 
                  : product.description.replace(/(\s?\d+\.)/g, '\n\n$1').replace(/(▪️|•)/g, '\n  $1 ')}
              </div>
            ) : (
              <p className="text-center">The <strong>{product.name}</strong> is engineered to deliver maximum power and reliability on every job — ensuring you get the best results without compromise.</p>
            )}
          </div>

          <div className="flex flex-wrap justify-center gap-2 sm:gap-4 mb-10">
            <span className="bg-slate-100 border border-slate-200 text-slate-700 px-4 py-2 rounded-full text-xs font-bold flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-amber-600" /> High-Grade Quality
            </span>
            <span className="bg-slate-100 border border-slate-200 text-slate-700 px-4 py-2 rounded-full text-xs font-bold flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-amber-600" /> 1-Year Warranty
            </span>
            <span className="bg-slate-100 border border-slate-200 text-slate-700 px-4 py-2 rounded-full text-xs font-bold flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-amber-600" /> Easy to Operate
            </span>
            <span className="bg-slate-100 border border-slate-200 text-slate-700 px-4 py-2 rounded-full text-xs font-bold flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-amber-600" /> Fast Nationwide Delivery
            </span>
          </div>

          <div className="max-w-md mx-auto bg-white rounded-2xl shadow-xl p-8 border-[3px] border-amber-500 relative">
            <div className="absolute -top-4 -right-4 bg-amber-600 text-white text-[10px] font-black tracking-widest uppercase px-6 py-2 transform rotate-12 shadow-lg">
              GET IT TODAY
            </div>
            
            <a 
              href="#order-form" 
              className="block w-full bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white text-lg font-black py-5 rounded-xl shadow-lg shadow-amber-500/40 transition-all transform hover:scale-105 active:scale-95"
            >
              🛒 ORDER NOW AT {priceDisplay} →
              <span className="block text-[10px] font-bold opacity-90 mt-1 uppercase tracking-widest">
                Pay on Delivery Available
              </span>
            </a>
            
            <p className="text-xs text-slate-500 mt-4 flex items-center justify-center gap-3 font-medium">
              <span className="flex items-center gap-1"><ShieldCheck className="w-3.5 h-3.5" /> Secure Order</span>
              <span className="flex items-center gap-1"><Truck className="w-3.5 h-3.5" /> Fast Delivery</span>
            </p>
          </div>

        </div>
      </section>

      {/* Urgency & Countdown Section */}
      <section className="bg-slate-900 text-white py-12 relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-20"></div>
        <div className="max-w-4xl mx-auto px-4 text-center relative z-10">
          <h2 className="text-sm sm:text-base font-black tracking-widest uppercase text-white/90 mb-6">
            🔥 Limited Time Promo — <span className="text-amber-400">Price Returns to {originalPriceDisplay} When This Ends</span>
          </h2>
          <CountdownTimer />
        </div>
      </section>

      {/* Form Section */}
      <section className="py-16 bg-white border-t border-slate-200 relative">
        <div className="absolute top-0 inset-x-0 h-64 bg-gradient-to-b from-slate-50 to-white"></div>
        
        <div className="max-w-4xl mx-auto px-4 relative z-10">
          <div className="mb-10 text-center">
            <h2 className="text-3xl font-black text-slate-900 mb-4">Ready to Upgrade Your Equipment?</h2>
            <p className="text-slate-600 font-medium">Take advantage of the promo price before the timer runs out. Fill the form to place your order securely.</p>
          </div>

          <OrderForm price={product.price} />
        </div>
      </section>

      {/* Trust Badges */}
      <section className="bg-amber-50 border-b border-amber-100 py-6">
        <div className="max-w-5xl mx-auto px-4 flex flex-wrap justify-center items-center gap-x-8 gap-y-4">
          <span className="flex items-center gap-2 text-sm font-bold text-slate-800">
            <Award className="w-5 h-5 text-amber-600" /> Trusted by Contractors
          </span>
          <span className="flex items-center gap-2 text-sm font-bold text-slate-800">
            <ShieldCheck className="w-5 h-5 text-amber-600" /> 1-Year Full Warranty
          </span>
          <span className="flex items-center gap-2 text-sm font-bold text-slate-800">
            <Truck className="w-5 h-5 text-amber-600" /> Free Nationwide Delivery
          </span>
        </div>
      </section>

      {/* Why it Matters Section */}
      <section className="py-16 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-10">
            <span className="inline-block bg-amber-50 text-amber-600 px-5 py-1.5 rounded-full text-xs font-black tracking-widest uppercase mb-4">
              Why Quality Equipment Matters
            </span>
            <h2 className="text-2xl sm:text-4xl font-black text-slate-900 tracking-tight">
              Cheap Equipment Breaks Down. Don't Risk Your Projects.
            </h2>
          </div>

          <div className="bg-gradient-to-br from-slate-50 to-amber-50/50 border-l-4 border-amber-500 rounded-2xl p-6 sm:p-10 mb-12 shadow-sm relative text-slate-700 font-medium text-lg leading-relaxed">
            <span className="absolute -top-6 left-6 text-7xl text-amber-200 font-serif leading-none">"</span>
            <p className="relative z-10">
              Every successful project requires deep, reliable performance. The <strong>{product.name}</strong> delivers consistent results that <strong>save you time, reduce waste, and leave a professional-quality finish</strong> — avoiding the headache of callbacks.
            </p>
            <p className="relative z-10 mt-4 text-slate-900 font-bold">
              Power. Reliability. Performance — built into one machine that professionals across Nigeria depend on daily.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            <div className="bg-slate-900 rounded-2xl p-6 text-center text-white shadow-xl">
              <div className="font-sans text-3xl font-black text-amber-400 mb-2">Powerful</div>
              <div className="text-sm text-slate-300 font-medium">Consistent performance every pass for maximum coverage.</div>
            </div>
            <div className="bg-slate-900 rounded-2xl p-6 text-center text-white shadow-xl">
              <div className="font-sans text-3xl font-black text-amber-400 mb-2">Fast</div>
              <div className="text-sm text-slate-300 font-medium">Saves time and costs on large-scale jobs.</div>
            </div>
            <div className="bg-slate-900 rounded-2xl p-6 text-center text-white shadow-xl">
              <div className="font-sans text-3xl font-black text-amber-400 mb-2">Built</div>
              <div className="text-sm text-slate-300 font-medium">To last through demanding industrial applications.</div>
            </div>
          </div>
        </div>
      </section>

      {/* Feature Grid */}
      <section className="py-16 bg-slate-50 border-t border-slate-200">
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-12">
            <span className="inline-block bg-amber-100 text-amber-700 px-5 py-1.5 rounded-full text-xs font-black tracking-widest uppercase mb-4">
              Get More Done
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              Perfect For Every Type of Professional Project
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="bg-white border-t-4 border-amber-500 rounded-2xl p-6 shadow-sm">
              <div className="text-3xl mb-3">🏢</div>
              <h4 className="font-bold text-slate-900 text-lg mb-2">Commercial Buildings</h4>
              <p className="text-sm text-slate-600">Rapidly execute large-scale jobs in office spaces, warehouses, and factories.</p>
            </div>
            <div className="bg-white border-t-4 border-amber-500 rounded-2xl p-6 shadow-sm">
              <div className="text-3xl mb-3">🏥</div>
              <h4 className="font-bold text-slate-900 text-lg mb-2">Professional Facilities</h4>
              <p className="text-sm text-slate-600">Ensure high-standard environments by deploying reliable equipment efficiently.</p>
            </div>
            <div className="bg-white border-t-4 border-amber-500 rounded-2xl p-6 shadow-sm">
              <div className="text-3xl mb-3">🌾</div>
              <h4 className="font-bold text-slate-900 text-lg mb-2">Large Sites</h4>
              <p className="text-sm text-slate-600">Protect investments with even, broad-spectrum application and heavy-duty performance.</p>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
