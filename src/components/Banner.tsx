'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { X } from 'lucide-react';

export default function Banner() {
  const [message, setMessage] = useState('');
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    async function fetchActiveBanner() {
      try {
        const { data, error } = await supabase
          .from('banners')
          .select('message')
          .eq('is_active', true)
          .limit(1);

        if (error) {
          // Silent catch to handle if the banners table hasn't been created yet
          return;
        }

        if (data && data.length > 0) {
          setMessage(data[0].message);
        }
      } catch (err) {
        console.error(err);
      }
    }
    fetchActiveBanner();
  }, []);

  if (!message || !isVisible) return null;

  return (
    <div className="bg-gradient-to-r from-yellow-500 via-amber-500 to-yellow-600 text-slate-950 px-4 py-2 text-center text-xs font-black relative flex items-center justify-center gap-1.5 shadow-sm animate-fade-in z-50">
      <span>{message}</span>
      
      {/* Dismiss button */}
      <button
        onClick={() => setIsVisible(false)}
        className="absolute right-4 p-1 text-slate-900/75 hover:text-slate-950 rounded-full hover:bg-black/5 transition-colors cursor-pointer"
        aria-label="Dismiss banner"
      >
        <X className="h-3.5 w-3.5" />
      </button>
    </div>
  );
}
