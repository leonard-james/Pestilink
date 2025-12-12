"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { FiArrowLeft, FiCalendar, FiMapPin, FiPhone, FiMail, FiPackage } from 'react-icons/fi';
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

export default function ViewOrderPage() {
  const router = useRouter();
  const { user } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      router.push('/login');
      return;
    }
    
    // Load user's pending/confirmed orders
    const savedOrders = JSON.parse(localStorage.getItem('pestlink_orders') || '[]');
    const userOrders = savedOrders.filter((order: Order) => 
      order.farmerEmail === user.email && 
      (order.status === 'pending' || order.status === 'confirmed' || order.status === 'preparing' || order.status === 'out_for_delivery')
    );
    setOrders(userOrders);
    setLoading(false);
  }, [user, router]);

  const getStatusColor = (status: Order['status']) => {
    switch (status) {
      case 'pending': return 'bg-yellow-900/50 text-yellow-300 border-yellow-500/30';
      case 'confirmed': return 'bg-blue-900/50 text-blue-300 border-blue-500/30';
      case 'preparing': return 'bg-purple-900/50 text-purple-300 border-purple-500/30';
      case 'out_for_delivery': return 'bg-orange-900/50 text-orange-300 border-orange-500/30';
      default: return 'bg-gray-900/50 text-gray-300 border-gray-500/30';
    }
  };

  const getStatusText = (status: Order['status']) => {
    switch (status) {
      case 'pending': return 'Pending Confirmation';
      case 'confirmed': return 'Confirmed';
      case 'preparing': return 'Preparing to Ship';
      case 'out_for_delivery': return 'Out for Delivery';
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
                <h1 className="text-2xl font-bold">Current Orders</h1>
                <p className="text-gray-400">View your pending and confirmed orders</p>
              </div>
              <div className="mt-4 md:mt-0 text-sm text-gray-400">
                Active Orders: {orders.length}
              </div>
            </div>

            {orders.length > 0 ? (
              <div className="space-y-6">
                {orders.map((order) => (
                  <div
                    key={order.id}
                    className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700/50"
                  >
                    <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6">
                      <div className="flex-1">
                        <div className="flex items-start justify-between mb-4">
                          <div>
                            <h3 className="text-xl font-bold text-white">{order.serviceTitle}</h3>
                            <p className="text-gray-300">{order.companyName}</p>
                            <p className="text-sm text-gray-400">Order #{order.id}</p>
                          </div>
                          <span className={`px-3 py-1 rounded-full text-sm font-medium border ${getStatusColor(order.status)}`}>
                            {getStatusText(order.status)}
                          </span>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                          <div className="space-y-2">
                            <div className="flex items-center gap-2 text-sm text-gray-300">
                              <FiCalendar size={16} />
                              <span>Order Date: {new Date(order.orderDate).toLocaleDateString()}</span>
                            </div>
                            {order.serviceDate && (
                              <div className="flex items-center gap-2 text-sm text-gray-300">
                                <FiCalendar size={16} />
                                <span>Service Date: {new Date(order.serviceDate).toLocaleDateString()}</span>
                              </div>
                            )}
                            <div className="flex items-center gap-2 text-sm text-gray-300">
                              <FiMapPin size={16} />
                              <span>{order.farmerAddress}</span>
                            </div>
                          </div>
                          <div className="space-y-2">
                            <div className="flex items-center gap-2 text-sm text-gray-300">
                              <FiPhone size={16} />
                              <span>{order.farmerPhone}</span>
                            </div>
                            <div className="flex items-center gap-2 text-sm text-gray-300">
                              <FiMail size={16} />
                              <span>{order.farmerEmail}</span>
                            </div>
                            <div className="flex items-center gap-2 text-sm text-gray-300">
                              <FiPackage size={16} />
                              <span className="font-semibold">₱{order.totalAmount.toLocaleString()}</span>
                            </div>
                          </div>
                        </div>

                        {order.notes && (
                          <div className="mt-4 p-3 bg-gray-700/30 rounded-lg">
                            <h4 className="text-sm font-medium text-gray-300 mb-1">Notes:</h4>
                            <p className="text-sm text-gray-400">{order.notes}</p>
                          </div>
                        )}
                      </div>
                    </div>

                    {order.status === 'pending' && (
                      <div className="mt-4 p-3 bg-yellow-900/20 border border-yellow-500/30 rounded-lg">
                        <p className="text-sm text-yellow-300">
                          <strong>Waiting for confirmation:</strong> The company will contact you soon to confirm your order details.
                        </p>
                      </div>
                    )}

                    {order.status === 'confirmed' && (
                      <div className="mt-4 p-3 bg-blue-900/20 border border-blue-500/30 rounded-lg">
                        <p className="text-sm text-blue-300">
                          <strong>Order confirmed:</strong> The company has confirmed your order and will provide the service as scheduled.
                        </p>
                      </div>
                    )}

                    {order.status === 'preparing' && (
                      <div className="mt-4 p-3 bg-purple-900/20 border border-purple-500/30 rounded-lg">
                        <p className="text-sm text-purple-300">
                          <strong>Preparing to ship:</strong> Your order is being prepared for delivery.
                        </p>
                      </div>
                    )}

                    {order.status === 'out_for_delivery' && (
                      <div className="mt-4 p-3 bg-orange-900/20 border border-orange-500/30 rounded-lg">
                        <p className="text-sm text-orange-300">
                          <strong>Out for delivery:</strong> Your order is on its way! You should receive it soon.
                        </p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-12 text-center border border-gray-700/50">
                <FiPackage size={48} className="mx-auto text-gray-400 mb-4" />
                <h3 className="text-xl font-semibold text-white mb-2">No Active Orders</h3>
                <p className="text-gray-400 mb-6">
                  You don't have any pending or confirmed orders at the moment.
                </p>
                <button
                  onClick={() => router.push('/products')}
                  className="px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-semibold transition-colors"
                >
                  Browse Products
                </button>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}