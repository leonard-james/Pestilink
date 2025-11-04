'use client';

import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';

export default function Header() {
  const pathname = usePathname() || '/';

  const nav = [
    { name: 'Home', href: '/' },
    { name: 'Services', href: '/services' },
    { name: 'Contact Us', href: '/contact' },
    { name: 'Sign Up', href: '/signup' },
  ];

  const linkClass = (href: string) => {
    const isHome = href === '/';
    const isActive = isHome ? pathname === '/' : pathname.startsWith(href);
    return (
      (isActive ? 'font-bold text-white' : 'text-white/90') +
      ' px-3 py-2 text-sm hover:bg-white/10 transition rounded'
    );
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

        <div className="flex items-center gap-4">
          {nav.map((item) => (
            <Link key={item.href} href={item.href} className={linkClass(item.href)}>
              {item.name}
            </Link>
          ))}

          <div className="relative">
            <input
              type="search"
              placeholder="Search..."
              className="h-10 w-64 rounded-full border border-white/20 bg-white/10 px-4 pr-10 text-white placeholder:text-white/70 focus:outline-none focus:ring-2 focus:ring-emerald-400"
            />
            <div className="absolute right-3 top-1/2 -translate-y-1/2 text-white/80">
              🔍
            </div>
          </div>

          <Link
            href="/login"
            className="flex items-center gap-2 rounded-full bg-[#0b2036] px-4 py-2 text-sm font-medium text-white"
          >
            Log In
          </Link>
        </div>
      </nav>
    </header>
  );
}