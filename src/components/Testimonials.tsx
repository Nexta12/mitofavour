'use client';

import { Star, Quote } from 'lucide-react';

interface Testimonial {
  id: number;
  quote: string;
  author: string;
  initials: string;
  role: string;
  location: string;
  stars: number;
}

const TESTIMONIALS: Testimonial[] = [
  {
    id: 1,
    quote: "I use it for my pest control business. The mist is very fine and reaches every corner. My clients are always impressed with the results.",
    author: "Emmanuel I.",
    initials: "EI",
    role: "Pest Control Specialist",
    location: "Port Harcourt, Nigeria",
    stars: 5,
  },
  {
    id: 2,
    quote: "The thermal fogging machine is an absolute workhorse. It helps us protect our greenhouses from pests. Delivery was fast, and paying on delivery gave us 100% confidence.",
    author: "Alhaji Bashir M.",
    initials: "BM",
    role: "Agricultural Operator",
    location: "Kano, Nigeria",
    stars: 5,
  },
  {
    id: 3,
    quote: "The cordless combination tools are top notch. Having the angle grinder and rotary hammer drill in one box with two 18V batteries means my team is never idle on site. Highly recommend.",
    author: "Chidi O.",
    initials: "CO",
    role: "General Contractor",
    location: "Lagos, Nigeria",
    stars: 5,
  },
  {
    id: 4,
    quote: "Outstanding durability. We've used their sprayers for disinfecting office complexes in Abuja for months now, and they run flawlessly every single time. Good value for money.",
    author: "Engineer Toyin A.",
    initials: "TA",
    role: "Facility Manager",
    location: "Abuja, Nigeria",
    stars: 5,
  },
  {
    id: 5,
    quote: "Excellent customer support and high-performance equipment. I was skeptical about ordering online, but pay on delivery was smooth. The drill combo has been perfect for my home projects.",
    author: "Ngozi E.",
    initials: "NE",
    role: "DIY & Home Landscaper",
    location: "Enugu, Nigeria",
    stars: 5,
  },
  {
    id: 6,
    quote: "Highly reliable. When you are running a sanitization business, tool downtime is lost revenue. These fogger machines are robust and very easy to start. Will definitely purchase more sets.",
    author: "Musa K.",
    initials: "MK",
    role: "Sanitization Services Coordinator",
    location: "Kaduna, Nigeria",
    stars: 5,
  },
];

export default function Testimonials() {
  return (
    <section className="py-16 bg-slate-50 border-t border-slate-200">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <span className="text-[10px] font-bold uppercase tracking-widest text-yellow-600">Client Reviews</span>
          <h2 className="text-xl font-black text-slate-900 tracking-tight mt-1">Satisfied Customers</h2>
          <p className="text-xs text-slate-500 mt-1.5">
            See what professionals and home owners across the region are saying about our premium tools and service.
          </p>
        </div>

        {/* Testimonials Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {TESTIMONIALS.map((t) => (
            <div 
              key={t.id}
              className="bg-white border border-slate-200/80 rounded-3xl p-6 shadow-sm hover:shadow-md hover:border-yellow-400/50 transition-all duration-300 flex flex-col justify-between relative group"
            >
              {/* Decorative Quote Icon */}
              <div className="absolute right-6 top-6 text-slate-100 group-hover:text-yellow-500/10 transition-colors pointer-events-none">
                <Quote className="h-8 w-8 stroke-[3]" />
              </div>

              <div>
                {/* Stars */}
                <div className="flex items-center gap-0.5 mb-4 text-amber-400">
                  {[...Array(t.stars)].map((_, i) => (
                    <Star key={i} className="h-3.5 w-3.5 fill-current" />
                  ))}
                </div>

                {/* Quote Text */}
                <p className="text-xs text-slate-650 leading-relaxed italic pr-4">
                  "{t.quote}"
                </p>
              </div>

              {/* Author Info */}
              <div className="flex items-center gap-3 mt-6 pt-4 border-t border-slate-100">
                {/* Initials Circle */}
                <div className="h-9 w-9 rounded-xl bg-yellow-500 text-slate-950 flex items-center justify-center font-black text-xs shrink-0 shadow-sm shadow-yellow-500/10">
                  {t.initials}
                </div>
                
                {/* Details */}
                <div className="flex flex-col min-w-0">
                  <span className="text-xs font-black text-slate-900 truncate">
                    {t.author}
                  </span>
                  <span className="text-[10px] text-slate-505 font-bold truncate">
                    {t.role}
                  </span>
                  <span className="text-[9px] text-slate-400 font-semibold tracking-wider uppercase mt-0.5">
                    {t.location}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
        
      </div>
    </section>
  );
}
