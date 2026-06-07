'use client';

import { Product } from '@/types';
import { X, Phone, MessageSquare, Truck, CheckCircle2, Loader2, Info } from 'lucide-react';
import { useState } from 'react';

interface ProductModalProps {
  product: Product;
  onClose: () => void;
}

export default function ProductModal({ product, onClose }: ProductModalProps) {
  const [showOrderForm, setShowOrderForm] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [submitError, setSubmitError] = useState('');

  // Form states
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [selectedSpecs, setSelectedSpecs] = useState<Record<string, string>>({});

  // Configurations
  const contactPhone = process.env.NEXT_PUBLIC_CONTACT_PHONE || '+234 810 680 0185';
  const whatsappPhone = process.env.NEXT_PUBLIC_WHATSAPP_PHONE || '2348106800185';
  const currencySymbol = process.env.NEXT_PUBLIC_CURRENCY_SYMBOL || '₦';
  const web3FormsKey = process.env.NEXT_PUBLIC_WEB3FORMS_ACCESS_KEY || '';

  const formattedPrice = new Intl.NumberFormat().format(product.price);
  const totalPrice = new Intl.NumberFormat().format(product.price * quantity);

  // Pre-fill WhatsApp message
  const handleWhatsApp = () => {
    const specDetails = Object.entries(selectedSpecs)
      .map(([key, val]) => `${key}: ${val}`)
      .join(', ');
    const specString = specDetails ? ` (${specDetails})` : '';
    const message = `Hello Mitofavour, I'm interested in purchasing: *${product.name}*${specString}.\nPrice: ${currencySymbol}${formattedPrice}\nQuantity: ${quantity}\nPlease let me know how to proceed.`;
    window.open(`https://wa.me/${whatsappPhone}?text=${encodeURIComponent(message)}`, '_blank');
  };

  const handleSpecChange = (key: string, value: string) => {
    setSelectedSpecs((prev) => ({ ...prev, [key]: value }));
  };

  // Submit order to Web3Forms
  const handleOrderSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!web3FormsKey || web3FormsKey.includes('placeholder')) {
      setSubmitError('Web3Forms Access Key is not configured. Please contact the administrator.');
      return;
    }

    setIsSubmitting(true);
    setSubmitError('');

    try {
      const specString = Object.entries(selectedSpecs)
        .map(([key, val]) => `${key}: ${val}`)
        .join(', ') || 'None';

      const response = await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify({
          access_key: web3FormsKey,
          subject: `NEW ORDER: ${product.name} (Qty: ${quantity})`,
          from_name: 'Mitofavour Storefront',
          product_name: product.name,
          unit_price: `${currencySymbol}${formattedPrice}`,
          quantity: quantity,
          total_price: `${currencySymbol}${totalPrice}`,
          name: name,
          phone: phone,
          delivery_address: address,
          specifications: specString,
          payment_method: 'Pay on Delivery (Strictly)',
        }),
      });

      const result = await response.json();
      if (result.success) {
        setSubmitSuccess(true);
      } else {
        setSubmitError(result.message || 'Something went wrong. Please try again.');
      }
    } catch (err: unknown) {
      console.error(err);
      setSubmitError('Failed to submit order. Please check your internet connection.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/45 backdrop-blur-sm animate-fade-in overflow-y-auto">
      <div className="relative w-full max-w-4xl overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-2xl transition-all duration-300 flex flex-col md:flex-row max-h-[90vh] md:max-h-[85vh] my-auto">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-20 flex h-8 w-8 items-center justify-center rounded-full bg-white/80 backdrop-blur-sm border border-slate-200 text-slate-400 hover:text-slate-950 hover:border-slate-350 transition-all shadow-sm"
        >
          <X className="h-4 w-4" />
        </button>

        {/* Product Image Section */}
        <div className="w-full md:w-1/2 bg-slate-50 border-b md:border-b-0 md:border-r border-slate-100 shrink-0 relative aspect-video md:aspect-auto min-h-[220px] md:min-h-0">
          {product.image_url ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={product.image_url}
              alt={product.name}
              className="h-full w-full object-cover object-center md:absolute md:inset-0"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center text-slate-300 md:absolute md:inset-0">
              <Truck className="h-16 w-16 opacity-30" />
            </div>
          )}
        </div>

        {/* Details & Actions Section */}
        <div className="w-full md:w-1/2 p-6 md:p-8 flex flex-col justify-between overflow-y-auto">
            {!submitSuccess ? (
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-yellow-600">Product Details</span>
                <h2 className="text-xl md:text-2xl font-black tracking-tight text-slate-950 mt-1">
                  {product.name}
                </h2>
                
                <div className="mt-2.5 flex items-baseline gap-2">
                  <span className="text-2xl font-black text-slate-900">
                    {currencySymbol}{formattedPrice}
                  </span>
                  <span className="text-[10px] font-bold text-slate-450 uppercase tracking-widest bg-slate-100 px-2 py-0.5 rounded border border-slate-200">
                    Pay on Delivery
                  </span>
                </div>

                <div className="mt-4 border-t border-slate-100 pt-4">
                  <p className="text-xs leading-relaxed text-slate-500">
                    {product.description || 'No description available for this product.'}
                  </p>
                </div>

                {/* Custom Metadata Specs */}
                {product.details && Object.keys(product.details).length > 0 && (
                  <div className="mt-4 border-t border-slate-100 pt-4">
                    <h4 className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-2.5">Specifications</h4>
                    <div className="grid grid-cols-2 gap-3.5">
                      {Object.entries(product.details).map(([key, val]) => {
                        const options = val.split(',').map((o) => o.trim());
                        return (
                          <div key={key} className="flex flex-col gap-1">
                            <span className="text-[9px] text-slate-400 uppercase font-bold">{key}</span>
                            {options.length > 1 ? (
                              <select
                                onChange={(e) => handleSpecChange(key, e.target.value)}
                                className="rounded-lg border border-slate-200 bg-slate-50 px-2.5 py-1 text-xs text-slate-700 focus:border-yellow-500 focus:outline-none"
                              >
                                <option value="">Select {key}</option>
                                {options.map((option) => (
                                  <option key={option} value={option}>
                                    {option}
                                  </option>
                                ))}
                              </select>
                            ) : (
                              <span className="text-xs text-slate-800 font-semibold">{val}</span>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* Actions Form */}
                <div className="mt-6 space-y-2.5">
                  {!showOrderForm ? (
                    <>
                      {/* Delivery Form Toggle */}
                      <button
                        onClick={() => setShowOrderForm(true)}
                        className="flex w-full items-center justify-center gap-2 rounded-xl bg-yellow-500 px-4 py-3 text-sm font-black text-slate-950 hover:bg-yellow-600 transition-all duration-300 shadow-md shadow-yellow-500/10"
                      >
                        <Truck className="h-4.5 w-4.5" />
                        Order for Delivery
                      </button>

                      {/* WhatsApp */}
                      <button
                        onClick={handleWhatsApp}
                        className="flex w-full items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-bold text-slate-700 hover:bg-slate-50 hover:text-slate-900 hover:border-slate-300 transition-all duration-300"
                      >
                        <MessageSquare className="h-4.5 w-4.5 text-green-500" />
                        Order via WhatsApp
                      </button>

                      {/* Phone Hotline Call */}
                      <a
                        href={`tel:${contactPhone}`}
                        className="flex w-full items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-bold text-slate-700 hover:bg-slate-50 hover:text-slate-900 hover:border-slate-300 transition-all duration-300"
                      >
                        <Phone className="h-4.5 w-4.5 text-slate-400" />
                        Call Support: {contactPhone}
                      </a>
                    </>
                  ) : (
                    /* Order Form */
                    <form onSubmit={handleOrderSubmit} className="space-y-3 mt-4 border-t border-slate-100 pt-4 animate-fade-in">
                      <div className="flex justify-between items-center mb-1">
                        <h3 className="text-[10px] font-bold uppercase tracking-wider text-yellow-600">Delivery Details</h3>
                        <button
                          type="button"
                          onClick={() => setShowOrderForm(false)}
                          className="text-[10px] uppercase font-bold text-slate-400 hover:text-slate-600"
                        >
                          Go Back
                        </button>
                      </div>

                      {submitError && (
                        <div className="rounded-xl bg-red-50 border border-red-100 p-3 text-xs text-red-700 flex gap-2">
                          <Info className="h-4.5 w-4.5 shrink-0 text-red-500 mt-0.5" />
                          <span>{submitError}</span>
                        </div>
                      )}

                      <div className="space-y-2.5">
                        <input
                          type="text"
                          required
                          placeholder="Your Full Name"
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                          className="w-full rounded-xl border border-slate-200 bg-slate-50 focus:bg-white px-3.5 py-2.5 text-xs text-slate-800 placeholder-slate-400 focus:border-yellow-500 focus:outline-none transition-colors duration-250"
                        />
                        <input
                          type="tel"
                          required
                          placeholder="Phone Number (e.g. 0810...)"
                          value={phone}
                          onChange={(e) => setPhone(e.target.value)}
                          className="w-full rounded-xl border border-slate-200 bg-slate-50 focus:bg-white px-3.5 py-2.5 text-xs text-slate-800 placeholder-slate-400 focus:border-yellow-500 focus:outline-none transition-colors duration-250"
                        />
                        <textarea
                          required
                          placeholder="Delivery Location / Complete Address"
                          rows={2}
                          value={address}
                          onChange={(e) => setAddress(e.target.value)}
                          className="w-full rounded-xl border border-slate-200 bg-slate-50 focus:bg-white px-3.5 py-2.5 text-xs text-slate-800 placeholder-slate-400 focus:border-yellow-500 focus:outline-none resize-none transition-colors duration-250"
                        />
                        
                        <div className="flex items-center justify-between gap-4 mt-2">
                          <span className="text-[10px] text-slate-400 uppercase font-bold">Quantity</span>
                          <div className="flex items-center gap-2 border border-slate-200 rounded-xl p-1 bg-slate-50">
                            <button
                              type="button"
                              onClick={() => setQuantity(Math.max(1, quantity - 1))}
                              className="px-2.5 py-0.5 text-xs font-bold text-slate-500 hover:text-slate-900"
                            >
                              -
                            </button>
                            <span className="text-xs font-bold px-1 w-6 text-center">{quantity}</span>
                            <button
                              type="button"
                              onClick={() => setQuantity(quantity + 1)}
                              className="px-2.5 py-0.5 text-xs font-bold text-slate-500 hover:text-slate-900"
                            >
                              +
                            </button>
                          </div>
                        </div>

                        <div className="border-t border-slate-100 pt-2.5 flex items-center justify-between text-xs font-bold">
                          <span className="text-slate-400 uppercase tracking-wider">Total Price:</span>
                          <span className="text-sm font-black text-slate-950">
                            {currencySymbol}{totalPrice}
                          </span>
                        </div>
                      </div>

                      <button
                        type="submit"
                        disabled={isSubmitting}
                        className="flex w-full items-center justify-center gap-2 rounded-xl bg-yellow-500 px-4 py-3 text-sm font-black text-slate-950 hover:bg-yellow-600 disabled:bg-slate-200 disabled:text-slate-400 transition-colors shadow-md shadow-yellow-500/10 mt-3.5"
                      >
                        {isSubmitting ? (
                          <>
                            <Loader2 className="h-4 w-4 animate-spin" />
                            Submitting Order...
                          </>
                        ) : (
                          'Submit Cash on Delivery Order'
                        )}
                      </button>
                    </form>
                  )}
                </div>
              </div>
            ) : (
              /* Success View */
              <div className="flex flex-col items-center justify-center text-center py-12 gap-4">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-green-50 border border-green-200">
                  <CheckCircle2 className="h-8 w-8 text-green-500" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-950">Order Submitted!</h3>
                  <p className="text-xs text-slate-500 mt-2 px-4 leading-relaxed">
                    Thank you, <strong className="text-slate-800">{name}</strong>. Your order for <strong>{product.name} (Qty: {quantity})</strong> has been received. We will contact you at <strong>{phone}</strong> to confirm delivery timing.
                  </p>
                </div>
                <button
                  onClick={onClose}
                  className="rounded-xl border border-slate-200 bg-slate-50 px-6 py-2.5 text-xs font-semibold text-slate-650 hover:text-slate-950 hover:border-slate-350 transition-all duration-200 shadow-sm"
                >
                  Close Window
                </button>
              </div>
            )}
          </div>

        </div>

      </div>
  );
}
