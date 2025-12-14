'use client';

import { useRouter, usePathname } from 'next/navigation';
import { useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
import { useNotifications } from '@/contexts/NotificationContext';

interface NavItem {
  name: string;
  icon: string;
  path: string;
  notificationCount?: number;
}

interface DashboardSidebarProps {
  role?: 'farmer' | 'company' | 'admin';
}

export default function DashboardSidebar({ role }: DashboardSidebarProps) {
  const router = useRouter();
  const pathname = usePathname();
  const { user, logout } = useAuth();
  const [isExpanded, setIsExpanded] = useState(false);
  const { unreadCount } = useNotifications();
  const [pendingBookingsCount, setPendingBookingsCount] = useState(0);

  // Load pending bookings count from localStorage
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedOrders = localStorage.getItem('pestlink_orders');
      if (savedOrders) {
        const orders = JSON.parse(savedOrders);
        if (user?.role === 'company') {
          // For companies, show pending booking requests
          const pending = orders.filter((order: any) => order.status === 'pending').length;
          setPendingBookingsCount(pending);
        } else if (user?.role === 'farmer') {
          // For farmers, show unread status updates
          const farmerOrders = orders.filter((order: any) => 
            order.farmerEmail === user?.email && 
            (order.status === 'confirmed' || order.status === 'cancelled' || order.status === 'completed')
          );
          setPendingBookingsCount(farmerOrders.length);
        }
      }
    }
  }, [user?.role, user?.email]);
  
  // Determine role from user if not provided
  const userRole = role || user?.role || 'farmer';

  const handleLogout = async () => {
    await logout();
    router.push('/');
  };



  // Common navigation items for all users
  const commonNavItems: NavItem[] = [
    { name: 'Services', icon: 'M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z', path: '/services' },
    { name: 'Pest Classification', icon: 'M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z', path: '/pest-services' },
    { name: 'About', icon: 'M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z', path: '/about' },
  ];

  // Get navigation items based on role - each role has different accessible features
  let navItems: NavItem[] = [];
  
  if (userRole === 'farmer') {
    // Calculate pending orders count for the current farmer
    const pendingOrdersCount = (() => {
      if (typeof window !== 'undefined') {
        const savedOrders = localStorage.getItem('pestlink_orders');
        if (savedOrders) {
          const orders = JSON.parse(savedOrders);
          return orders.filter((order: any) => 
            order.status === 'pending' && 
            order.farmerEmail === user?.email
          ).length;
        }
      }
      return 0;
    })();

    // Farmers can access: Dashboard, My Orders, Pest Classification, Services, About
    navItems = [
      { name: 'Dashboard', icon: 'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6', path: '/dashboard/farmer' },
      { 
        name: 'My Orders', 
        icon: 'M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01', 
        path: '/dashboard/farmer/orders',
        notificationCount: pendingOrdersCount
      },
      { name: 'Pest Classification', icon: 'M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z', path: '/pest-services' },
      { name: 'Services', icon: 'M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z', path: '/services' },
      { name: 'About', icon: 'M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z', path: '/about' },
    ];
  } else if (userRole === 'company') {
    // Companies can access: Dashboard, Manage Services, Bookings, About
    navItems = [
      { name: 'Dashboard', icon: 'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6', path: '/dashboard/company' },
      { name: 'Manage Services', icon: 'M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10', path: '/company/services' },
      { 
        name: 'Bookings', 
        icon: 'M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01', 
        path: '/company/orders', 
        notificationCount: pendingBookingsCount 
      },
      { name: 'About', icon: 'M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z', path: '/about' },
    ];
  } else if (userRole === 'admin') {
    // Admins can access: Dashboard, Manage Users, Reports, Settings, About
    navItems = [
      { name: 'Dashboard', icon: 'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6', path: '/admin' },
      { name: 'Manage Users', icon: 'M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z', path: '/admin/users' },
      { name: 'View Reports', icon: 'M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z', path: '/admin/reports' },
      { name: 'Settings', icon: 'M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z', path: '/admin/settings' },
      { name: 'About', icon: 'M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z', path: '/about' },
    ];
  } else {
    // For non-authenticated users or unknown roles, show common items only
    navItems = commonNavItems;
  }

  return (
    <div
      className="peer fixed left-0 top-0 h-full bg-gray-900/95 backdrop-blur-sm border-r border-white/10 z-40 transition-all duration-300 ease-in-out w-20 hover:w-64"
      onMouseEnter={() => setIsExpanded(true)}
      onMouseLeave={() => setIsExpanded(false)}
    >
      <div className="h-full flex flex-col p-4">
        {/* Logo/Header */}
        <div className="mb-8 flex items-center gap-3">
          <div className="h-10 w-10 rounded-md bg-gradient-to-br from-emerald-500 to-lime-400 flex items-center justify-center font-bold text-black flex-shrink-0">
            X
          </div>
          {isExpanded && (
            <span className="text-lg font-bold text-white whitespace-nowrap">PEST LINK</span>
          )}
        </div>

        {/* User Info */}
        {user ? (
          <div className={`mb-6 pb-6 border-b border-white/10 ${isExpanded ? 'flex items-center gap-3' : 'flex flex-col items-center'}`}>
            <div className="h-10 w-10 rounded-full bg-emerald-600 flex items-center justify-center text-white font-bold flex-shrink-0">
              {user.name?.charAt(0).toUpperCase() || 'U'}
            </div>
            {isExpanded && (
              <div className="min-w-0">
                <p className="font-medium text-white text-sm truncate">{user.name || 'User'}</p>
                <p className="text-xs text-gray-400 truncate">{user.email || ''}</p>
                {user.role && (
                  <p className="text-xs text-emerald-400 capitalize">{user.role}</p>
                )}
              </div>
            )}
          </div>
        ) : (
          <div className="mb-6 pb-6 border-b border-white/10">
            {isExpanded ? (
              <button
                onClick={() => router.push('/login')}
                className="w-full px-3 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-medium rounded-lg transition-all duration-200"
              >
                Log In
              </button>
            ) : (
              <button
                onClick={() => router.push('/login')}
                className="w-full p-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg transition-all duration-200 flex items-center justify-center"
                title="Log In"
              >
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
                </svg>
              </button>
            )}
          </div>
        )}

        {/* Navigation */}
        <nav className="flex-1 space-y-1">
          {navItems.map((item) => {
            // Fix exact path matching to prevent multiple selections
            const isActive = pathname === item.path || 
              (item.path !== '/admin' && pathname.startsWith(item.path + '/')) ||
              (item.path === '/admin' && pathname === '/admin');
            return (
              <button
                key={item.path}
                onClick={() => router.push(item.path)}
                className={`w-full flex items-center gap-3 px-3 py-3 rounded-lg transition-all duration-200 ${
                  isActive
                    ? 'bg-emerald-600/20 text-emerald-400 border border-emerald-600/30'
                    : 'text-gray-300 hover:bg-gray-800 hover:text-white'
                }`}
                title={!isExpanded ? item.name : undefined}
              >
                <div className="relative">
                  <svg
                    className="h-5 w-5 flex-shrink-0"
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
                  {(item.notificationCount ?? 0) > 0 && (
                    <span className="absolute -top-2 -right-2 flex items-center justify-center h-5 w-5 rounded-full bg-red-500 text-white text-xs font-bold">
                      {(item.notificationCount ?? 0) > 9 ? '9+' : item.notificationCount}
                    </span>
                  )}
                </div>
                {isExpanded && (
                  <span className="text-sm font-medium whitespace-nowrap">
                    {item.name}
                    {(item.notificationCount ?? 0) > 0 && !isExpanded && (
                      <span className="ml-2 px-2 py-0.5 bg-red-500 text-white text-xs rounded-full">
                        {(item.notificationCount ?? 0) > 9 ? '9+' : item.notificationCount}
                      </span>
                    )}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        {/* Logout or Sign Up */}
        <div className="pt-4 border-t border-white/10">
          {user ? (
            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-3 px-3 py-3 rounded-lg text-red-400 hover:bg-red-900/20 transition-all duration-200"
              title={!isExpanded ? 'Sign out' : undefined}
            >
              <svg
                className="h-5 w-5 flex-shrink-0"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                />
              </svg>
              {isExpanded && <span className="text-sm font-medium whitespace-nowrap">Sign out</span>}
            </button>
          ) : (
            <button
              onClick={() => router.push('/signup')}
              className="w-full flex items-center gap-3 px-3 py-3 rounded-lg text-emerald-400 hover:bg-emerald-900/20 transition-all duration-200"
              title={!isExpanded ? 'Sign up' : undefined}
            >
              <svg
                className="h-5 w-5 flex-shrink-0"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z"
                />
              </svg>
              {isExpanded && <span className="text-sm font-medium whitespace-nowrap">Sign up</span>}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

