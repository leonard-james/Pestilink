'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import Input from './Input';

export default function Header() {
  const pathname = usePathname() || '/';
  const router = useRouter();

  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);

  useEffect(() => {
    // Replace this with your real auth check if needed
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
    // Do nothing - allow normal navigation
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

          <div className="ml-2">
            <Input
              type="search"
              placeholder="Search..."
              icon="🔍"
              className="w-64"
            />
          </div>

          <Link
            href="login"
            className="ml-2 flex items-center gap-2 rounded-full bg-[#0b2036] px-4 py-2 text-sm font-medium text-white whitespace-nowrap"
          >
            Log In
          </Link>
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
              You need an account to access Services. Create one or log in to continue.
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