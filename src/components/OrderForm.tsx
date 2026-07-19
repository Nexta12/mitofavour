'use client';

import { useState } from 'react';
import { ShieldCheck, Truck, ArrowRight, Loader2, MessageCircle, PhoneCall } from 'lucide-react';
import * as fpixel from '@/lib/fpixel';

export default function OrderForm({ price }: { price?: number }) {
  const basePrice = price || 185000;
  const formatPrice = (amount: number) => new Intl.NumberFormat('en-NG', { style: 'currency', currency: 'NGN', maximumFractionDigits: 0 }).format(amount);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    
    const formData = new FormData(e.currentTarget);
    const fullName = formData.get('fullName');
    const altPhone = formData.get('altPhone') || 'None provided';
    const phone = formData.get('phone');
    const address = formData.get('address');
    const quantity = formData.get('quantity');

    const web3FormsKey = process.env.NEXT_PUBLIC_WEB3FORMS_ACCESS_KEY || '';
    
    try {
      const response = await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify({
          access_key: web3FormsKey,
          subject: 'New Cash on Delivery Order - Mitofavour',
          from_name: 'Mitofavour Orders',
          name: fullName,
          phone: phone,
          alt_phone: altPhone,
          address: address,
          quantity: quantity,
          base_price: price,
        }),
      });

      if (response.ok) {
        setSuccess(true);
        // Fire Facebook Pixel Purchase Event
        fpixel.event('Purchase', {
          currency: 'NGN',
          value: (price || 185000) * parseInt(quantity as string || '1', 10),
          content_name: 'Mitofavour Tool Order',
        });
      } else {
        alert('Something went wrong. Please try again or contact us via WhatsApp.');
      }
    } catch (err) {
      alert('Network error. Please check your connection and try again.');
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="bg-white rounded-2xl shadow-xl p-8 text-center border-t-4 border-green-500 max-w-2xl mx-auto">
        <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
          <ShieldCheck className="w-8 h-8" />
        </div>
        <h3 className="text-2xl font-black text-slate-900 mb-2">Order Confirmed!</h3>
        <p className="text-slate-600 mb-6 leading-relaxed">
          Thank you for your order. Our customer care representative will call you shortly to confirm your delivery address.
        </p>
        <div className="bg-slate-50 rounded-xl p-4 border border-slate-100 text-sm font-medium text-slate-700">
          <p className="flex items-center justify-center gap-2 mb-2">
            <Truck className="w-4 h-4 text-amber-500" />
            Delivery takes 2-5 working days.
          </p>
          <p className="text-amber-600 font-bold">Please ensure you have the cash ready or a transfer option available upon delivery.</p>
        </div>
      </div>
    );
  }

  return (
    <div id="order-form" className="max-w-2xl mx-auto bg-white rounded-xl shadow-2xl overflow-hidden border border-slate-200">
      {/* Form Header */}
      <div className="bg-slate-900 text-center py-8 px-6 text-white border-b-4 border-amber-500">
        <h2 className="text-3xl font-black tracking-tight mb-2 uppercase">Place Your Order Now</h2>
        <h3 className="text-lg text-amber-400 font-bold mb-3">Fill in Your Details to Secure Your Machine</h3>
        <p className="text-sm text-slate-300 font-medium max-w-md mx-auto">
          Don't compromise on sanitization quality — secure yours today.
        </p>
      </div>

      <div className="p-6 md:p-8">
        {/* Important Notice Box */}
        <div className="bg-red-50 border border-red-200 rounded-lg p-5 mb-8 text-center relative overflow-hidden">
          <div className="absolute top-0 left-0 w-1 h-full bg-red-600"></div>
          <p className="text-red-700 font-bold text-[15px] leading-relaxed">
            <span className="uppercase font-black block mb-1">Important Notice:</span>
            Do NOT fill this form if you are not financially ready and available to receive and pay for your package within 24–48 hours anywhere in Nigeria.
          </p>
          <p className="text-xs text-red-600 mt-3 font-semibold uppercase tracking-wider">
            Please double-check your details to ensure fast processing and avoid delays.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label htmlFor="fullName" className="block text-[15px] font-bold text-slate-800 mb-1.5">Full Name *</label>
            <input 
              type="text" 
              id="fullName"
              name="fullName" 
              required
              className="w-full px-4 py-3.5 rounded-lg border border-slate-300 focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 outline-none transition-all font-medium text-slate-900 bg-white"
              placeholder="Enter your full name"
            />
          </div>

          <div>
            <label htmlFor="altPhone" className="block text-[15px] font-bold text-slate-800 mb-1.5">Alternative Phone No</label>
            <input 
              type="tel" 
              id="altPhone" 
              name="altPhone" 
              className="w-full px-4 py-3.5 rounded-lg border border-slate-300 focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 outline-none transition-all font-medium text-slate-900 bg-white"
              placeholder="Second active phone number"
            />
          </div>

          <div>
            <label htmlFor="phone" className="block text-[15px] font-bold text-slate-800 mb-1.5">Phone No *</label>
            <input 
              type="tel" 
              id="phone"
              name="phone" 
              required
              className="w-full px-4 py-3.5 rounded-lg border border-slate-300 focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 outline-none transition-all font-medium text-slate-900 bg-white"
              placeholder="Your active phone number"
            />
          </div>

          <div>
            <label htmlFor="address" className="block text-[15px] font-bold text-slate-800 mb-1.5">Delivery address: state local govt street name and no *</label>
            <textarea 
              id="address"
              name="address" 
              required
              rows={4}
              className="w-full px-4 py-3.5 rounded-lg border border-slate-300 focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 outline-none transition-all font-medium text-slate-900 bg-white resize-none leading-relaxed"
              placeholder="Provide full address including House Number, Street, LGA and State."
            ></textarea>
          </div>

          <div>
            <label htmlFor="quantity" className="block text-[15px] font-bold text-slate-800 mb-1.5">CHOOSE HOW MANY YOU NEED *</label>
            <select 
              id="quantity"
              name="quantity" 
              required
              className="w-full px-4 py-3.5 rounded-lg border border-slate-300 focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 outline-none transition-all font-bold text-slate-900 bg-white appearance-none"
            >
              <option value="1">1 Unit - {formatPrice(basePrice)}</option>
              <option value="2">2 Units - {formatPrice(basePrice * 2)}</option>
              <option value="3">3 Units - {formatPrice(basePrice * 3)}</option>
              <option value="bulk">Bulk Order (We will contact you)</option>
            </select>
          </div>

          <div className="pt-6">
            <button 
              type="submit" 
              disabled={loading}
              className="w-full bg-yellow-400 hover:bg-yellow-500 text-slate-900 font-black text-[19px] py-5 rounded-lg shadow-[0_6px_0_#ca8a04] active:shadow-[0_0px_0_#ca8a04] active:translate-y-1.5 flex items-center justify-center gap-2 transition-all disabled:opacity-70 disabled:cursor-not-allowed uppercase tracking-wide"
            >
              {loading ? (
                <Loader2 className="w-6 h-6 animate-spin" />
              ) : (
                <>
                  SEND MY ORDER NOW
                </>
              )}
            </button>
          </div>
        </form>

        {/* Support Section */}
        <div className="mt-12 text-center border-t border-slate-200 pt-8">
          <h4 className="text-slate-800 font-bold text-lg mb-4">Got Questions? Call or WhatsApp. We're always very available to assist you</h4>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <a 
              href="https://wa.me/2348103859976" 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex items-center gap-2 bg-[#25D366] text-white font-bold px-6 py-3 rounded-full hover:bg-[#20bd5a] transition-colors shadow-md"
            >
              <MessageCircle className="w-5 h-5 fill-current" />
              Chat on WhatsApp
            </a>
            
            <a 
              href="tel:08103859976" 
              className="flex items-center gap-2 bg-slate-100 text-slate-800 font-bold px-6 py-3 rounded-full hover:bg-slate-200 transition-colors border border-slate-300"
            >
              <PhoneCall className="w-5 h-5" />
              Call 08103859976
            </a>
          </div>
        </div>

      </div>
    </div>
  );
}
