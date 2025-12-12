"use client";

import Image from "next/image";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import DashboardSidebar from "../components/DashboardSidebar";

interface UserStats {
  totalUsers: number;
  totalFarmers: number;
  totalCompanies: number;
  activeUsers: number;
  newUsersThisMonth: number;
}

interface ActivityItem {
  id: number;
  type: 'login' | 'logout' | 'order' | 'signup' | 'service_created';
  user: string;
  userRole: 'farmer' | 'company' | 'admin';
  description: string;
  timestamp: string;
}

export default function AdminDashboard() {
  const router = useRouter();
  const [userStats, setUserStats] = useState<UserStats>({
    totalUsers: 0,
    totalFarmers: 0,
    totalCompanies: 0,
    activeUsers: 0,
    newUsersThisMonth: 0,
  });
  const [recentActivity, setRecentActivity] = useState<ActivityItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUserStats();
    fetchRecentActivity();
  }, []);

  const getApiBase = () => {
    const base = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
    return base.replace(/\/?$/, '');
  };

  const fetchUserStats = async () => {
    try {
      const token = localStorage.getItem('authToken');
      
      // Fetch all users to calculate statistics
      const usersResponse = await fetch(`${getApiBase()}/api/users`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      
      if (usersResponse.ok) {
        const users = await usersResponse.json();
        
        // Calculate statistics from real user data
        const totalUsers = users.length;
        const totalFarmers = users.filter((user: any) => user.role === 'farmer').length;
        const totalCompanies = users.filter((user: any) => user.role === 'company').length;
        
        // Calculate new users this month
        const currentMonth = new Date().getMonth();
        const currentYear = new Date().getFullYear();
        const newUsersThisMonth = users.filter((user: any) => {
          const createdDate = new Date(user.created_at || user.createdAt);
          return createdDate.getMonth() === currentMonth && createdDate.getFullYear() === currentYear;
        }).length;
        
        // Calculate active users (users who logged in within last 7 days)
        const sevenDaysAgo = new Date();
        sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
        const activeUsers = users.filter((user: any) => {
          const lastLogin = new Date(user.last_login || user.updated_at || user.created_at);
          return lastLogin >= sevenDaysAgo;
        }).length;
        
        setUserStats({
          totalUsers,
          totalFarmers,
          totalCompanies,
          activeUsers,
          newUsersThisMonth,
        });
      } else {
        console.error('Failed to fetch users for stats:', usersResponse.status);
        setUserStats({
          totalUsers: 0,
          totalFarmers: 0,
          totalCompanies: 0,
          activeUsers: 0,
          newUsersThisMonth: 0,
        });
      }
    } catch (error) {
      console.error('Error fetching user stats:', error);
      setUserStats({
        totalUsers: 0,
        totalFarmers: 0,
        totalCompanies: 0,
        activeUsers: 0,
        newUsersThisMonth: 0,
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchRecentActivity = async () => {
    try {
      const token = localStorage.getItem('authToken');
      
      // Try to fetch from dedicated activity endpoint first
      let activityResponse = await fetch(`${getApiBase()}/api/admin/activity`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      
      if (activityResponse.ok) {
        const data = await activityResponse.json();
        setRecentActivity(data);
        return;
      }
      
      // If no dedicated endpoint, fetch bookings and users to create activity
      const [bookingsResponse, usersResponse] = await Promise.all([
        fetch(`${getApiBase()}/api/bookings`, {
          headers: { 'Authorization': `Bearer ${token}` },
        }),
        fetch(`${getApiBase()}/api/users`, {
          headers: { 'Authorization': `Bearer ${token}` },
        })
      ]);
      
      const activities: ActivityItem[] = [];
      
      // Add booking activities
      if (bookingsResponse.ok) {
        const bookings = await bookingsResponse.json();
        const recentBookings = Array.isArray(bookings) ? bookings : (bookings.data || []);
        recentBookings.slice(0, 3).forEach((booking: any, index: number) => {
          activities.push({
            id: index + 1,
            type: 'order',
            user: booking.user?.name || booking.farmer_name || 'Unknown User',
            userRole: booking.user?.role || 'farmer',
            description: `Placed booking for ${booking.service?.title || booking.service_name || 'service'}`,
            timestamp: booking.created_at || booking.booking_date || new Date().toISOString(),
          });
        });
      }
      
      // Add user signup activities
      if (usersResponse.ok) {
        const users = await usersResponse.json();
        const userArray = Array.isArray(users) ? users : (users.data || []);
        const recentUsers = userArray
          .filter((user: any) => user.created_at || user.createdAt)
          .sort((a: any, b: any) => new Date(b.created_at || b.createdAt).getTime() - new Date(a.created_at || a.createdAt).getTime())
          .slice(0, 2);
        
        recentUsers.forEach((user: any, index: number) => {
          activities.push({
            id: activities.length + index + 1,
            type: 'signup',
            user: user.name,
            userRole: user.role || 'farmer',
            description: `New ${user.role || 'farmer'} registered`,
            timestamp: user.created_at || user.createdAt,
          });
        });
      }
      
      // Sort activities by timestamp (most recent first)
      activities.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
      
      setRecentActivity(activities.slice(0, 5));
      
    } catch (error) {
      console.error('Error fetching recent activity:', error);
      setRecentActivity([]);
    }
  };

  const handleQuickAction = (action: string) => {
    switch (action) {
      case 'manage-users':
        router.push('/admin/users');
        break;
      case 'view-reports':
        router.push('/admin/reports');
        break;
      case 'settings':
        router.push('/admin/settings');
        break;
      case 'analytics':
        // Scroll to analytics section
        document.getElementById('analytics-section')?.scrollIntoView({ behavior: 'smooth' });
        break;
      default:
        break;
    }
  };

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'login':
        return (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-400" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M3 3a1 1 0 011 1v12a1 1 0 11-2 0V4a1 1 0 011-1zm7.707 3.293a1 1 0 010 1.414L9.414 9H17a1 1 0 110 2H9.414l1.293 1.293a1 1 0 01-1.414 1.414l-3-3a1 1 0 010-1.414l3-3a1 1 0 011.414 0z" clipRule="evenodd" />
          </svg>
        );
      case 'logout':
        return (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M3 3a1 1 0 00-1 1v12a1 1 0 102 0V4a1 1 0 00-1-1zm10.293 9.293a1 1 0 001.414 1.414l3-3a1 1 0 000-1.414l-3-3a1 1 0 10-1.414 1.414L14.586 9H7a1 1 0 100 2h7.586l-1.293 1.293z" clipRule="evenodd" />
          </svg>
        );
      case 'order':
        return (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
          </svg>
        );
      case 'signup':
        return (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
          </svg>
        );
      case 'service_created':
        return (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-yellow-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
        );
      default:
        return (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
          </svg>
        );
    }
  };

  const formatTimeAgo = (timestamp: string) => {
    const now = new Date();
    const time = new Date(timestamp);
    const diffInMinutes = Math.floor((now.getTime() - time.getTime()) / (1000 * 60));
    
    if (diffInMinutes < 1) return 'Just now';
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    
    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) return `${diffInHours}h ago`;
    
    const diffInDays = Math.floor(diffInHours / 24);
    return `${diffInDays}d ago`;
  };
  return (
    <div className="min-h-screen w-full bg-gray-900 text-white flex">
      <DashboardSidebar role="admin" />
      
      <main className="relative z-10 flex-1 ml-20 peer-hover:ml-64 transition-all duration-300">
        <div className="relative min-h-screen">
          {/* Background image */}
          <Image
            src="/farm pic.jpg"
            alt="Admin Dashboard Background"
            fill
            className="object-cover"
            priority
          />

          {/* Overlay gradient */}
          <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/40 to-transparent"></div>

          {/* Content */}
          <div className="absolute inset-0 w-full px-4">
            <div className="w-full max-w-[1800px] mx-auto">
              {/* Title Box */}
              <div className="mb-10 text-center">
                <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl">
                  Admin Dashboard
                </h1>
                <p className="mt-4 text-xl text-gray-300">
                  Manage your application with powerful admin tools
                </p>
              </div>

              {/* Stats Grid */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-10">
                {/* Total Users Card */}
                <div className="bg-gray-600/30 p-6 rounded-xl backdrop-blur-sm border border-gray-500/20 hover:border-green-400/50 transition-all duration-300">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-lg font-medium">Total Users</h3>
                    <div className="p-2 bg-green-500/20 rounded-lg">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                      </svg>
                    </div>
                  </div>
                  {loading ? (
                    <div className="animate-pulse">
                      <div className="h-8 bg-gray-500/30 rounded mb-2"></div>
                      <div className="h-4 bg-gray-500/20 rounded w-3/4"></div>
                    </div>
                  ) : (
                    <>
                      <p className="text-3xl font-bold text-green-400">{userStats.totalUsers.toLocaleString()}</p>
                      <p className="text-sm text-gray-400 mt-2">+{userStats.newUsersThisMonth} this month</p>
                    </>
                  )}
                </div>
                
                {/* Farmers Card */}
                <div className="bg-gray-600/30 p-6 rounded-xl backdrop-blur-sm border border-gray-500/20 hover:border-blue-400/50 transition-all duration-300">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-lg font-medium">Farmers</h3>
                    <div className="p-2 bg-blue-500/20 rounded-lg">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                    </div>
                  </div>
                  {loading ? (
                    <div className="animate-pulse">
                      <div className="h-8 bg-gray-500/30 rounded mb-2"></div>
                      <div className="h-4 bg-gray-500/20 rounded w-2/3"></div>
                    </div>
                  ) : (
                    <>
                      <p className="text-3xl font-bold text-blue-400">{userStats.totalFarmers.toLocaleString()}</p>
                      <p className="text-sm text-gray-400 mt-2">{Math.round((userStats.totalFarmers / userStats.totalUsers) * 100)}% of users</p>
                    </>
                  )}
                </div>
                
                {/* Companies Card */}
                <div className="bg-gray-600/30 p-6 rounded-xl backdrop-blur-sm border border-gray-500/20 hover:border-purple-400/50 transition-all duration-300">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-lg font-medium">Companies</h3>
                    <div className="p-2 bg-purple-500/20 rounded-lg">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                      </svg>
                    </div>
                  </div>
                  {loading ? (
                    <div className="animate-pulse">
                      <div className="h-8 bg-gray-500/30 rounded mb-2"></div>
                      <div className="h-4 bg-gray-500/20 rounded w-2/3"></div>
                    </div>
                  ) : (
                    <>
                      <p className="text-3xl font-bold text-purple-400">{userStats.totalCompanies.toLocaleString()}</p>
                      <p className="text-sm text-gray-400 mt-2">{Math.round((userStats.totalCompanies / userStats.totalUsers) * 100)}% of users</p>
                    </>
                  )}
                </div>
                
                {/* Active Now Card */}
                <div className="bg-gray-600/30 p-6 rounded-xl backdrop-blur-sm border border-gray-500/20 hover:border-yellow-400/50 transition-all duration-300">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-lg font-medium">Active Now</h3>
                    <div className="p-2 bg-yellow-500/20 rounded-lg">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-yellow-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                      </svg>
                    </div>
                  </div>
                  {loading ? (
                    <div className="animate-pulse">
                      <div className="h-8 bg-gray-500/30 rounded mb-2"></div>
                      <div className="h-4 bg-gray-500/20 rounded w-3/4"></div>
                    </div>
                  ) : (
                    <>
                      <p className="text-3xl font-bold text-yellow-400">{userStats.activeUsers}</p>
                      <p className="text-sm text-gray-400 mt-2">Currently online</p>
                    </>
                  )}
                </div>
              </div>

              {/* Quick Actions */}
              <div className="mb-10">
                <h2 className="text-2xl font-bold mb-6">Quick Actions</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  <button 
                    onClick={() => handleQuickAction('manage-users')}
                    className="p-5 bg-gray-600/30 hover:bg-gray-500/40 rounded-xl backdrop-blur-sm border border-gray-500/20 hover:border-green-500/50 transition-all duration-300 text-left group"
                  >
                    <div className="p-3 bg-green-500/20 rounded-lg inline-block mb-3 group-hover:bg-green-500/30 transition-colors">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                      </svg>
                    </div>
                    <h3 className="font-medium text-lg mb-1">Manage Users</h3>
                    <p className="text-sm text-gray-400">View and manage company and farmer accounts</p>
                  </button>
                  
                  <button 
                    onClick={() => handleQuickAction('view-reports')}
                    className="p-5 bg-gray-600/30 hover:bg-gray-500/40 rounded-xl backdrop-blur-sm border border-gray-500/20 hover:border-blue-500/50 transition-all duration-300 text-left group"
                  >
                    <div className="p-3 bg-blue-500/20 rounded-lg inline-block mb-3 group-hover:bg-blue-500/30 transition-colors">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                    </div>
                    <h3 className="font-medium text-lg mb-1">View Reports</h3>
                    <p className="text-sm text-gray-400">Review system reports and analytics</p>
                  </button>
                  
                  <button 
                    onClick={() => handleQuickAction('settings')}
                    className="p-5 bg-gray-600/30 hover:bg-gray-500/40 rounded-xl backdrop-blur-sm border border-gray-500/20 hover:border-purple-500/50 transition-all duration-300 text-left group"
                  >
                    <div className="p-3 bg-purple-500/20 rounded-lg inline-block mb-3 group-hover:bg-purple-500/30 transition-colors">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                    </div>
                    <h3 className="font-medium text-lg mb-1">Settings</h3>
                    <p className="text-sm text-gray-400">Configure application settings</p>
                  </button>
                  
                  <button 
                    onClick={() => handleQuickAction('analytics')}
                    className="p-5 bg-gray-600/30 hover:bg-gray-500/40 rounded-xl backdrop-blur-sm border border-gray-500/20 hover:border-pink-500/50 transition-all duration-300 text-left group"
                  >
                    <div className="p-3 bg-pink-500/20 rounded-lg inline-block mb-3 group-hover:bg-pink-500/30 transition-colors">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-pink-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                      </svg>
                    </div>
                    <h3 className="font-medium text-lg mb-1">Analytics</h3>
                    <p className="text-sm text-gray-400">View detailed usage statistics</p>
                  </button>
                </div>
              </div>

              {/* Analytics Section */}
              <div id="analytics-section" className="mb-10">
                <h2 className="text-2xl font-bold mb-6">Analytics</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {/* User Growth */}
                  <div className="bg-gray-600/30 p-6 rounded-xl backdrop-blur-sm border border-gray-500/20 hover:border-emerald-400/50 transition-all duration-300">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-lg font-medium">User Growth</h3>
                      <div className="p-2 bg-emerald-500/20 rounded-lg">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                        </svg>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-400">This Month</span>
                        <span className="text-sm font-medium text-emerald-400">+{userStats.newUsersThisMonth}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-400">Growth Rate</span>
                        <span className="text-sm font-medium text-emerald-400">+12.5%</span>
                      </div>
                      <div className="w-full bg-gray-700/50 rounded-full h-2">
                        <div className="bg-emerald-500 h-2 rounded-full" style={{ width: '75%' }}></div>
                      </div>
                    </div>
                  </div>

                  {/* Platform Usage */}
                  <div className="bg-gray-600/30 p-6 rounded-xl backdrop-blur-sm border border-gray-500/20 hover:border-blue-400/50 transition-all duration-300">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-lg font-medium">Platform Usage</h3>
                      <div className="p-2 bg-blue-500/20 rounded-lg">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                        </svg>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-400">Daily Active Users</span>
                        <span className="text-sm font-medium text-blue-400">{Math.round(userStats.activeUsers * 2.5)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-400">Session Duration</span>
                        <span className="text-sm font-medium text-blue-400">24m avg</span>
                      </div>
                      <div className="w-full bg-gray-700/50 rounded-full h-2">
                        <div className="bg-blue-500 h-2 rounded-full" style={{ width: '60%' }}></div>
                      </div>
                    </div>
                  </div>

                  {/* Service Bookings */}
                  <div className="bg-gray-600/30 p-6 rounded-xl backdrop-blur-sm border border-gray-500/20 hover:border-purple-400/50 transition-all duration-300">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-lg font-medium">Service Bookings</h3>
                      <div className="p-2 bg-purple-500/20 rounded-lg">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                        </svg>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-400">This Week</span>
                        <span className="text-sm font-medium text-purple-400">127</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-400">Completion Rate</span>
                        <span className="text-sm font-medium text-purple-400">94.2%</span>
                      </div>
                      <div className="w-full bg-gray-700/50 rounded-full h-2">
                        <div className="bg-purple-500 h-2 rounded-full" style={{ width: '94%' }}></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Recent Activity */}
              <div className="bg-gray-600/30 rounded-xl backdrop-blur-sm border border-gray-500/20 p-6 hover:border-blue-400/50 transition-all duration-300">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-bold">Recent Activity</h2>
                  <button 
                    onClick={fetchRecentActivity}
                    className="text-sm text-gray-400 hover:text-white transition-colors px-3 py-1 rounded-lg hover:bg-gray-500/20"
                  >
                    Refresh →
                  </button>
                </div>
                
                <div className="space-y-4">
                  {recentActivity.length > 0 ? (
                    recentActivity.map((activity) => (
                      <div key={activity.id} className="flex items-center p-4 bg-gray-500/10 rounded-lg hover:bg-gray-500/20 transition-colors">
                        <div className="p-2 bg-gray-500/20 rounded-lg mr-4">
                          {getActivityIcon(activity.type)}
                        </div>
                        <div className="flex-1">
                          <h4 className="font-medium">{activity.description}</h4>
                          <div className="flex items-center gap-2 mt-1">
                            <span className="text-sm text-gray-400">{activity.user}</span>
                            <span className={`text-xs px-2 py-0.5 rounded-full ${
                              activity.userRole === 'farmer' ? 'bg-green-900/50 text-green-300' :
                              activity.userRole === 'company' ? 'bg-blue-900/50 text-blue-300' :
                              'bg-purple-900/50 text-purple-300'
                            }`}>
                              {activity.userRole}
                            </span>
                            <span className="text-sm text-gray-500">•</span>
                            <span className="text-sm text-gray-400">{formatTimeAgo(activity.timestamp)}</span>
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center text-gray-400 py-8">
                      No recent activity to display
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
