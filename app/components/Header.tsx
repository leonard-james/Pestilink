'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import Input from './Input';

export default function Header() {
  const pathname = usePathname() || '/';

  const nav = [
    { name: 'Home', href: '/' },
    { name: 'Services', href: '/services' },
    { name: 'Contact Us', href: '/contact', className: 'whitespace-nowrap' },
    { name: 'Sign Up', href: '/signup', className: 'whitespace-nowrap' },
  ];

  const linkClass = (href: string, additionalClass = '') => {
    const isHome = href === '/';
    const isActive = isHome ? pathname === '/' : pathname.startsWith(href);
    return `${isActive ? 'font-bold text-white' : 'text-white/90'} 
      px-3 py-2 text-sm hover:bg-white/10 transition rounded ${additionalClass}`;
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
    </header>
  );
}