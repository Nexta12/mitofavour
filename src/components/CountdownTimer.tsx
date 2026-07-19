'use client';

import { useEffect, useState } from 'react';

export default function CountdownTimer() {
  // Use a fixed 7h 6m 22s from when the component first mounts (like the reference)
  // or store in localStorage to persist across reloads
  const [timeLeft, setTimeLeft] = useState({ hours: '07', minutes: '06', seconds: '22' });

  useEffect(() => {
    // Check if we have a deadline in localStorage
    const stored = localStorage.getItem('mitofavour_deadline');
    let deadline: number;

    if (stored) {
      deadline = parseInt(stored, 10);
      // If deadline has passed, reset it to 7 hours from now
      if (deadline < Date.now()) {
        deadline = Date.now() + (7 * 3600 + 6 * 60 + 22) * 1000;
        localStorage.setItem('mitofavour_deadline', deadline.toString());
      }
    } else {
      deadline = Date.now() + (7 * 3600 + 6 * 60 + 22) * 1000;
      localStorage.setItem('mitofavour_deadline', deadline.toString());
    }

    const pad = (n: number) => String(n).padStart(2, '0');

    const tick = () => {
      const diff = deadline - Date.now();
      if (diff <= 0) {
        setTimeLeft({ hours: '00', minutes: '00', seconds: '00' });
        return;
      }

      const h = Math.floor(diff / 3600000);
      const m = Math.floor((diff % 3600000) / 60000);
      const s = Math.floor((diff % 60000) / 1000);

      setTimeLeft({ hours: pad(h), minutes: pad(m), seconds: pad(s) });
    };

    tick();
    const interval = setInterval(tick, 1000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex justify-center gap-3 flex-wrap">
      <div className="bg-white/10 border border-amber-500/50 rounded-xl min-w-[76px] p-3 text-center backdrop-blur-sm shadow-inner">
        <div className="font-sans text-4xl font-black text-amber-400 leading-none tracking-tight">{timeLeft.hours}</div>
        <div className="font-sans text-[10px] font-bold tracking-widest uppercase text-white/70 mt-1">Hours</div>
      </div>
      <div className="bg-white/10 border border-amber-500/50 rounded-xl min-w-[76px] p-3 text-center backdrop-blur-sm shadow-inner">
        <div className="font-sans text-4xl font-black text-amber-400 leading-none tracking-tight">{timeLeft.minutes}</div>
        <div className="font-sans text-[10px] font-bold tracking-widest uppercase text-white/70 mt-1">Mins</div>
      </div>
      <div className="bg-white/10 border border-amber-500/50 rounded-xl min-w-[76px] p-3 text-center backdrop-blur-sm shadow-inner">
        <div className="font-sans text-4xl font-black text-amber-400 leading-none tracking-tight">{timeLeft.seconds}</div>
        <div className="font-sans text-[10px] font-bold tracking-widest uppercase text-white/70 mt-1">Secs</div>
      </div>
    </div>
  );
}
