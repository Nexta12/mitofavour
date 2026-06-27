'use client';

import { usePathname } from 'next/navigation';
import * as fpixel from '@/lib/fpixel';

export default function WhatsAppButton() {
  const pathname = usePathname();
  const whatsappPhone = process.env.NEXT_PUBLIC_WHATSAPP_PHONE || '2348106800185';
  const defaultMessage = "Hello Favour, I'm visiting your website and would like to make an inquiry.";
  const whatsappUrl = `https://wa.me/${whatsappPhone}?text=${encodeURIComponent(defaultMessage)}`;

  if (pathname?.startsWith('/admin')) {
    return null;
  }

  return (
    <a
      href={whatsappUrl}
      target="_blank"
      rel="noopener noreferrer"
      onClick={() => fpixel.event('Contact')}
      className="fixed bottom-6 right-6 z-50 flex items-center gap-2 group"
      aria-label="Chat on WhatsApp"
    >
      {/* Label - visible on hover, slides out */}
      <span className="max-w-0 overflow-hidden whitespace-nowrap bg-white text-slate-700 text-xs font-bold px-0 py-2 rounded-full border border-slate-200 shadow-md transition-all duration-300 group-hover:max-w-xs group-hover:px-4 group-hover:mr-1">
        Chat with us
      </span>

      {/* Button with WhatsApp branding and animations */}
      <div className="relative flex h-14 w-14 items-center justify-center rounded-full bg-emerald-500 text-white shadow-xl hover:bg-emerald-600 hover:scale-105 transition-all duration-300">
        {/* Pulse Effect */}
        <span className="absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-20 animate-ping duration-1000 pointer-events-none"></span>
        
        <svg viewBox="0 0 24 24" className="h-7 w-7 fill-white">
          <path d="M12.012 2c-5.506 0-9.989 4.478-9.99 9.984a9.96 9.96 0 001.37 5.056L2 22l5.14-1.348a9.957 9.957 0 004.872 1.268h.004c5.507 0 9.99-4.477 9.99-9.985a9.988 9.988 0 00-9.998-9.935zm4.825 14.154c-.265.748-1.537 1.348-2.126 1.41-.59.063-1.18.328-3.796-.75-3.137-1.29-5.132-4.477-5.29-4.688-.157-.212-1.278-1.702-1.278-3.243 0-1.54.805-2.298 1.09-2.607.285-.309.62-.387.825-.387.206 0 .412.002.59.01.186.007.433-.072.678.522.25.606.855 2.083.93 2.235.073.152.122.33.02.534-.1.206-.153.33-.305.506-.152.175-.32.392-.457.526-.152.15-.31.312-.133.62.176.305.783 1.29 1.68 2.087.957.854 1.76 1.118 2.01 1.243.25.123.393.103.539-.065.148-.17 1.157-1.348 1.48-1.81.32-.464.64-.387 1.077-.227.437.16 2.776 1.309 2.91.135a.82.82 0 01-.065.918z" />
        </svg>
      </div>
    </a>
  );
}
