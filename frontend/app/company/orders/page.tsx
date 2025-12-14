"use client";

import React, { useState, useEffect, useCallback } from 'react';
import { FiPackage, FiCalendar, FiPhone, FiMail, FiX } from 'react-icons/fi';
import DashboardSidebar from "../../components/DashboardSidebar";
import PageHeader from "../../components/PageHeader";
import { useNotifications } from '@/contexts/NotificationContext';

type OrderStatus = 'pending' | 'confirmed' | 'preparing' | 'out_for_delivery' | 'completed' | 'cancelled';

interface Order {
  id: number;
  farmerName: string;
  farmerEmail: string;
  farmerPhone: string;
  farmerAddress: string;
  serviceTitle: string;
  companyName: string;
  orderDate: string;
  status: OrderStatus;
  quantity?: number;
  totalAmount: number;
  notes?: string;
}

const isBrowser = typeof window !== 'undefined';

const getLocalStorageItem = <T,>(key: string, defaultValue: T): T => {
  if (!isBrowser) return defaultValue;
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : defaultValue;
  } catch (error) {
    console.error(`Error reading from localStorage: ${error}`);
    return defaultValue;
  }
};

const setLocalStorageItem = <T,>(key: string, value: T): void => {
  if (!isBrowser) return;
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    console.error(`Error writing to localStorage: ${error}`);
  }
};

