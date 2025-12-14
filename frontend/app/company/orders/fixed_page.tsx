"use client";

import { useState, useEffect } from 'react';
import { FiPackage, FiCalendar, FiPhone, FiMail, FiX } from 'react-icons/fi';
import DashboardSidebar from "../../components/DashboardSidebar";
import PageHeader from "../../components/PageHeader";
import { useNotifications } from '@/contexts/NotificationContext';

interface Order {
  id: number;
  farmerName: string;
  farmerEmail: string;
  farmerPhone: string;
  farmerAddress: string;
  serviceTitle: string;
  companyName: string;
  orderDate: string;
  status: 'pending' | 'confirmed' | 'preparing' | 'out_for_delivery' | 'completed' | 'cancelled';
  quantity?: number;
  totalAmount: number;
  notes?: string;
}

export default function CompanyOrdersManagement() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState<string>('');
  const [searchTerm, setSearchTerm] = useState('');
  const { addNotification } = useNotifications();

  useEffect(() => {
    // Load orders from localStorage (in a real app, this would be from an API)
    const savedOrders = localStorage.getItem('pestlink_orders');
    if (savedOrders) {
      setOrders(JSON.parse(savedOrders));
    }
    setLoading(false);
  }, []);

  const updateOrderStatus = (orderId: number, newStatus: Order['status']) => {
    const updatedOrders = orders.map(order => {
      if (order.id === orderId) {
        // Add notification when status changes
        if (order.status !== newStatus) {
          const statusText = {
            'pending': 'pending',
            'confirmed': 'confirmed',
            'preparing': 'being prepared',
            'out_for_delivery': 'out for delivery',
            'completed': 'completed',
            'cancelled': 'cancelled'
          }[newStatus];
          
          addNotification({
            type: 'info',
            message: `Your booking for "${order.serviceTitle}" has been ${statusText}.`,
            link: '/dashboard/farmer/orders'
          });
        }
        
        return { ...order, status: newStatus };
      }
      return order;
    });
    
    setOrders(updatedOrders);
    localStorage.setItem('pestlink_orders', JSON.stringify(updatedOrders));
    
    // Update the notification count in the sidebar
    const pendingCount = updatedOrders.filter(order => order.status === 'pending').length;
    localStorage.setItem('pending_bookings_count', pendingCount.toString());
    
    // Dispatch an event to notify the sidebar about the update
    window.dispatchEvent(new Event('bookings_updated'));
  };

  const removeCompletedOrder = (orderId: number) => {
    const updatedOrders = orders.filter(order => order.id !== orderId);
    setOrders(updatedOrders);
    localStorage.setItem('pestlink_orders', JSON.stringify(updatedOrders));
    
    // Update the notification count in the sidebar
    const pendingCount = updatedOrders.filter(order => order.status === 'pending').length;
    localStorage.setItem('pending_bookings_count', pendingCount.toString());
    
    // Dispatch an event to notify the sidebar about the update
    window.dispatchEvent(new Event('bookings_updated'));
  };

  const clearAllCompletedOrders = () => {
    if (confirm('Are you sure you want to clear all completed orders? This action cannot be undone.')) {
      const updatedOrders = orders.filter(order => order.status !== 'completed');
      setOrders(updatedOrders);
      localStorage.setItem('pestlink_orders', JSON.stringify(updatedOrders));
    }
  };

  const filteredOrders = orders.filter(order => {
    // Automatically hide completed orders from main view
    const isNotCompleted = order.status !== 'completed';
    const matchesStatus = !filterStatus || order.status === filterStatus;
    const matchesSearch = !searchTerm || 
      order.farmerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.serviceTitle.toLowerCase().includes(searchTerm.toLowerCase());
    return isNotCompleted && matchesStatus && matchesSearch;
  });

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

  const getStatusText = (status: Order['status']) => {
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
    <div className="flex h-screen bg-gray-50">
      <DashboardSidebar role="company" />
      <div className="flex-1 overflow-auto">
        <div className="p-6 max-w-7xl mx-auto">
          <PageHeader />
          <main className="relative z-10">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
                <div>
                  <h1 className="text-2xl font-bold">Orders Management</h1>
                  <p className="text-gray-400">Manage your service orders from farmers</p>
                </div>
                <div className="mt-4 md:mt-0 text-sm text-gray-400">
                  Total Orders: {orders.length}
                </div>
              </div>

              {/* Rest of your existing JSX */}
              
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}
