'use client';

import { useState } from 'react';
import { Phone, MessageSquare, Truck, Loader2, Info, CheckCircle2 } from 'lucide-react';
import * as fpixel from '@/lib/fpixel';
import Footer from '@/components/Footer';

export default function ContactClient() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [submitError, setSubmitError] = useState('');

  const contactPhone = process.env.NEXT_PUBLIC_CONTACT_PHONE || '+234 810 680 0185';
  const whatsappPhone = process.env.NEXT_PUBLIC_WHATSAPP_PHONE || '2348106800185';
  const web3FormsKey = process.env.NEXT_PUBLIC_WEB3FORMS_ACCESS_KEY || '';

  const handleWhatsApp = () => {
    const text = "Hello  Favour, I'm interested in making an inquiry or placing an order.";
    fpixel.event('Contact');
    window.open(`https://wa.me/${whatsappPhone}?text=${encodeURIComponent(text)}`, '_blank');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!web3FormsKey || web3FormsKey.includes('placeholder')) {
      setSubmitError('Web3Forms Access Key is not configured. Please contact the administrator.');
      return;
    }

    setIsSubmitting(true);
    setSubmitError('');

    try {
      const response = await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify({
          access_key: web3FormsKey,
          subject: `GENERAL INQUIRY / CUSTOMER CONTACT: ${name}`,
          from_name: 'Mitofavour Contact Form',
          name: name,
          email: email,
          phone: phone,
          message: message,
        }),
      });

      const result = await response.json();
      if (result.success) {
        setSubmitSuccess(true);
        fpixel.event('Contact');
        setName('');
        setEmail('');
        setPhone('');
        setMessage('');
      } else {
        setSubmitError(result.message || 'Something went wrong. Please try again.');
      }
    } catch (err: unknown) {
      console.error(err);
      setSubmitError('Failed to send message. Please check your internet connection.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-slate-50 text-slate-800">
      
      {/* Page Header */}
      <section className="bg-slate-900 border-b border-slate-950 py-16 text-white text-center relative overflow-hidden">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#334155_1px,transparent_1px),linear-gradient(to_bottom,#334155_1px,transparent_1px)] bg-[size:3rem_3rem] opacity-10 pointer-events-none" />
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <span className="text-[10px] font-bold uppercase tracking-widest text-yellow-500">GET IN TOUCH</span>
          <h1 className="text-3xl sm:text-5xl font-black mt-2 tracking-tight">Contact Us</h1>
          <p className="text-sm text-slate-355 mt-3 max-w-xl mx-auto leading-relaxed">
            Have questions about our Pulsed Power Sprayer Thermal Fogging Machines or Cordless Drill Combo kits? Speak directly with our support specialists.
          </p>
        </div>
      </section>

      {/* Contact Grid Section */}
      <section className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
          
          {/* Card A: Contact Info Card */}
          <div className="bg-white border border-slate-200 p-6 md:p-8 rounded-3xl shadow-sm space-y-6">
            <div>
              <h2 className="text-xl font-bold tracking-tight text-slate-900">Direct Support Channels</h2>
              <p className="text-xs text-slate-500 mt-1 leading-relaxed">We operate strictly on cash-on-delivery. Place your order via telephone, WhatsApp, or the form, and inspect your goods before payment.</p>
            </div>

            <div className="space-y-4">
              {/* Call Hotline */}
              <div className="flex items-start gap-4">
                <div className="h-10 w-10 rounded-xl bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-650 shrink-0">
                  <Phone className="h-5 w-5" />
                </div>
                <div>
                  <span className="text-[9px] font-bold uppercase tracking-wider text-slate-400">Order Hotline</span>
                  <p className="text-sm font-bold text-slate-900 mt-0.5">{contactPhone}</p>
                  <p className="text-[10px] text-slate-505 mt-0.5">Call to place an instant order or discuss machine technical specs.</p>
                </div>
              </div>

              {/* WhatsApp Support */}
              <div className="flex items-start gap-4">
                <div className="h-10 w-10 rounded-xl bg-slate-100 border border-slate-200 flex items-center justify-center text-green-600 shrink-0">
                  <MessageSquare className="h-5 w-5" />
                </div>
                <div>
                  <span className="text-[9px] font-bold uppercase tracking-wider text-slate-400">WhatsApp Chat</span>
                  <button
                    onClick={handleWhatsApp}
                    className="text-sm font-bold text-slate-900 hover:text-yellow-600 transition-colors mt-0.5 text-left"
                  >
                    Chat on WhatsApp
                  </button>
                  <p className="text-[10px] text-slate-505 mt-0.5">Send a WhatsApp inquiry to request video demonstrations of the thermal fogger in action.</p>
                </div>
              </div>

              {/* Delivery Info */}
              <div className="flex items-start gap-4">
                <div className="h-10 w-10 rounded-xl bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-650 shrink-0">
                  <Truck className="h-5 w-5" />
                </div>
                <div>
                  <span className="text-[9px] font-bold uppercase tracking-wider text-slate-400">Delivery Information</span>
                  <p className="text-sm font-bold text-slate-900 mt-0.5">Payment Strictly on Delivery</p>
                  <p className="text-[10px] text-slate-505 mt-0.5">Inspect tools, trigger drill rotation, and check packaging before you complete your payment.</p>
                </div>
              </div>
            </div>
          </div>

          {/* Card B: Contact/Inquiry Form */}
          <div className="bg-white border border-slate-200 p-6 md:p-8 rounded-3xl shadow-sm">
            {!submitSuccess ? (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <h3 className="text-base font-bold text-slate-900">Send an Inquiry</h3>
                  <p className="text-xs text-slate-500 mt-1">Our sales team will get back to you with pricing quotes and technical information.</p>
                </div>

                {submitError && (
                  <div className="rounded-xl bg-red-50 border border-red-100 p-3 text-xs text-red-700 flex gap-2">
                    <Info className="h-4.5 w-4.5 shrink-0 text-red-500 mt-0.5" />
                    <span>{submitError}</span>
                  </div>
                )}

                <div className="space-y-3">
                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">Your Name *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. John Michael"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="block w-full px-3.5 py-2 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white text-xs text-slate-800 placeholder-slate-400 focus:border-yellow-500 focus:outline-none transition-colors duration-200"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">Phone Number *</label>
                    <input
                      type="tel"
                      required
                      placeholder="e.g. 0810 680 0185"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="block w-full px-3.5 py-2 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white text-xs text-slate-800 placeholder-slate-400 focus:border-yellow-500 focus:outline-none transition-colors duration-200"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">Email Address</label>
                    <input
                      type="email"
                      placeholder="e.g. malaika@gmail.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="block w-full px-3.5 py-2 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white text-xs text-slate-800 placeholder-slate-400 focus:border-yellow-500 focus:outline-none transition-colors duration-200"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">Message or Order Request *</label>
                    <textarea
                      required
                      placeholder="Write your inquiry details or specify the machine you want to order..."
                      rows={4}
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      className="block w-full px-3.5 py-2 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white text-xs text-slate-800 placeholder-slate-400 focus:border-yellow-500 focus:outline-none transition-colors duration-200 resize-none"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full flex items-center justify-center gap-1.5 rounded-xl bg-yellow-500 px-5 py-3 text-xs font-black text-slate-950 hover:bg-yellow-600 disabled:bg-slate-200 disabled:text-slate-400 transition-colors shadow-md shadow-yellow-500/10 cursor-pointer"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Sending Inquiry...
                    </>
                  ) : (
                    'Submit Inquiry'
                  )}
                </button>
              </form>
            ) : (
              /* Inquiry Success View */
              <div className="flex flex-col items-center justify-center text-center py-12 gap-4">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-green-50 border border-green-200">
                  <CheckCircle2 className="h-8 w-8 text-green-500" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-950">Inquiry Sent Successfully!</h3>
                  <p className="text-xs text-slate-500 mt-2 px-6 leading-relaxed">
                    Thank you. We have received your message and will reach out to you on your phone number shortly to confirm order arrangements.
                  </p>
                </div>
                <button
                  onClick={() => setSubmitSuccess(false)}
                  className="rounded-xl border border-slate-200 bg-slate-50 px-5 py-2 text-xs font-semibold text-slate-650 hover:text-slate-900 transition-all duration-200"
                >
                  Send Another Message
                </button>
              </div>
            )}
          </div>

        </div>
      </section>

      {/* Footer */}
      <Footer />

    </div>
  );
}
