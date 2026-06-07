import { Sparkles, ShieldCheck, Flame, Zap, Award, Check } from 'lucide-react';
import Link from 'next/link';
import Footer from '@/components/Footer';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'About Mitofavour | High-Grade Industrial Tools & Foggers',
  description: 'Learn about Mitofavour, your trusted supplier of Pulsed Power Sprayer Thermal Fogging Machines and high-torque cordless drill sets. Quality equipment with cash on delivery.',
  alternates: {
    canonical: '/about',
  },
};

export default function AboutPage() {
  return (
    <div className="flex flex-col min-h-screen bg-slate-50 text-slate-800">
      
      {/* Page Header */}
      <section className="bg-slate-900 border-b border-slate-950 py-16 text-white text-center relative overflow-hidden">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#334155_1px,transparent_1px),linear-gradient(to_bottom,#334155_1px,transparent_1px)] bg-[size:3rem_3rem] opacity-10 pointer-events-none" />
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <span className="text-[10px] font-bold uppercase tracking-widest text-yellow-500">MITOFAVOUR CO.</span>
          <h1 className="text-3xl sm:text-5xl font-black mt-2 tracking-tight">About Us</h1>
          <p className="text-sm text-slate-350 mt-3 max-w-xl mx-auto leading-relaxed">
            Mitofavour is a premium supplier of industrial-grade disinfection machines, heavy-duty cordless power tools, and hardware kits.
          </p>
        </div>
      </section>

      {/* Main Content */}
      <section className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 py-16 space-y-16">
        
        {/* Brand Mission & Story */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center bg-white border border-slate-200 p-8 rounded-3xl shadow-sm">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-widest text-yellow-600 block mb-1">Our Mission</span>
            <h2 className="text-2xl font-black text-slate-900 tracking-tight">Engineered For Reliability</h2>
            <p className="text-xs text-slate-500 leading-relaxed mt-4">
              At Mitofavour, we believe that professionals and DIYers shouldn't have to compromise on power. We source, build, and deliver specialized industrial equipment designed to drill, cut, and break through hard materials.
            </p>
            <p className="text-xs text-slate-500 leading-relaxed mt-3">
              We operate strictly on a Pay on Delivery shipping model. This guarantees that you inspect your machinery, check battery capacities, and confirm tools quality before paying a single cent.
            </p>
          </div>
          <div className="relative aspect-video rounded-2xl overflow-hidden bg-slate-900 border border-slate-800 flex items-center justify-center p-8 text-center text-white">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(234,179,8,0.1)_0%,transparent_70%)]" />
            <div>
              <Award className="h-10 w-10 text-yellow-500 mx-auto mb-3" />
              <p className="text-sm font-bold uppercase tracking-widest text-yellow-500">Premium Grade Only</p>
              <p className="text-[10px] text-slate-400 mt-1.5 px-4 leading-relaxed">
                Widely used by construction professionals, electricians, plumbers, and general contractors.
              </p>
            </div>
          </div>
        </div>

        {/* Deep Dive 1: Fogging Machine */}
        <div className="space-y-6">
          <div className="flex items-center gap-3 border-b border-slate-200 pb-3">
            <div className="h-8 w-8 rounded-lg bg-slate-900 text-yellow-500 flex items-center justify-center">
              <Flame className="h-4.5 w-4.5" />
            </div>
            <h2 className="text-xl font-bold text-slate-900">1. Pulsed Power Sprayer Thermal Fogging Machine</h2>
          </div>

          <p className="text-xs text-slate-500 leading-relaxed">
            Our specialized thermal fogging machine is an industry standard for professional pest control, vector management (mosquitoes, pests), and sanitization of warehouses, hospitals, farms, and public facilities.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="p-4 bg-white border border-slate-200 rounded-2xl shadow-sm">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Chemical Tanks</span>
              <p className="text-xs text-slate-700 font-bold mt-1">Dual Fuel & Chemical Tanks</p>
              <p className="text-[10px] text-slate-500 mt-1">High capacity dual chemical solution and gas tanks for extended runtime.</p>
            </div>
            
            <div className="p-4 bg-white border border-slate-200 rounded-2xl shadow-sm">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Barrel & Body</span>
              <p className="text-xs text-slate-700 font-bold mt-1">High-Grade Stainless Steel</p>
              <p className="text-[10px] text-slate-500 mt-1">Full stainless steel pulse barrel and structure to prevent corrosion and rust.</p>
            </div>

            <div className="p-4 bg-white border border-slate-200 rounded-2xl shadow-sm">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Text & Labels</span>
              <p className="text-xs text-slate-700 font-bold mt-1">Intuitive User Guidance</p>
              <p className="text-[10px] text-slate-500 mt-1">Clear regulatory safety labels, tank markings, and start valves instructions.</p>
            </div>

            <div className="p-4 bg-white border border-slate-200 rounded-2xl shadow-sm">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Structure</span>
              <p className="text-xs text-slate-700 font-bold mt-1">Compact Carrying Frame</p>
              <p className="text-[10px] text-slate-500 mt-1">Built with a lightweight tubular structural frame for easy carriage and handling.</p>
            </div>
          </div>
        </div>

        {/* Deep Dive 2: Cordless Drill Set */}
        <div className="space-y-6">
          <div className="flex items-center gap-3 border-b border-slate-200 pb-3">
            <div className="h-8 w-8 rounded-lg bg-slate-900 text-yellow-500 flex items-center justify-center">
              <Zap className="h-4.5 w-4.5" />
            </div>
            <h2 className="text-xl font-bold text-slate-900">2. Cordless Drill/Driver & Angle Grinder Kit</h2>
          </div>

          <p className="text-xs text-slate-500 leading-relaxed">
            Our premium yellow-and-black cordless toolset is a complete workstation in a box. Packed with high-torque brushless motors, it delivers extreme power for drilling, cutting, grinding, and masonry tasks on a single battery charge.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm space-y-3">
              <h3 className="text-xs font-extrabold uppercase text-yellow-600">Core Power Tools</h3>
              <ul className="space-y-2 text-xs text-slate-700 font-bold">
                <li className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-emerald-500 shrink-0" />
                  <span>Brushless Drill/Driver</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-emerald-500 shrink-0" />
                  <span>Rotary Hammer Drill</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-emerald-500 shrink-0" />
                  <span>Cordless Angle Grinder</span>
                </li>
              </ul>
            </div>

            <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm space-y-3">
              <h3 className="text-xs font-extrabold uppercase text-yellow-600">Power Accessories</h3>
              <ul className="space-y-2 text-xs text-slate-700 font-bold">
                <li className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-emerald-500 shrink-0" />
                  <span>18V XR 4.0Ah Dual Batteries</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-emerald-500 shrink-0" />
                  <span>Fast-Charging Adapter</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-emerald-500 shrink-0" />
                  <span>Hard Case Carrying Box</span>
                </li>
              </ul>
            </div>

            <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm space-y-3">
              <h3 className="text-xs font-extrabold uppercase text-yellow-600">Box Accessories</h3>
              <ul className="space-y-2 text-xs text-slate-750 font-bold">
                <li className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-emerald-500 shrink-0" />
                  <span>Hammer, Pliers & Saws</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-emerald-500 shrink-0" />
                  <span>Impact Wrenches & Screwdrivers</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-emerald-500 shrink-0" />
                  <span>Hardware Bits & 5m PVC Tape</span>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="text-center py-6 bg-slate-900 rounded-3xl p-8 text-white relative overflow-hidden">
          <h3 className="text-base font-extrabold uppercase text-yellow-500 tracking-wider">Ready to Get Started?</h3>
          <p className="text-xs text-slate-350 mt-1 max-w-sm mx-auto">Browse our collection of heavy-duty equipment and tools, and order today with cash on delivery shipping.</p>
          <Link
            href="/products"
            className="mt-5 inline-flex items-center justify-center gap-1.5 rounded-xl bg-yellow-500 px-6 py-2.5 text-xs font-black text-slate-950 hover:bg-yellow-600 transition-all shadow"
          >
            Go to Products Catalog
          </Link>
        </div>

      </section>

      {/* Footer */}
      <Footer />

    </div>
  );
}
