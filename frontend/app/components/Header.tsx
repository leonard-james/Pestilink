'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';

export default function Header() {
  const pathname = usePathname() || '/';
  const router = useRouter();

  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);

  useEffect(() => {
    const token = typeof window !== 'undefined' ? localStorage.getItem('authToken') : null;
    setIsAuthenticated(Boolean(token));
  }, []);

  const nav = [
    { name: 'Home', href: '/' },
    { name: 'Services', href: '/services' },
    { name: 'Sign Up', href: '/signup', className: 'whitespace-nowrap' },
  ];

  const linkClass = (href: string, additionalClass = '') => {
    const isHome = href === '/';
    const isActive = isHome ? pathname === '/' : pathname.startsWith(href);
    return `${isActive ? 'font-bold text-white' : 'text-white/90'} 
      px-3 py-2 text-sm hover:bg-white/10 transition rounded ${additionalClass}`;
  };

  const handleServicesClick = (e: React.MouseEvent) => {
    if (!isAuthenticated) {
      e.preventDefault();
      setShowAuthModal(true);
    }
  };

  const handleSearchSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!isAuthenticated) {
      setShowAuthModal(true);
      return;
    }
    const formData = new FormData(e.currentTarget);
    const query = formData.get('search') as string;
    if (query?.trim()) {
      router.push(`/services/search?q=${encodeURIComponent(query)}`);
    }
  };

  return (
    <header className="absolute top-0 left-0 right-0 z-20">
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-8 py-6">
        <div className="flex items-center gap-2">
          <div className="h-10 w-10 rounded-md bg-gradient-to-br from-emerald-500 to-lime-400 flex items-center justify-center font-bold text-black">
            X
          </div>
          <div className="hidden flex-col leading-tight sm:flex">
            <span className="text-sm font-bold uppercase text-emerald-200">
              PEST LINK
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {nav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={linkClass(item.href, item.className)}
              onClick={item.href === '/services' ? handleServicesClick : undefined}
            >
              {item.name}
            </Link>
          ))}

          {/* Hide search bar on services pages */}
          {!pathname.startsWith('/services') && (
            <form 
              onSubmit={handleSearchSubmit}
              className="ml-2"
            >
              <div className="relative w-64">
                <input
                  type="search"
                  name="search"
                  placeholder="Search..."
                  className="w-full px-3 py-2 pr-10 rounded-lg bg-white/20 border-none text-white 
                    placeholder:text-white/60 text-sm focus:outline-none focus:ring-2 
                    focus:ring-emerald-400"
                />
                <button
                  type="submit"
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-white/80"
                >
                  🔍
                </button>
              </div>
            </form>
          )}

          {/* Hide Log In when on services page */}
          { !pathname.startsWith('/services') && (
            <Link
              href="/login"
              className="ml-2 flex items-center gap-2 rounded-full bg-[#0b2036] px-4 py-2 text-sm font-medium text-white whitespace-nowrap"
            >
              Log In
            </Link>
          )}
        </div>
      </nav>

      {showAuthModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
          <div
            className="absolute inset-0 bg-black/50"
            onClick={() => setShowAuthModal(false)}
          />
          <div className="relative z-10 max-w-sm w-full bg-white text-black rounded-lg p-5 shadow-lg">
            <h3 className="text-lg font-semibold mb-2">Please log in or sign up</h3>
            <p className="mb-4 text-sm text-gray-700">
              {pathname.startsWith('/services') 
                ? 'You need an account to access Services. Create one or log in to continue.'
                : 'You need to sign up or log in to search for pests. Create an account or log in to continue.'}
            </p>
            <div className="flex gap-2 justify-end">
              <button
                onClick={() => setShowAuthModal(false)}
                className="px-3 py-1 rounded border"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  setShowAuthModal(false);
                  router.push('/login');
                }}
                className="px-3 py-1 rounded bg-blue-600 text-white"
              >
                Log in
              </button>
              <button
                onClick={() => {
                  setShowAuthModal(false);
                  router.push('/signup');
                }}
                className="px-3 py-1 rounded bg-green-600 text-white"
              >
                Sign up
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}