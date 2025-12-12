"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { FiArrowLeft, FiCalendar, FiMapPin, FiPhone, FiMail, FiPackage, FiSearch } from 'react-icons/fi';
import DashboardSidebar from "../../components/DashboardSidebar";
import { useAuth } from '../../hooks/useAuth';

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
  totalAmount: number;
  notes?: string;
  serviceDate?: string;
}

export default function OrderHistoryPage() {
  const router = useRouter();
  const { user } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [filteredOrders, setFilteredOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('');

  useEffect(() => {
    if (!user) {
      router.push('/login');
      return;
    }
    
    // Load all user orders
    const savedOrders = JSON.parse(localStorage.getItem('pestlink_orders') || '[]');
    const userOrders = savedOrders.filter((order: Order) => 
      order.farmerEmail === user.email
    ).sort((a: Order, b: Order) => new Date(b.orderDate).getTime() - new Date(a.orderDate).getTime());
    
    setOrders(userOrders);
    setFilteredOrders(userOrders);
    setLoading(false);
  }, [user, router]);

  useEffect(() => {
    let filtered = orders;

    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter(order =>
        order.serviceTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.companyName.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Apply status filter
    if (statusFilter) {
      filtered = filtered.filter(order => order.status === statusFilter);
    }

    setFilteredOrders(filtered);
  }, [orders, searchTerm, statusFilter]);

  const getStatusColor = (status: Order['status']) => {
    switch (status) {
      case 'pending': return 'bg-yellow-900/50 text-yellow-300 border-yellow-500/30';
      case 'confirmed': return 'bg-blue-900/50 text-blue-300 border-blue-500/30';
      case 'preparing': return 'bg-purple-900/50 text-purple-300 border-purple-500/30';
      case 'out_for_delivery': return 'bg-orange-900/50 text-orange-300 border-orange-500/30';
      case 'completed': return 'bg-green-900/50 text-green-300 border-green-500/30';
      case 'cancelled': return 'bg-red-900/50 text-red-300 border-red-500/30';
      default: return 'bg-gray-900/50 text-gray-300 border-gray-500/30';
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

  if (loading) {
    return (
      <div className="min-h-screen w-full bg-gray-900 text-white flex">
        <DashboardSidebar />
        <div className="flex-1 relative ml-20 peer-hover:ml-64 transition-all duration-300 flex items-center justify-center">
          <div className="text-center">Loading...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full bg-gray-900 text-white flex">
      <DashboardSidebar />
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
            <div className="flex items-center gap-4 mb-6">
              <button
                onClick={() => router.push('/products')}
                className="flex items-center gap-2 text-gray-300 hover:text-white transition-colors"
              >
                <FiArrowLeft size={20} />
                Back to Products
              </button>
            </div>

            <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
              <div>
                <h1 className="text-2xl font-bold">Order History</h1>
                <p className="text-gray-400">View all your past and current orders</p>
              </div>
              <div className="mt-4 md:mt-0 text-sm text-gray-400">
                Total Orders: {orders.length}
              </div>
            </div>

            {/* Search and Filter */}
            <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-4 mb-6 border border-gray-700/50">
              <div className="flex flex-col sm:flex-row gap-3">
                <div className="relative flex-1">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FiSearch className="text-gray-400" />
                  </div>
                  <input
                    type="text"
                    className="bg-gray-700/50 border border-gray-600/50 text-white text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full pl-10 p-2.5"
                    placeholder="Search by service or company..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
                
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="bg-gray-700/50 border border-gray-600/50 text-white text-sm rounded-lg p-2.5 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">All Statuses</option>
                  <option value="pending">Pending</option>
                  <option value="confirmed">Confirmed</option>
                  <option value="preparing">Preparing</option>
                  <option value="out_for_delivery">Out for Delivery</option>
                  <option value="completed">Completed</option>
                  <option value="cancelled">Cancelled</option>
                </select>
              </div>
            </div>

            {filteredOrders.length > 0 ? (
              <div className="space-y-4">
                {filteredOrders.map((order) => (
                  <div
                    key={order.id}
                    className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700/50 hover:bg-gray-800/60 transition-colors"
                  >
                    <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-start justify-between mb-3">
                          <div>
                            <h3 className="text-lg font-bold text-white">{order.serviceTitle}</h3>
                            <p className="text-gray-300">{order.companyName}</p>
                            <p className="text-sm text-gray-400">Order #{order.id}</p>
                          </div>
                          <span className={`px-3 py-1 rounded-full text-sm font-medium border ${getStatusColor(order.status)}`}>
                            {getStatusText(order.status)}
                          </span>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                          <div className="flex items-center gap-2 text-gray-300">
                            <FiCalendar size={16} />
                            <span>{new Date(order.orderDate).toLocaleDateString()}</span>
                          </div>
                          <div className="flex items-center gap-2 text-gray-300">
                            <FiMapPin size={16} />
                            <span className="truncate">{order.farmerAddress}</span>
                          </div>
                          <div className="flex items-center gap-2 text-gray-300">
                            <FiPackage size={16} />
                            <span className="font-semibold">₱{order.totalAmount.toLocaleString()}</span>
                          </div>
                        </div>

                        {order.notes && (
                          <div className="mt-3 p-2 bg-gray-700/30 rounded text-sm">
                            <span className="text-gray-400">Notes: </span>
                            <span className="text-gray-300">{order.notes}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-12 text-center border border-gray-700/50">
                <FiPackage size={48} className="mx-auto text-gray-400 mb-4" />
                <h3 className="text-xl font-semibold text-white mb-2">
                  {orders.length === 0 ? 'No Orders Yet' : 'No Orders Found'}
                </h3>
                <p className="text-gray-400 mb-6">
                  {orders.length === 0 
                    ? "You haven't placed any orders yet."
                    : "No orders match your current filters."
                  }
                </p>
                {orders.length === 0 && (
                  <button
                    onClick={() => router.push('/products')}
                    className="px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-semibold transition-colors"
                  >
                    Browse Products
                  </button>
                )}
              </div>
            )}

            {/* Order Statistics */}
            {orders.length > 0 && (
              <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mt-8">
                <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-4 border border-gray-700/50 text-center">
                  <div className="text-2xl font-bold text-yellow-400">
                    {orders.filter(o => o.status === 'pending').length}
                  </div>
                  <div className="text-sm text-gray-400">Pending</div>
                </div>
                <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-4 border border-gray-700/50 text-center">
                  <div className="text-2xl font-bold text-purple-400">
                    {orders.filter(o => o.status === 'preparing').length}
                  </div>
                  <div className="text-sm text-gray-400">Preparing</div>
                </div>
                <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-4 border border-gray-700/50 text-center">
                  <div className="text-2xl font-bold text-orange-400">
                    {orders.filter(o => o.status === 'out_for_delivery').length}
                  </div>
                  <div className="text-sm text-gray-400">Out for Delivery</div>
                </div>
                <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-4 border border-gray-700/50 text-center">
                  <div className="text-2xl font-bold text-green-400">
                    {orders.filter(o => o.status === 'completed').length}
                  </div>
                  <div className="text-sm text-gray-400">Completed</div>
                </div>
                <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-4 border border-gray-700/50 text-center">
                  <div className="text-2xl font-bold text-white">
                    ₱{orders.filter(o => o.status === 'completed').reduce((sum, o) => sum + o.totalAmount, 0).toLocaleString()}
                  </div>
                  <div className="text-sm text-gray-400">Total Spent</div>
                </div>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}