'use client';

import { useRouter, usePathname } from 'next/navigation';
import { useState } from 'react';

type HeaderProps = {
  hideAuth?: boolean;
};

export default function Header({ hideAuth = false }: HeaderProps) {
  const router = useRouter();
  const pathname = usePathname();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  // Show navigation and account icon only on the home page
  const isHomePage = pathname === '/home';

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-black/80 backdrop-blur-sm border-b border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <nav className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center gap-2">
            <div className="h-10 w-10 rounded-md bg-gradient-to-br from-emerald-500 to-lime-400 flex items-center justify-center font-bold text-black">
              X
            </div>
            <div className="ml-2">
              <span className="text-lg font-bold text-white">PEST LINK</span>
            </div>
          </div>

          {/* Navigation Links - Add your main navigation here if needed */}
          <div className="flex-1 flex items-center justify-center">
            {/* Add your navigation links here */}
          </div>

          {/* Navigation Items - Right side - Only show on home page */}
          {isHomePage && (
            <div className="flex items-center gap-4">
              <button 
                onClick={() => router.push('/pest-services')}
                className="text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium transition-colors"
                type="button"
              >
                Services
              </button>
              <button 
                onClick={() => router.push('/about')}
                className="text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium transition-colors"
                type="button"
              >
                About Us
              </button>
              
              {/* User Account */}
              <button 
                onClick={toggleSidebar}
                className="h-10 w-10 rounded-full bg-gray-700 flex items-center justify-center hover:bg-gray-600 transition-colors"
                aria-label="Account settings"
                type="button"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </button>
            </div>
          )}
        </nav>
      </div>
    </header>
  );
}