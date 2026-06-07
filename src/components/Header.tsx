'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { LogOut, ShoppingBag, ShieldAlert, Menu, X } from 'lucide-react';
import { useRouter, usePathname } from 'next/navigation';

export default function Header() {
  const [isAdmin, setIsAdmin] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    // Check initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setIsAdmin(!!session);
    });

    // Listen for auth state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      setIsAdmin(!!session);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push('/');
    router.refresh();
  };

  const navLinks = [
    { name: 'Home', href: '/' },
    { name: 'Products', href: '/products' },
    { name: 'About Us', href: '/about' },
    { name: 'Contact Us', href: '/contact' },
  ];

  // Helper to determine if link is active
  const isActive = (href: string) => {
    if (href === '/') {
      return pathname === '/';
    }
    return pathname.startsWith(href);
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-slate-200 bg-white/95 backdrop-blur-md shadow-sm">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        
        {/* Brand/Logo */}
        <Link href="/" className="flex items-center gap-2 group">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-900 border border-slate-800 group-hover:bg-yellow-500 group-hover:border-yellow-500 transition-all duration-300 shadow-sm">
            <ShoppingBag className="h-5 w-5 text-yellow-500 group-hover:text-slate-950 group-hover:scale-110 transition-all duration-300" />
          </div>
          <div className="flex flex-col">
            <span className="font-sans text-lg font-black tracking-tight text-slate-900 group-hover:text-yellow-600 transition-colors duration-300">
              Mitofavour
            </span>
            <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest -mt-1 block">
              Equipment & Tools
            </span>
          </div>
        </Link>

        {/* Desktop Navigation Links */}
        <nav className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              href={link.href}
              className={`text-sm font-bold tracking-wide transition-colors relative py-2 ${
                isActive(link.href)
                  ? 'text-slate-950'
                  : 'text-slate-500 hover:text-slate-950'
              }`}
            >
              {link.name}
              {isActive(link.href) && (
                <span className="absolute bottom-0 left-0 w-full h-0.5 bg-yellow-500 rounded-full" />
              )}
            </Link>
          ))}
        </nav>

        {/* Action Button & Mobile Menu Toggle */}
        <div className="flex items-center gap-3">
          
          {/* Admin panel navigation / Log out */}
          <div className="hidden sm:flex items-center gap-2">
            {isAdmin ? (
              <div className="flex items-center gap-3">
                <Link
                  href="/admin/dashboard"
                  className={`text-xs font-extrabold uppercase tracking-wider text-slate-500 hover:text-slate-900 transition-colors duration-200 ${
                    pathname.startsWith('/admin') ? 'text-yellow-600' : ''
                  }`}
                >
                  Dashboard
                </Link>
                <button
                  onClick={handleLogout}
                  className="flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-4 py-2 text-xs font-bold text-slate-700 hover:border-red-200 hover:bg-red-50 hover:text-red-600 transition-all duration-300"
                >
                  <LogOut className="h-4 w-4" />
                  <span>Logout</span>
                </button>
              </div>
            ) : (
              <Link
                href="/admin/dashboard"
                className="flex items-center justify-center gap-2 rounded-lg border border-slate-200 bg-slate-50 px-4 py-2 text-xs font-bold text-slate-700 hover:border-yellow-300 hover:bg-yellow-500 hover:text-slate-950 transition-all duration-300"
              >
                <span>Login</span>
              </Link>
            )}
          </div>

          {/* Mobile menu open/close toggle */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 hover:text-slate-950 transition-all"
          >
            {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>

        </div>
      </div>

      {/* Mobile Navigation Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-slate-200 bg-white py-4 px-6 space-y-3 animate-fade-in shadow-inner">
          <nav className="flex flex-col gap-2.5">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className={`py-2 text-sm font-bold rounded-lg px-3 transition-colors ${
                  isActive(link.href)
                    ? 'bg-yellow-500 text-slate-950 font-black'
                    : 'text-slate-600 hover:bg-slate-50 hover:text-slate-950'
                }`}
              >
                {link.name}
              </Link>
            ))}
          </nav>

          <hr className="border-slate-100 my-2" />

          {/* Mobile Admin Actions */}
          <div className="pt-2">
            {isAdmin ? (
              <div className="flex flex-col gap-2">
                <Link
                  href="/admin/dashboard"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex justify-center items-center py-2.5 text-xs font-bold uppercase text-slate-700 bg-slate-50 rounded-xl border border-slate-200"
                >
                  Go to Admin Dashboard
                </Link>
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    handleLogout();
                  }}
                  className="flex items-center justify-center gap-2 rounded-xl bg-red-50 text-red-600 py-2.5 text-xs font-bold border border-red-100"
                >
                  <LogOut className="h-4 w-4" />
                  <span>Sign Out</span>
                </button>
              </div>
            ) : (
              <Link
                href="/admin/dashboard"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-slate-50 py-2.5 text-xs font-bold text-slate-700"
              >
                <ShieldAlert className="h-4 w-4" />
                <span>Admin Login Portal</span>
              </Link>
            )}
          </div>
        </div>
      )}

    </header>
  );
}
