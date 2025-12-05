'use client';

import { useRouter, usePathname } from 'next/navigation';
import { useState, useEffect, useRef } from 'react';

type HeaderProps = {
  hideAuth?: boolean;
  hideNav?: boolean;
};

export default function Header({ hideAuth = false, hideNav = false }: HeaderProps) {
  const router = useRouter();
  const pathname = usePathname();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const sidebarRef = useRef<HTMLDivElement>(null);
  const isAdminPage = pathname.startsWith('/admin');

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  // Close sidebar when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (sidebarRef.current && !sidebarRef.current.contains(event.target as Node) && 
          !(event.target as Element).closest('button[aria-label="Account settings"]')) {
        setIsSidebarOpen(false);
      }
    };

    // Close sidebar when route changes
    const handleRouteChange = () => {
      setIsSidebarOpen(false);
    };

    document.addEventListener('mousedown', handleClickOutside);
    window.addEventListener('popstate', handleRouteChange);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      window.removeEventListener('popstate', handleRouteChange);
    };
  }, []);

  // Close sidebar when pressing Escape key
  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsSidebarOpen(false);
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, []);

  // Admin sidebar navigation items
  const adminNavItems = [
    { name: 'Dashboard', icon: 'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6', path: '/admin' },
    { name: 'Manage Users', icon: 'M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z', path: '/admin/users' },
    { name: 'Manage Products', icon: 'M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4', path: '/admin/products' },
  ];

  // Show navigation and account icon on home and about pages
  const isHomePage = pathname === '/' || pathname === '/home' || pathname === '/about' || pathname === '/pest-services';

  return (
    <>
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

            {/* Navigation Items - Right side */}
            <div className="flex items-center">
              {/* Show full navigation on home page */}
              {isHomePage && !hideNav && (
                <>
                  <button 
                    onClick={() => router.push('/home')}
                    className="text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium transition-colors"
                    type="button"
                  >
                    Home
                  </button>
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
                </>
              )}
              
              {/* Show account icon based on props */}
              {(isHomePage || hideNav) && !hideAuth && (
                <button 
                  onClick={toggleSidebar}
                  className="h-10 w-10 rounded-full bg-gray-700 flex items-center justify-center hover:bg-gray-600 transition-colors ml-2"
                  aria-label="Account settings"
                  aria-expanded={isSidebarOpen}
                  type="button"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </button>
              )}
            </div>
          </nav>
        </div>
      </header>

      {/* Sidebar Backdrop */}
      <div 
        className={`fixed inset-0 bg-black/50 z-50 transition-opacity duration-300 ${isSidebarOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
        onClick={toggleSidebar}
      />

      {/* Admin Sidebar */}
      {isAdminPage ? (
        <div 
          ref={sidebarRef}
          className={`fixed top-0 right-0 h-full w-64 bg-gray-900 shadow-xl z-50 transform transition-transform duration-300 ease-in-out ${isSidebarOpen ? 'translate-x-0' : 'translate-x-full'}`}
        >
          <div className="p-6 h-full flex flex-col">
            <div className="mb-8">
              <h2 className="text-xl font-bold text-white">Admin Panel</h2>
            </div>

            <nav className="space-y-1">
              {adminNavItems.map((item) => (
                <button
                  key={item.name}
                  onClick={() => {
                    router.push(item.path);
                    setIsSidebarOpen(false);
                  }}
                  className={`w-full flex items-center px-4 py-3 text-left rounded-lg transition-colors ${
                    pathname === item.path 
                      ? 'bg-gray-800 text-white' 
                      : 'text-gray-300 hover:bg-gray-800'
                  }`}
                >
                  <svg 
                    className="h-5 w-5 mr-3" 
                    fill="none" 
                    viewBox="0 0 24 24" 
                    stroke="currentColor"
                  >
                    <path 
                      strokeLinecap="round" 
                      strokeLinejoin="round" 
                      strokeWidth={2} 
                      d={item.icon} 
                    />
                  </svg>
                  {item.name}
                </button>
              ))}
            </nav>

            <div className="mt-auto pt-4 border-t border-gray-800">
              <button 
                onClick={() => {
                  // Add sign out logic here
                  router.push('/');
                  setIsSidebarOpen(false);
                }}
                className="w-full flex items-center justify-between px-4 py-3 text-red-400 hover:bg-gray-800 rounded-lg transition-colors"
              >
                <span>Sign out</span>
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      ) : (
        /* Regular User Sidebar */
        <div 
          ref={sidebarRef}
          className={`fixed top-0 right-0 h-full w-80 bg-gray-900 shadow-xl z-50 transform transition-transform duration-300 ease-in-out ${isSidebarOpen ? 'translate-x-0' : 'translate-x-full'}`}
        >
          <div className="p-6 h-full flex flex-col">
            <div className="mb-8">
              <h2 className="text-xl font-bold text-white">Account</h2>
            </div>

            <div className="flex-1 flex flex-col">
              <div className="flex items-center gap-4 mb-6">
                <div className="h-12 w-12 rounded-full bg-emerald-500 flex items-center justify-center text-white font-bold">
                  U
                </div>
                <div>
                  <p className="font-medium text-white">User Name</p>
                  <p className="text-sm text-gray-400">user@example.com</p>
                </div>
              </div>

              <nav className="space-y-2">
                <a href="#" className="flex items-center px-4 py-3 text-gray-300 hover:bg-gray-800 rounded-lg transition-colors">
                  <svg className="h-5 w-5 mr-3 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                  My Profile
                </a>
                <a href="#" className="flex items-center px-4 py-3 text-gray-300 hover:bg-gray-800 rounded-lg transition-colors">
                  <svg className="h-5 w-5 mr-3 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  Settings
                </a>
                <a href="#" className="flex items-center px-4 py-3 text-gray-300 hover:bg-gray-800 rounded-lg transition-colors">
                  <svg className="h-5 w-5 mr-3 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Help & Support
                </a>
              </nav>

              <div className="mt-auto pt-4 border-t border-gray-800">
                <button 
                  onClick={() => {
                    // Add sign out logic here
                    router.push('/');
                    setIsSidebarOpen(false);
                  }}
                  className="w-full flex items-center justify-between px-4 py-3 text-red-400 hover:bg-gray-800 rounded-lg transition-colors"
                >
                  <span>Sign out</span>
                  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}