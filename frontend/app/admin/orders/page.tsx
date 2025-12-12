"use client";

import { useState, useEffect } from 'react';
import { FiPackage, FiUser, FiCalendar, FiMapPin, FiPhone, FiMail, FiEye, FiCheck, FiX } from 'react-icons/fi';
import DashboardSidebar from "../../components/DashboardSidebar";

interface Order {
  id: number;
  farmerName: string;
  farmerEmail: string;
  farmerPhone: string;
  farmerAddress: string;
  serviceTitle: string;
  companyName: string;
  orderDate: string;
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled';
  totalAmount: number;
  notes?: string;
}

export default function OrdersManagement() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState<string>('');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    // Load orders from localStorage (in a real app, this would be from an API)
    const savedOrders = localStorage.getItem('pestlink_orders');
    if (savedOrders) {
      setOrders(JSON.parse(savedOrders));
    }
    setLoading(false);
  }, []);

  const updateOrderStatus = (orderId: number, newStatus: Order['status']) => {
    const updatedOrders = orders.map(order =>
      order.id === orderId ? { ...order, status: newStatus } : order
    );
    setOrders(updatedOrders);
    localStorage.setItem('pestlink_orders', JSON.stringify(updatedOrders));
  };

  const filteredOrders = orders.filter(order => {
    const matchesStatus = !filterStatus || order.status === filterStatus;
    const matchesSearch = !searchTerm || 
      order.farmerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.serviceTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.companyName.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  const getStatusColor = (status: Order['status']) => {
    switch (status) {
      case 'pending': return 'bg-yellow-900/50 text-yellow-300';
      case 'confirmed': return 'bg-blue-900/50 text-blue-300';
      case 'completed': return 'bg-green-900/50 text-green-300';
      case 'cancelled': return 'bg-red-900/50 text-red-300';
      default: return 'bg-gray-900/50 text-gray-300';
    }
  };

  const getStatusText = (status: Order['status']) => {
    switch (status) {
      case 'pending': return 'Pending';
      case 'confirmed': return 'Confirmed';
      case 'completed': return 'Completed';
      case 'cancelled': return 'Cancelled';
      default: return 'Unknown';
    }
  };

  return (
    <div className="min-h-screen w-full bg-gray-900 text-white flex">
      <DashboardSidebar role="admin" />
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
                <h1 className="text-2xl font-bold">Orders Management</h1>
                <p className="text-gray-400">Manage farmer service orders</p>
              </div>
              <div className="mt-4 md:mt-0 text-sm text-gray-400">
                Total Orders: {orders.length}
              </div>
            </div>

            {/* Search and Filter */}
            <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-4 mb-6 border border-gray-700/50">
              <div className="flex flex-col sm:flex-row gap-3">
                <div className="relative flex-1">
                  <input
                    type="text"
                    className="bg-gray-700/50 border border-gray-600/50 text-white text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                    placeholder="Search by farmer name, service, or company..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
                
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="bg-gray-700/50 border border-gray-600/50 text-white text-sm rounded-lg p-2.5 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">All Statuses</option>
                  <option value="pending">Pending</option>
                  <option value="confirmed">Confirmed</option>
                  <option value="completed">Completed</option>
                  <option value="cancelled">Cancelled</option>
                </select>
              </div>
            </div>

            {/* Orders Table */}
            <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl overflow-hidden border border-gray-700/50">
              {loading ? (
                <div className="p-8 text-center text-gray-400">Loading orders...</div>
              ) : filteredOrders.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="w-full text-sm text-left text-gray-300">
                    <thead className="text-xs text-gray-300 uppercase bg-gray-700/50">
                      <tr>
                        <th scope="col" className="px-6 py-3">Order ID</th>
                        <th scope="col" className="px-6 py-3">Farmer</th>
                        <th scope="col" className="px-6 py-3">Service</th>
                        <th scope="col" className="px-6 py-3">Company</th>
                        <th scope="col" className="px-6 py-3">Date</th>
                        <th scope="col" className="px-6 py-3">Amount</th>
                        <th scope="col" className="px-6 py-3">Status</th>
                        <th scope="col" className="px-6 py-3 text-right">Actions</th>
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
                          </td>
                          <td className="px-6 py-4">{order.companyName}</td>
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
                                <>
                                  <button
                                    onClick={() => updateOrderStatus(order.id, 'confirmed')}
                                    className="text-green-400 hover:text-green-300 p-1.5 rounded-full hover:bg-green-900/30"
                                    title="Confirm Order"
                                  >
                                    <FiCheck size={18} />
                                  </button>
                                  <button
                                    onClick={() => updateOrderStatus(order.id, 'cancelled')}
                                    className="text-red-400 hover:text-red-300 p-1.5 rounded-full hover:bg-red-900/30"
                                    title="Cancel Order"
                                  >
                                    <FiX size={18} />
                                  </button>
                                </>
                              )}
                              {order.status === 'confirmed' && (
                                <button
                                  onClick={() => updateOrderStatus(order.id, 'completed')}
                                  className="text-blue-400 hover:text-blue-300 p-1.5 rounded-full hover:bg-blue-900/30"
                                  title="Mark as Completed"
                                >
                                  <FiPackage size={18} />
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
            </div>

            {/* Order Statistics */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-6">
              <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-4 border border-gray-700/50">
                <div className="text-2xl font-bold text-yellow-400">
                  {orders.filter(o => o.status === 'pending').length}
                </div>
                <div className="text-sm text-gray-400">Pending Orders</div>
              </div>
              <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-4 border border-gray-700/50">
                <div className="text-2xl font-bold text-blue-400">
                  {orders.filter(o => o.status === 'confirmed').length}
                </div>
                <div className="text-sm text-gray-400">Confirmed Orders</div>
              </div>
              <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-4 border border-gray-700/50">
                <div className="text-2xl font-bold text-green-400">
                  {orders.filter(o => o.status === 'completed').length}
                </div>
                <div className="text-sm text-gray-400">Completed Orders</div>
              </div>
              <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-4 border border-gray-700/50">
                <div className="text-2xl font-bold text-white">
                  ₱{orders.filter(o => o.status === 'completed').reduce((sum, o) => sum + o.totalAmount, 0).toLocaleString()}
                </div>
                <div className="text-sm text-gray-400">Total Revenue</div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}