export default function CompanyOrdersManagement() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState<OrderStatus | ''>('');
  const [searchTerm, setSearchTerm] = useState('');
  const { addNotification } = useNotifications();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    try {
      // Load orders from localStorage (in a real app, this would be from an API)
      const savedOrders = getLocalStorageItem<Order[]>('pestlink_orders', []);
      // Sort orders by date in descending order (newest first)
      const sortedOrders = [...savedOrders].sort((a, b) => 
        new Date(b.orderDate).getTime() - new Date(a.orderDate).getTime()
      );
      setOrders(sortedOrders);
      setError(null);
    } catch (error) {
      console.error('Failed to load orders:', error);
      setError('Failed to load orders. Please refresh the page.');
    } finally {
      setLoading(false);
    }
  }, []);

  const [pendingStatusUpdate, setPendingStatusUpdate] = useState<{orderId: number, newStatus: OrderStatus, serviceTitle: string} | null>(null);

  // Handle status updates and notifications in a useEffect
  useEffect(() => {
    if (pendingStatusUpdate) {
      const { orderId, newStatus, serviceTitle } = pendingStatusUpdate;
      
      // Update orders state
      setOrders(prevOrders => {
        const updatedOrders = prevOrders.map(order => {
          if (order.id === orderId) {
            return { ...order, status: newStatus };
          }
          return order;
        });
        
        // Update localStorage
        setLocalStorageItem('pestlink_orders', updatedOrders);
        
        // Update the notification count in the sidebar
        const pendingCount = updatedOrders.filter(order => order.status === 'pending').length;
        setLocalStorageItem('pending_bookings_count', pendingCount);
        
        // Dispatch an event to notify the sidebar about the update
        if (isBrowser) {
          window.dispatchEvent(new Event('bookings_updated'));
        }
        
        return updatedOrders;
      });

      // Add notification
      const statusText: Record<OrderStatus, string> = {
        'pending': 'pending',
        'confirmed': 'confirmed',
        'preparing': 'being prepared',
        'out_for_delivery': 'out for delivery',
        'completed': 'completed',
        'cancelled': 'cancelled'
      };
      
      addNotification({
        type: 'info',
        message: `Your booking for "${serviceTitle}" has been ${statusText[newStatus]}.`,
        link: '/dashboard/farmer/orders'
      });

      // Clear the pending update
      setPendingStatusUpdate(null);
    }
  }, [pendingStatusUpdate, addNotification]);

  const updateOrderStatus = useCallback((orderId: number, newStatus: OrderStatus, serviceTitle: string) => {
    try {
      // Set the pending status update which will be processed by the useEffect
      setPendingStatusUpdate({ orderId, newStatus, serviceTitle });
    } catch (error) {
      console.error('Failed to update order status:', error);
      setError('Failed to update order status. Please try again.');
    }
  }, []);

  const removeCompletedOrder = useCallback((orderId: number) => {
    try {
      setOrders(prevOrders => {
        const updatedOrders = prevOrders.filter(order => order.id !== orderId);
        
        // Update localStorage
        setLocalStorageItem('pestlink_orders', updatedOrders);
        
        // Update the notification count in the sidebar
        const pendingCount = updatedOrders.filter(order => order.status === 'pending').length;
        setLocalStorageItem('pending_bookings_count', pendingCount);
        
        // Dispatch an event to notify the sidebar about the update
        if (isBrowser) {
          window.dispatchEvent(new Event('bookings_updated'));
        }
        
        return updatedOrders;
      });
    } catch (error) {
      console.error('Failed to remove order:', error);
      setError('Failed to remove order. Please try again.');
    }
  }, []);

  const clearAllCompletedOrders = useCallback(() => {
    if (isBrowser && window.confirm('Are you sure you want to clear all completed orders? This action cannot be undone.')) {
      try {
        setOrders(prevOrders => {
          const updatedOrders = prevOrders.filter(order => order.status !== 'completed');
          setLocalStorageItem('pestlink_orders', updatedOrders);
          return updatedOrders;
        });
      } catch (error) {
        console.error('Failed to clear completed orders:', error);
        setError('Failed to clear completed orders. Please try again.');
      }
    }
  }, []);

  const filteredOrders = React.useMemo(() => {
    return orders.filter(order => {
      // Include all order statuses in the main view
      const matchesStatus = !filterStatus || order.status === filterStatus;
      const matchesSearch = !searchTerm || 
        order.farmerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.serviceTitle.toLowerCase().includes(searchTerm.toLowerCase());
      return matchesStatus && matchesSearch;
    });
  }, [orders, filterStatus, searchTerm]);

  const getStatusColor = (status: OrderStatus) => {
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

  const getStatusText = (status: OrderStatus) => {
    switch (status) {
      case 'pending': return 'Pending';
      case 'confirmed': return 'Confirmed';
      case 'preparing': return 'Preparing to Ship';
      case 'out_for_delivery': return 'Out for Delivery';
      case 'completed': return 'Completed';
      case 'cancelled': return 'Cancelled';
      default: return 'Unknown';
    }
  };

  return (
    <div className="min-h-screen bg-cover bg-center bg-no-repeat text-white" style={{ backgroundImage: 'linear-gradient(rgba(0, 0, 0, 0.7), rgba(0, 0, 0, 0.7)), url("/farm pic.jpg")' }}>
      <div className="flex">
        <DashboardSidebar role="company" />
        <div className="flex-1 overflow-auto">
          <div className="p-6 max-w-7xl mx-auto">
            <PageHeader />
            {error && (
              <div className="mb-4 p-4 bg-red-900/50 border border-red-700 text-red-100 rounded-lg">
                {error}
              </div>
            )}
            <main className="relative z-10">
              <div className="py-6">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6 gap-4">
                  <div className="flex-1">
                    <h1 className="text-3xl font-bold text-white mb-2">Orders Management</h1>
                    <p className="text-gray-200 mb-6">Manage your service orders from farmers</p>
                    <div className="relative max-w-md">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <svg className="h-5 w-5 text-gray-300" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
                        </svg>
                      </div>
                      <input
                        type="text"
                        className="bg-white/10 backdrop-blur-sm border border-gray-600 text-white text-sm rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 block w-full pl-10 p-2.5 placeholder-gray-400"
                        placeholder="Search by farmer name or service..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                      />
                    </div>
                  </div>
                  <div className="flex-shrink-0">
                    <select
                      value={filterStatus}
                      onChange={(e) => setFilterStatus(e.target.value as OrderStatus || '')}
                      className="bg-white/10 backdrop-blur-sm border border-gray-600 text-white text-sm rounded-lg p-2.5 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 h-10"
                    >
                      <option value="">All Statuses</option>
                      <option value="pending">Pending</option>
                      <option value="confirmed">Confirmed</option>
                      <option value="preparing">Preparing to Ship</option>
                      <option value="out_for_delivery">Out for Delivery</option>
                      <option value="completed">Completed</option>
                      <option value="cancelled">Cancelled</option>
                    </select>
                  </div>
                </div>

                {/* Orders Table */}
                <div className="bg-white/5 backdrop-blur-sm rounded-xl overflow-hidden border border-gray-600/30 shadow-lg">
                  {loading ? (
                    <div className="p-8 text-center text-gray-400">Loading orders...</div>
                  ) : (
                    <>
                      {filteredOrders.length > 0 ? (
                        <div className="overflow-x-auto">
                          <table className="w-full text-sm text-left text-gray-300">
                            <thead className="text-xs text-gray-300 uppercase bg-gray-800/80 border-b border-gray-700">
                              <tr className="bg-white/5">
                                <th scope="col" className="px-6 py-4 text-gray-200 font-semibold">Order ID</th>
                                <th scope="col" className="px-6 py-4 text-gray-200 font-semibold">Farmer</th>
                                <th scope="col" className="px-6 py-4 text-gray-200 font-semibold">Products</th>
                                <th scope="col" className="px-6 py-4 text-gray-200 font-semibold">Date</th>
                                <th scope="col" className="px-6 py-4 text-gray-200 font-semibold">Amount</th>
                                <th scope="col" className="px-6 py-4 text-gray-200 font-semibold">Status</th>
                                <th scope="col" className="px-6 py-4 text-right text-gray-200 font-semibold">Actions</th>
                              </tr>
                            </thead>
                            <tbody>
                              {filteredOrders.map((order) => (
                                <tr key={order.id} className="border-t border-gray-700/50 hover:bg-gray-700/30 transition-colors">
                                  <td className="px-6 py-4 font-medium">#{order.id}</td>
                                  <td className="px-6 py-4">
                                    <div>
                                      <div className="font-medium">{order.farmerName}</div>
                                      <div className="text-xs text-gray-400 flex items-center gap-1">
                                        <FiMail size={12} />
                                        {order.farmerEmail}
                                      </div>
                                      <div className="text-xs text-gray-400 flex items-center gap-1">
                                        <FiPhone size={12} />
                                        {order.farmerPhone}
                                      </div>
                                    </div>
                                  </td>
                                  <td className="px-6 py-4">
                                    <div className="font-medium">{order.serviceTitle}</div>
                                    {order.quantity && (
                                      <div className="text-xs text-gray-400 mt-1">
                                        Quantity: {order.quantity}
                                      </div>
                                    )}
                                    {order.notes && (
                                      <div className="text-xs text-gray-400 mt-1">
                                        Notes: {order.notes}
                                      </div>
                                    )}
                                  </td>
                                  <td className="px-6 py-4">
                                    <div className="flex items-center gap-1">
                                      <FiCalendar size={14} />
                                      {new Date(order.orderDate).toLocaleDateString()}
                                    </div>
                                  </td>
                                  <td className="px-6 py-4 font-medium">₱{order.totalAmount.toLocaleString()}</td>
                                  <td className="px-6 py-4">
                                    <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
                                      {getStatusText(order.status)}
                                    </span>
                                  </td>
                                  <td className="px-6 py-4 text-right">
                                    <div className="flex justify-end space-x-2">
                                      {order.status === 'pending' && (
                                        <button
                                          onClick={() => updateOrderStatus(order.id, 'confirmed', order.serviceTitle)}
                                          className="text-green-400 hover:text-green-300 p-1.5 rounded-full hover:bg-green-900/30"
                                          title="Confirm Order"
                                        >
                                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                                          </svg>
                                        </button>
                                      )}
                                      {order.status === 'confirmed' && (
                                        <>
                                          <button
                                            onClick={() => updateOrderStatus(order.id, 'preparing', order.serviceTitle)}
                                            className="text-purple-400 hover:text-purple-300 p-1.5 rounded-full hover:bg-purple-900/30"
                                            title="Mark as Preparing"
                                          >
                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4" />
                                            </svg>
                                          </button>
                                          <button
                                            onClick={() => updateOrderStatus(order.id, 'completed', order.serviceTitle)}
                                            className="text-green-400 hover:text-green-300 p-1.5 rounded-full hover:bg-green-900/30"
                                            title="Mark as Completed"
                                          >
                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                                            </svg>
                                          </button>
                                        </>
                                      )}
                                      {order.status === 'preparing' && (
                                        <button
                                          onClick={() => updateOrderStatus(order.id, 'out_for_delivery', order.serviceTitle)}
                                          className="text-orange-400 hover:text-orange-300 p-1.5 rounded-full hover:bg-orange-900/30"
                                          title="Mark as Out for Delivery"
                                        >
                                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                                          </svg>
                                        </button>
                                      )}
                                      {order.status === 'out_for_delivery' && (
                                        <>
                                          <button
                                            onClick={() => updateOrderStatus(order.id, 'completed', order.serviceTitle)}
                                            className="flex items-center gap-1 px-2 py-1 text-xs font-medium text-green-400 bg-green-900/30 hover:bg-green-800/50 rounded-md transition-colors"
                                            title="Mark as Service Completed"
                                          >
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                                            </svg>
                                            Service Completed
                                          </button>
                                        </>
                                      )}
                                      {(order.status === 'pending' || order.status === 'confirmed' || order.status === 'preparing') && (
                                        <button
                                          onClick={() => updateOrderStatus(order.id, 'cancelled', order.serviceTitle)}
                                          className="text-red-400 hover:text-red-300 p-1.5 rounded-full hover:bg-red-900/30"
                                          title="Cancel Order"
                                        >
                                          <FiX size={18} />
                                        </button>
                                      )}
                                    </div>
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      ) : (
                        <div className="p-8 text-center text-gray-400">
                          {orders.length === 0 ? 'No orders found.' : 'No orders match your filters.'}
                        </div>
                      )}
                    </>
                  )}
                </div>
              </div>

              {/* Stats Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-5 mt-8">
                <div className="bg-white/5 backdrop-blur-sm rounded-xl p-5 border border-gray-600/30 shadow-md hover:shadow-lg transition-shadow">
                  <div className="text-3xl font-bold text-white">
                    {orders.filter(o => o.status === 'pending').length}
                  </div>
                  <div className="text-sm text-gray-200 mt-1">Pending</div>
                </div>
                <div className="bg-white/5 backdrop-blur-sm rounded-xl p-5 border border-gray-600/30 shadow-md hover:shadow-lg transition-shadow">
                  <div className="text-3xl font-bold text-white">
                    {orders.filter(o => o.status === 'preparing').length}
                  </div>
                  <div className="text-sm text-gray-200 mt-1">Preparing</div>
                </div>
                <div className="bg-white/5 backdrop-blur-sm rounded-xl p-5 border border-gray-600/30 shadow-md hover:shadow-lg transition-shadow">
                  <div className="text-3xl font-bold text-white">
                    {orders.filter(o => o.status === 'out_for_delivery').length}
                  </div>
                  <div className="text-sm text-gray-200 mt-1">Out for Delivery</div>
                </div>
                <div className="bg-white/5 backdrop-blur-sm rounded-xl p-5 border border-gray-600/30 shadow-md hover:shadow-lg transition-shadow">
                  <div className="text-3xl font-bold text-white">
                    {orders.filter(o => o.status === 'completed').length}
                  </div>
                  <div className="text-sm text-gray-200 mt-1">Completed</div>
                </div>
                <div className="bg-white/5 backdrop-blur-sm rounded-xl p-5 border border-gray-600/30 shadow-md hover:shadow-lg transition-shadow">
                  <div className="text-3xl font-bold text-white">
                    {orders.filter(o => o.status === 'cancelled').length}
                  </div>
                  <div className="text-sm text-gray-200 mt-1">Cancelled</div>
                </div>
              </div>

              {/* Order History Section */}
{orders.filter(o => o.status === 'completed' || o.status === 'cancelled').length > 0 && (
  <div className="mt-8">
    <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4">
      <h2 className="text-xl font-bold text-white">
        Order History (Completed & Cancelled Orders)
      </h2>
      <button
        onClick={clearAllCompletedOrders}
        className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white text-sm rounded-lg font-medium transition-colors mt-2 md:mt-0"
      >
        Clear All Completed
      </button>
    </div>

    <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left text-gray-300">
          <thead className="text-xs text-gray-300 uppercase bg-gray-700/50">
            <tr>
              <th className="px-6 py-3">Order ID</th>
              <th className="px-6 py-3">Farmer</th>
              <th className="px-6 py-3">Products</th>
              <th className="px-6 py-3">Date</th>
              <th className="px-6 py-3">Amount</th>
              <th className="px-6 py-3">Status</th>
              <th className="px-6 py-3 text-right">Actions</th>
            </tr>
          </thead>

          <tbody>
            {orders
              .filter(o => o.status === 'completed' || o.status === 'cancelled')
              .sort((a, b) => new Date(b.orderDate).getTime() - new Date(a.orderDate).getTime())
              .map((order) => (
                <tr
                  key={order.id}
                  className="border-t border-gray-700/50 hover:bg-gray-700/30 transition-colors"
                >
                  <td className="px-6 py-4 font-medium">#{order.id}</td>
                  <td className="px-6 py-4">{order.farmerName}</td>
                  <td className="px-6 py-4">{order.serviceTitle}</td>
                  <td className="px-6 py-4">
                    {new Date(order.orderDate).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 font-medium">
                    ₱{order.totalAmount.toLocaleString()}
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      order.status === 'completed' 
                        ? 'bg-green-900/50 text-green-300' 
                        : 'bg-red-900/50 text-red-300'
                    }`}>
                      {order.status === 'completed' ? 'Completed' : 'Cancelled'}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button
                      onClick={() => removeCompletedOrder(order.id)}
                      className="text-red-400 hover:text-red-300 p-1.5 rounded-full hover:bg-red-900/30"
                      title="Remove Order"
                    >
                      <FiX size={16} />
                    </button>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>
    </div>
  </div>
)}

</main>
          </div>
        </div>
      </div>
    </div>
  );
}
