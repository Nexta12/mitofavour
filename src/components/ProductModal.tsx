'use client';

import { Product } from '@/types';
import { X, Phone, MessageSquare, Truck, CheckCircle2, Loader2, Info, Link2, Check } from 'lucide-react';
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
  const [copied, setCopied] = useState(false);

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
    const message = `Hello Favour, I'm interested in purchasing: *${product.name}*${specString}.\nPrice: ${currencySymbol}${formattedPrice}\nQuantity: ${quantity}\nPlease let me know how to proceed.`;
    window.open(`https://wa.me/${whatsappPhone}?text=${encodeURIComponent(message)}`, '_blank');
  };

  const getShareUrl = () => {
    if (typeof window === 'undefined') return 'https://mitofavour.com/products';
    return `${window.location.origin}/products?product=${product.id}`;
  };

  const shareToFacebook = () => {
    const url = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(getShareUrl())}`;
    window.open(url, '_blank', 'width=600,height=400,noopener,noreferrer');
  };

  const shareToWhatsApp = () => {
    const text = `Check out this premium equipment: *${product.name}* at Mitofavour! ${getShareUrl()}`;
    const url = `https://api.whatsapp.com/send?text=${encodeURIComponent(text)}`;
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  const copyLinkToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(getShareUrl());
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy link: ', err);
    }
  };

  const handleSpecChange = (key: string, value: string) => {
    setSelectedSpecs((prev) => ({ ...prev, [key]: value }));
  };

  const renderDescription = (text: string) => {
    if (!text) return <p className="text-xs text-slate-400 italic">No description available for this product.</p>;
    
    return text.split('\n').map((line, index) => {
      const trimmed = line.trim();
      if (!trimmed) {
        return <div key={index} className="h-2" />;
      }
      
      const isHeader = /^\d+[\.\)]\s*/.test(trimmed);
      const isBullet = /^[▪️•\*\-]\s*/.test(trimmed);
      
      if (isHeader) {
        return (
          <h4 key={index} className="font-extrabold text-slate-900 mt-4.5 mb-1.5 text-[11px] uppercase tracking-wider">
            {line}
          </h4>
        );
      }
      
      if (isBullet) {
        // Render bullet with indent
        return (
          <div key={index} className="pl-4 flex items-start gap-1.5 text-xs leading-relaxed text-slate-655 my-0.5">
            <span className="select-none text-slate-400 mt-0.5">{trimmed.charAt(0)}</span>
            <span>{trimmed.substring(1).trim()}</span>
          </div>
        );
      }
      
      return (
        <p key={index} className="text-xs leading-relaxed text-slate-500 my-1">
          {line}
        </p>
      );
    });
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
                
                <div className="mt-2.5 flex items-baseline gap-2 flex-wrap">
                  <span className="text-2xl font-black text-slate-900">
                    {currencySymbol}{formattedPrice}
                  </span>
                  <span className="text-[10px] font-bold text-slate-450 uppercase tracking-widest bg-slate-100 px-2 py-0.5 rounded border border-slate-200">
                    Pay on Delivery
                  </span>
                  <span className="text-[10px] font-bold text-emerald-700 uppercase tracking-widest bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                    Free Delivery
                  </span>
                </div>

                <div className="mt-4 border-t border-slate-100 pt-4">
                  <div className="space-y-1">
                    {renderDescription(product.description || '')}
                  </div>
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

                      {/* Social Media Sharing */}
                      <div className="mt-4 border-t border-slate-100 pt-4">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-slate-450 block mb-2.5">
                          Share this product
                        </span>
                        <div className="grid grid-cols-3 gap-2">
                          <button
                            type="button"
                            onClick={shareToFacebook}
                            className="flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white py-2.5 text-xs font-bold text-slate-700 hover:bg-slate-50 hover:text-slate-900 hover:border-slate-300 transition-all duration-300 cursor-pointer shadow-xs"
                          >
                            <svg className="h-4 w-4 fill-[#1877F2]" viewBox="0 0 24 24">
                              <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                            </svg>
                            <span>Facebook</span>
                          </button>

                          <button
                            type="button"
                            onClick={shareToWhatsApp}
                            className="flex items-center justify-center gap-2 rounded-xl border border-slate-250 bg-white py-2.5 text-xs font-bold text-slate-700 hover:bg-slate-50 hover:text-slate-900 hover:border-slate-350 transition-all duration-300 cursor-pointer shadow-xs"
                          >
                            <svg className="h-4 w-4 fill-[#25D366]" viewBox="0 0 24 24">
                              <path d="M17.472 14.382c-.022-.015-.022-.015-.022-.015a9.7 9.7 0 0 0-.486-.24c-.265-.125-.433-.193-.6-.02-.167.172-.65.818-.797.986-.147.168-.293.187-.558.062a7.0 7.0 0 0 1-2.073-1.28 7.37 7.37 0 0 1-1.436-1.787c-.157-.27-.017-.417.118-.552l.46-.532c.114-.148.167-.24.24-.393a.5.5 0 0 0-.02-.486c-.074-.15-.658-1.583-.902-2.17-.23-.556-.475-.48-.65-.488-.168-.008-.363-.01-.559-.01a1.08 1.08 0 0 0-.78.365c-.27.293-1.03 1.01-1.03 2.46s1.055 2.85 1.2 3.05c.147.2 2.08 3.176 5.04 4.46.703.305 1.25.487 1.68.624a4.13 4.13 0 0 0 1.888.118c.579-.086 1.794-.732 2.05-1.44a2.53 2.53 0 0 0 .178-1.44c-.074-.132-.27-.21-.558-.352zM12 2C6.48 2 2 6.48 2 12a9.9 9.9 0 0 0 1.34 4.96L2 22l5.14-1.34A9.96 9.96 0 0 0 12 22c5.52 0 10-4.48 10-10S17.52 2 12 2zm0 18c-1.63 0-3.14-.5-4.41-1.35l-.32-.22-3.26.85.87-3.18-.24-.38A7.94 7.94 0 0 1 4 12c0-4.41 3.59-8 8-8s8 3.59 8 8-3.59 8-8 8z"/>
                            </svg>
                            <span>WhatsApp</span>
                          </button>

                          <button
                            type="button"
                            onClick={copyLinkToClipboard}
                            className="flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white py-2.5 text-xs font-bold text-slate-700 hover:bg-slate-50 hover:text-slate-900 hover:border-slate-350 transition-all duration-300 cursor-pointer shadow-xs"
                          >
                            {copied ? (
                              <>
                                <Check className="h-4 w-4 text-emerald-500 shrink-0" />
                                <span className="text-emerald-600">Copied!</span>
                              </>
                            ) : (
                              <>
                                <Link2 className="h-4 w-4 text-slate-400 shrink-0" />
                                <span>Copy Link</span>
                              </>
                            )}
                          </button>
                        </div>
                      </div>
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
