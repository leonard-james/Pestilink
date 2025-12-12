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
  const [user, setUser] = useState<any>(null);
  const sidebarRef = useRef<HTMLDivElement>(null);
  const isAdminPage = pathname.startsWith('/admin');
  const isCompanyPage = pathname.startsWith('/dashboard/company');
  const isFarmerPage = pathname.startsWith('/dashboard/farmer');

  // Load user from localStorage
  useEffect(() => {
    const userStr = typeof window !== 'undefined' ? localStorage.getItem('authUser') : null;
    if (userStr) {
      try {
        setUser(JSON.parse(userStr));
      } catch (e) {
        console.error('Error parsing user data:', e);
      }
    }
  }, []);

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

  // Show navigation on main pages
  const showNav = !hideNav && (
    pathname === '/' || 
    pathname === '/home' || 
    pathname === '/about' || 
    pathname === '/pest-services' || 
    pathname.startsWith('/pest-services/') ||
    pathname === '/products'
  );

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
              {/* Show full navigation on main pages */}
              {showNav && (
                <>
                  <button 
                    onClick={() => {
                      const token = typeof window !== 'undefined' ? localStorage.getItem('authToken') : null;
                      if (token) {
                        router.push('/home');
                      } else {
                        router.push('/');
                      }
                    }}
                    className="text-gray-300 hover:text-white px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 hover:bg-white/10"
                    type="button"
                  >
                    Home
                  </button>
                  <button 
                    onClick={() => router.push('/products')}
                    className="text-gray-300 hover:text-white px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 hover:bg-white/10"
                    type="button"
                  >
                    Products
                  </button>
                  <button 
                    onClick={() => router.push('/pest-services')}
                    className="text-gray-300 hover:text-white px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 hover:bg-white/10"
                    type="button"
                  >
                    Pest Classification
                  </button>
                  <button 
                    onClick={() => router.push('/about')}
                    className="text-gray-300 hover:text-white px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 hover:bg-white/10"
                    type="button"
                  >
                    About Us
                  </button>
                </>
              )}
              
              {/* Show account icon or login button */}
              {!hideAuth && (
                user ? (
                  <button 
                    onClick={toggleSidebar}
                    className="h-10 w-10 rounded-full bg-emerald-600 flex items-center justify-center hover:bg-emerald-700 transition-colors ml-2"
                    aria-label="Account settings"
                    aria-expanded={isSidebarOpen}
                    type="button"
                  >
                    <span className="text-white font-bold text-sm">
                      {user.name?.charAt(0).toUpperCase() || 'U'}
                    </span>
                  </button>
                ) : (
                  <button
                    onClick={() => router.push('/login')}
                    className="px-6 py-2.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-semibold transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 ml-2"
                    type="button"
                  >
                    Log In
                  </button>
                )
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
        /* User Sidebar */
        <div 
          ref={sidebarRef}
          className={`fixed top-0 right-0 h-full w-80 bg-gray-900 shadow-xl z-50 transform transition-transform duration-300 ease-in-out ${isSidebarOpen ? 'translate-x-0' : 'translate-x-full'}`}
        >
          <div className="p-6 h-full flex flex-col">
            <div className="mb-8">
              <h2 className="text-xl font-bold text-white">Account</h2>
            </div>

            <div className="flex-1 flex flex-col">
              {user ? (
                <>
                  <div className="flex items-center gap-4 mb-6">
                    <div className="h-12 w-12 rounded-full bg-emerald-500 flex items-center justify-center text-white font-bold">
                      {user.name?.charAt(0).toUpperCase() || 'U'}
                    </div>
                    <div>
                      <p className="font-medium text-white">{user.name || 'User'}</p>
                      <p className="text-sm text-gray-400">{user.email || ''}</p>
                      {user.role && (
                        <p className="text-xs text-emerald-400 capitalize">{user.role}</p>
                      )}
                    </div>
                  </div>

                  <nav className="space-y-2">
                    {user.role === 'farmer' && (
                      <button 
                        onClick={() => {
                          router.push('/dashboard/farmer');
                          setIsSidebarOpen(false);
                        }}
                        className="w-full flex items-center px-4 py-3 text-left text-gray-300 hover:bg-gray-800 rounded-lg transition-colors"
                      >
                        <svg className="h-5 w-5 mr-3 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                        </svg>
                        Dashboard
                      </button>
                    )}
                    {user.role === 'company' && (
                      <button 
                        onClick={() => {
                          router.push('/dashboard/company');
                          setIsSidebarOpen(false);
                        }}
                        className="w-full flex items-center px-4 py-3 text-left text-gray-300 hover:bg-gray-800 rounded-lg transition-colors"
                      >
                        <svg className="h-5 w-5 mr-3 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                        </svg>
                        Company Dashboard
                      </button>
                    )}
                    <button 
                      onClick={() => {
                        router.push('/pest-services');
                        setIsSidebarOpen(false);
                      }}
                      className="w-full flex items-center px-4 py-3 text-left text-gray-300 hover:bg-gray-800 rounded-lg transition-colors"
                    >
                      <svg className="h-5 w-5 mr-3 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                      </svg>
                      Pest Classification
                    </button>
                    <button 
                      onClick={() => {
                        router.push('/products');
                        setIsSidebarOpen(false);
                      }}
                      className="w-full flex items-center px-4 py-3 text-left text-gray-300 hover:bg-gray-800 rounded-lg transition-colors"
                    >
                      <svg className="h-5 w-5 mr-3 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                      </svg>
                      Browse Products
                    </button>
                  </nav>
                </>
              ) : (
                <div className="text-center py-8">
                  <p className="text-white/80 mb-4">Not logged in</p>
                  <button
                    onClick={() => {
                      router.push('/login');
                      setIsSidebarOpen(false);
                    }}
                    className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg"
                  >
                    Log In
                  </button>
                </div>
              )}

              {user && (
                <div className="mt-auto pt-4 border-t border-gray-800">
                  <button 
                    onClick={async () => {
                      const token = localStorage.getItem('authToken');
                      if (token) {
                        try {
                          await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'}/api/auth/logout`, {
                            method: 'POST',
                            headers: {
                              'Authorization': `Bearer ${token}`,
                            },
                          });
                        } catch (e) {
                          console.error('Logout error:', e);
                        }
                      }
                      localStorage.removeItem('authToken');
                      localStorage.removeItem('authUser');
                      setUser(null);
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
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}