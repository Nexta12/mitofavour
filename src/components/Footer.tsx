'use client';

export default function Footer() {
  return (
    <footer className="relative bg-slate-950 border-t border-slate-900 py-10 overflow-hidden">
      {/* Black & Gray Check / Grid Pattern */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#475569_1px,transparent_1px),linear-gradient(to_bottom,#475569_1px,transparent_1px)] bg-[size:1.5rem_1.5rem] opacity-25 pointer-events-none" />
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center text-xs text-slate-400 space-y-2">
        <p>© {new Date().getFullYear()} Mitofavour. All rights reserved. Payment strictly on delivery.</p>
        <p className="text-[10px] text-slate-500 font-semibold tracking-wide uppercase">
          Built by Z-code Technologies Ltd. 08085258229
        </p>
      </div>
    </footer>
  );
}
