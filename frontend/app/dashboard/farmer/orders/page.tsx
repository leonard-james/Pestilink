'use client';

import { useState, useEffect, useCallback } from 'react';
import { FiPackage, FiCalendar, FiPhone, FiMail, FiClock, FiCheck, FiX, FiTruck, FiLoader } from 'react-icons/fi';
import DashboardSidebar from '@/app/components/DashboardSidebar';
import { useAuth } from '@/app/hooks/useAuth';
import { useNotifications } from '@/contexts/NotificationContext';

interface Order {
  id: number;
  farmerName: string;
  farmerEmail: string;
  farmerPhone: string;
  serviceTitle: string;
  companyName: string;
  orderDate: string;
  status: 'pending' | 'confirmed' | 'preparing' | 'out_for_delivery' | 'completed' | 'cancelled';
  quantity?: number;
  totalAmount: number;
  notes?: string;
}

export default function FarmerOrders() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const { markAllAsRead } = useNotifications();
  
  // Memoize the markAllAsRead function to prevent unnecessary re-renders
  const stableMarkAllAsRead = useCallback(() => {
    markAllAsRead();
  }, [markAllAsRead]);

  // Load orders from localStorage
  useEffect(() => {
    const savedOrders = localStorage.getItem('pestlink_orders');
    if (savedOrders) {
      const parsedOrders: Order[] = JSON.parse(savedOrders);
      // Filter orders for the current farmer, ensure correct status type, and sort by date (newest first)
      const farmerOrders = parsedOrders
        .filter((order) => order.farmerEmail === user?.email)
        .map(safeCastOrder)
        .sort((a, b) => new Date(b.orderDate).getTime() - new Date(a.orderDate).getTime());
      setOrders(farmerOrders);
    }
    setLoading(false);
  }, [user?.email]);

  // Mark notifications as read when component mounts
  useEffect(() => {
    stableMarkAllAsRead();
  }, [stableMarkAllAsRead]);

  // Helper function to safely cast order status
  const safeCastOrder = (order: any): Order => {
    const validStatuses = ['pending', 'confirmed', 'preparing', 'out_for_delivery', 'completed', 'cancelled'] as const;
    const status = validStatuses.includes(order.status) ? order.status : 'pending';
    
    return {
      ...order,
      status
    };
  };

  const getStatusIcon = (status: Order['status']) => {
    switch (status) {
      case 'pending':
        return <FiClock className="text-yellow-400" />;
      case 'confirmed':
        return <FiCheck className="text-blue-400" />;
      case 'preparing':
        return <FiLoader className="text-purple-400" />;
      case 'out_for_delivery':
        return <FiTruck className="text-orange-400" />;
      case 'completed':
        return <FiCheck className="text-green-400" />;
      case 'cancelled':
        return <FiX className="text-red-400" />;
      default:
        return null;
    }
  };

  const getStatusText = (status: Order['status']) => {
    switch (status) {
      case 'pending': return 'Pending';
      case 'confirmed': return 'Confirmed';
      case 'preparing': return 'Preparing';
      case 'out_for_delivery': return 'Out for Delivery';
      case 'completed': return 'Completed';
      case 'cancelled': return 'Cancelled';
      default: return 'Unknown';
    }
  };

  const getStatusColor = (status: Order['status']) => {
    switch (status) {
      case 'pending': return 'bg-yellow-900/50 text-yellow-300';
      case 'confirmed': return 'bg-blue-900/50 text-blue-300';
      case 'preparing': return 'bg-purple-900/50 text-purple-300';
      case 'out_for_delivery': return 'bg-orange-900/50 text-orange-300';
      case 'completed': return 'bg-green-900/50 text-green-300';
      case 'cancelled': return 'bg-red-900/50 text-red-300';
      default: return 'bg-gray-900/50 text-gray-300';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen w-full bg-gray-900 text-white flex">
        <DashboardSidebar role="farmer" />
        <div className="flex-1 flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-emerald-500"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full bg-gray-900 text-white flex">
      <DashboardSidebar role="farmer" />
      <div 
        className="flex-1 relative ml-20 peer-hover:ml-64 transition-all duration-300"
        style={{
          backgroundImage: "url('/farm pic.jpg')",
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundAttachment: 'fixed',
        }}
      >
        <div className="absolute inset-0 bg-black/50 backdrop-blur-sm"></div>
        <main className="relative z-10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
              <div>
                <h1 className="text-2xl font-bold">My Orders</h1>
                <p className="text-gray-400">Track the status of your service requests</p>
              </div>
            </div>

            {orders.length === 0 ? (
              <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-8 text-center">
                <div className="mx-auto w-16 h-16 bg-gray-700/50 rounded-full flex items-center justify-center mb-4">
                  <FiPackage className="text-gray-400 text-2xl" />
                </div>
                <h3 className="text-lg font-medium text-white mb-1">No orders yet</h3>
                <p className="text-gray-400 mb-6">You haven't made any service requests yet.</p>
                <button
                  onClick={() => window.location.href = '/services'}
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-emerald-600 hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500"
                >
                  Browse Services
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                {orders.map((order) => (
                  <div 
                    key={order.id} 
                    className="bg-gray-800/50 backdrop-blur-sm rounded-xl overflow-hidden border border-gray-700/50 hover:border-emerald-500/30 transition-colors duration-200"
                  >
                    <div className="p-6">
                      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center space-x-3">
                            <div className={`flex-shrink-0 h-10 w-10 rounded-full ${getStatusColor(order.status)} flex items-center justify-center`}>
                              {getStatusIcon(order.status)}
                            </div>
                            <div>
                              <h3 className="text-lg font-medium text-white">
                                {order.serviceTitle}
                              </h3>
                              <div className="text-sm text-gray-400">
                                <p>{order.companyName} • {new Date(order.orderDate).toLocaleDateString()}</p>
                                {order.quantity && (
                                  <p className="mt-1">
                                    Quantity: {order.quantity}
                                  </p>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="mt-4 sm:mt-0 sm:ml-4">
                          <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(order.status)}`}>
                            {getStatusText(order.status)}
                          </div>
                        </div>
                      </div>
                      
                      <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                        <div className="bg-gray-700/30 p-3 rounded-lg">
                          <div className="text-gray-400">Order ID</div>
                          <div className="text-white font-medium">#{order.id}</div>
                        </div>
                        <div className="bg-gray-700/30 p-3 rounded-lg">
                          <div className="text-gray-400">Total Amount</div>
                          <div className="text-white font-medium">₱{order.totalAmount.toLocaleString()}</div>
                        </div>
                        <div className="bg-gray-700/30 p-3 rounded-lg">
                          <div className="text-gray-400">Order Date</div>
                          <div className="text-white font-medium">
                            {new Date(order.orderDate).toLocaleDateString('en-US', {
                              year: 'numeric',
                              month: 'long',
                              day: 'numeric'
                            })}
                          </div>
                        </div>
                      </div>

                      {order.notes && (
                        <div className="mt-4 p-3 bg-gray-700/30 rounded-lg">
                          <div className="text-gray-400 text-sm mb-1">Notes</div>
                          <p className="text-white">{order.notes}</p>
                        </div>
                      )}

                      <div className="mt-4 pt-4 border-t border-gray-700 flex flex-wrap gap-3">
                        <button
                          onClick={() => {
                            // In a real app, this would open a chat or contact form
                            window.location.href = `mailto:${order.farmerEmail}?subject=Regarding Order #${order.id}`;
                          }}
                          className="inline-flex items-center px-3 py-1.5 border border-gray-600 text-sm font-medium rounded-md text-gray-200 bg-gray-700 hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500"
                        >
                          <FiMail className="mr-1.5 h-4 w-4" />
                          Contact Support
                        </button>
                        
                        {order.status === 'pending' && (
                          <button
                            onClick={() => {
                              // In a real app, this would cancel the order
                              if (confirm('Are you sure you want to cancel this order?')) {
                                const updatedOrders = orders.map(o => 
                                  o.id === order.id ? { ...o, status: 'cancelled' } : o
                                );
                                setOrders(updatedOrders);
                                localStorage.setItem('pestlink_orders', JSON.stringify(updatedOrders));
                              }
                            }}
                            className="inline-flex items-center px-3 py-1.5 border border-red-600 text-sm font-medium rounded-md text-red-200 bg-red-900/30 hover:bg-red-800/50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                          >
                            <FiX className="mr-1.5 h-4 w-4" />
                            Cancel Order
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
