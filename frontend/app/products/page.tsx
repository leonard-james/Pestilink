'use client';

import Image from 'next/image';
import DashboardSidebar from '../components/DashboardSidebar';
import Footer from '../components/Footer';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../hooks/useAuth';

interface Product {
  id: number;
  title: string;
  description: string;
  price: number | null;
  company_name: string;
  location: string;
  phone: string;
  email: string;
  image: string | null;
  pest_types?: string[];
}

interface OrderForm {
  farmerName: string;
  farmerEmail: string;
  farmerPhone: string;
  farmerAddress: string;
  serviceDate: string;
  quantity: number;
  notes: string;
}

export default function ProductsPage() {
  const router = useRouter();
  const { user } = useAuth();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterType, setFilterType] = useState('');
  const [filterLocation, setFilterLocation] = useState('');
  const [isOrderModalOpen, setIsOrderModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isOrderCompleteModalOpen, setIsOrderCompleteModalOpen] = useState(false);
  const [userOrders, setUserOrders] = useState<any[]>([]);
  const [orderForm, setOrderForm] = useState<OrderForm>({
    farmerName: '',
    farmerEmail: '',
    farmerPhone: '',
    farmerAddress: '',
    serviceDate: '',
    quantity: 1,
    notes: ''
  });

  useEffect(() => {
    fetchProducts();
    loadUserOrders();
  }, [user]);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'}/api/services`);
      if (response.ok) {
        const data = await response.json();
        setProducts(data);
      }
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadUserOrders = () => {
    if (user) {
      const savedOrders = JSON.parse(localStorage.getItem('pestlink_orders') || '[]');
      const userSpecificOrders = savedOrders.filter((order: any) => 
        order.farmerEmail === user.email
      );
      setUserOrders(userSpecificOrders);
    }
  };

  const removeUserOrder = (orderId: number) => {
    const savedOrders = JSON.parse(localStorage.getItem('pestlink_orders') || '[]');
    const updatedOrders = savedOrders.filter((order: any) => order.id !== orderId);
    localStorage.setItem('pestlink_orders', JSON.stringify(updatedOrders));
    loadUserOrders();
  };

  const clearCompletedUserOrders = () => {
    if (confirm('Are you sure you want to clear all completed orders? This action cannot be undone.')) {
      const savedOrders = JSON.parse(localStorage.getItem('pestlink_orders') || '[]');
      const updatedOrders = savedOrders.filter((order: any) => 
        !(order.farmerEmail === user?.email && order.status === 'completed')
      );
      localStorage.setItem('pestlink_orders', JSON.stringify(updatedOrders));
      loadUserOrders();
    }
  };

  const filteredProducts = products.filter((product) => {
    const matchesType = !filterType || product.title.toLowerCase().includes(filterType.toLowerCase());
    const matchesLocation = !filterLocation || product.location.toLowerCase().includes(filterLocation.toLowerCase());
    return matchesType && matchesLocation;
  });

  const handleAvailNow = (product: Product) => {
    if (!user) {
      router.push('/login');
      return;
    }
    
    setSelectedProduct(product);
    setOrderForm({
      farmerName: user.name || '',
      farmerEmail: user.email || '',
      farmerPhone: '',
      farmerAddress: '',
      serviceDate: '',
      quantity: 1,
      notes: ''
    });
    setIsOrderModalOpen(true);
  };

  const handleOrderSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedProduct) return;

    // Create order object
    const order = {
      id: Date.now(), // Simple ID generation
      farmerName: orderForm.farmerName,
      farmerEmail: orderForm.farmerEmail,
      farmerPhone: orderForm.farmerPhone,
      farmerAddress: orderForm.farmerAddress,
      serviceTitle: selectedProduct.title,
      companyName: selectedProduct.company_name,
      orderDate: new Date().toISOString(),
      status: 'pending' as const,
      quantity: orderForm.quantity,
      totalAmount: (selectedProduct.price || 0) * orderForm.quantity,
      notes: orderForm.notes,
      serviceDate: orderForm.serviceDate
    };

    // Save to localStorage (in a real app, this would be sent to an API)
    const existingOrders = JSON.parse(localStorage.getItem('pestlink_orders') || '[]');
    existingOrders.push(order);
    localStorage.setItem('pestlink_orders', JSON.stringify(existingOrders));

    // Update user orders
    loadUserOrders();

    // Close order modal and show success modal
    setIsOrderModalOpen(false);
    setIsOrderCompleteModalOpen(true);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setOrderForm(prev => ({
      ...prev,
      [name]: name === 'quantity' ? parseInt(value) || 1 : value
    }));
  };



  return (
    <div className="min-h-screen w-full bg-black text-white flex flex-col relative">
      <DashboardSidebar />

      <Image
        src="/farm pic.jpg"
        alt="Farm background"
        fill
        className="object-cover pointer-events-none"
        priority
      />

      <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/40 to-transparent pointer-events-none z-0"></div>

      <main className="relative z-10 flex-1 ml-20 peer-hover:ml-64 transition-all duration-300 container mx-auto px-4 pt-8 pb-24 min-h-[calc(100vh-200px)]">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold mb-4">Available Products</h1>
            <p className="text-white/80 max-w-2xl mx-auto">
              Browse products from professional pest control companies in your area.
            </p>
          </div>



          {/* Filters */}
          <div className="flex flex-wrap gap-4 justify-center mb-8">
            <input
              type="text"
              placeholder="Search by product type..."
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="px-4 py-2 rounded-lg bg-white/10 backdrop-blur-sm text-white placeholder:text-white/60 border border-white/20"
            />
            <input
              type="text"
              placeholder="Filter by location..."
              value={filterLocation}
              onChange={(e) => setFilterLocation(e.target.value)}
              className="px-4 py-2 rounded-lg bg-white/10 backdrop-blur-sm text-white placeholder:text-white/60 border border-white/20"
            />
          </div>

          {/* Products Grid */}
          {loading ? (
            <div className="text-center text-white/80">Loading products...</div>
          ) : filteredProducts.length > 0 ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredProducts.map((product) => (
                <div
                  key={product.id}
                  className="bg-emerald-800/30 backdrop-blur-sm rounded-2xl p-6 text-white hover:bg-emerald-800/40 transition"
                >
                  {product.image && (
                    <div className="w-full h-48 rounded-lg overflow-hidden mb-4">
                      <img
                        src={product.image}
                        alt={product.title}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}
                  <h3 className="text-lg font-bold mb-2">{product.title}</h3>
                  <p className="text-sm text-white/80 mb-4 line-clamp-2">{product.description}</p>
                  
                  <div className="space-y-2 mb-4 text-sm">
                    <div className="flex items-start gap-2">
                      <span className="opacity-90">{product.company_name}</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <span className="opacity-90">{product.location}</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <span className="opacity-90">{product.phone}</span>
                    </div>
                    {product.price && (
                      <div className="flex items-start gap-2">
                        <span className="opacity-90 font-semibold">₱{product.price.toLocaleString()}</span>
                      </div>
                    )}
                    {product.pest_types && product.pest_types.length > 0 && (
                      <div className="flex flex-wrap gap-2 mt-2">
                        {product.pest_types.slice(0, 4).map((pest) => (
                          <span
                            key={pest}
                            className="text-xs bg-emerald-900/40 text-emerald-200 px-2 py-1 rounded-full border border-emerald-500/30"
                          >
                            {pest}
                          </span>
                        ))}
                        {product.pest_types.length > 4 && (
                          <span className="text-xs text-white/60">+{product.pest_types.length - 4} more</span>
                        )}
                      </div>
                    )}
                  </div>

                  <button
                    onClick={() => handleAvailNow(product)}
                    className="w-full bg-emerald-600 hover:bg-emerald-700 text-white py-2.5 rounded-lg text-center font-semibold text-sm transition-all duration-200 shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
                  >
                    AVAIL NOW
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center text-white/80">
              {products.length === 0 ? 'No products available yet.' : 'No products match your filters.'}
            </div>
          )}

          {/* Order History Section */}
          {user && userOrders.length > 0 && (
            <div className="mt-12">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold">Order History</h2>
                <button
                  onClick={clearCompletedUserOrders}
                  className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white text-sm rounded-lg font-medium transition-colors"
                >
                  Clear Completed Orders
                </button>
              </div>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {userOrders.map((order) => (
                  <div
                    key={order.id}
                    className="bg-emerald-800/30 backdrop-blur-sm rounded-2xl p-6 text-white border border-white/10"
                  >
                    <div className="flex justify-between items-start mb-3">
                      <div className="flex-1">
                        <h3 className="text-lg font-bold mb-1">{order.serviceTitle}</h3>
                        <p className="text-sm text-white/80">{order.companyName}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-semibold ${
                            order.status === 'completed'
                              ? 'bg-green-900/50 text-green-300'
                              : order.status === 'cancelled'
                              ? 'bg-red-900/50 text-red-300'
                              : order.status === 'confirmed'
                              ? 'bg-blue-900/50 text-blue-300'
                              : order.status === 'preparing'
                              ? 'bg-purple-900/50 text-purple-300'
                              : order.status === 'out_for_delivery'
                              ? 'bg-orange-900/50 text-orange-300'
                              : 'bg-yellow-900/50 text-yellow-300'
                          }`}
                        >
                          {order.status === 'confirmed' ? 'Confirmed' :
                           order.status === 'preparing' ? 'Preparing' :
                           order.status === 'out_for_delivery' ? 'Out for Delivery' :
                           order.status === 'completed' ? 'Completed' :
                           order.status === 'cancelled' ? 'Cancelled' : 'Pending'}
                        </span>
                        {(order.status === 'completed' || order.status === 'cancelled') && (
                          <button
                            onClick={() => removeUserOrder(order.id)}
                            className="text-red-400 hover:text-red-300 p-1 rounded-full hover:bg-red-900/30"
                            title="Remove Order"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                            </svg>
                          </button>
                        )}
                      </div>
                    </div>
                    
                    <div className="space-y-2 text-sm">
                      {order.quantity && (
                        <div className="flex justify-between">
                          <span className="text-white/70">Quantity:</span>
                          <span>{order.quantity}</span>
                        </div>
                      )}
                      <div className="flex justify-between">
                        <span className="text-white/70">Total Amount:</span>
                        <span className="font-semibold">₱{order.totalAmount.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-white/70">Order Date:</span>
                        <span>{new Date(order.orderDate).toLocaleDateString()}</span>
                      </div>
                      {order.serviceDate && (
                        <div className="flex justify-between">
                          <span className="text-white/70">Service Date:</span>
                          <span>{new Date(order.serviceDate).toLocaleDateString()}</span>
                        </div>
                      )}
                      {order.notes && (
                        <div className="mt-3 pt-3 border-t border-white/20">
                          <p className="text-white/70 text-xs mb-1">Notes:</p>
                          <p className="text-sm">{order.notes}</p>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </main>

      <div className="relative z-10 mt-auto pt-8">
        <Footer />
      </div>

      {/* Order Modal */}
      {isOrderModalOpen && selectedProduct && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
          <div className="bg-gray-800 rounded-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <h2 className="text-xl font-bold mb-4">Order Product</h2>
              <div className="mb-4 p-3 bg-gray-700/50 rounded-lg">
                <h3 className="font-semibold text-emerald-400">{selectedProduct.title}</h3>
                <p className="text-sm text-gray-300">{selectedProduct.company_name}</p>
                {selectedProduct.price && (
                  <div className="text-sm">
                    <p>Unit Price: ₱{selectedProduct.price.toLocaleString()}</p>
                    <p className="font-semibold text-emerald-400">
                      Total: ₱{((selectedProduct.price || 0) * orderForm.quantity).toLocaleString()}
                    </p>
                  </div>
                )}
              </div>
              
              <form onSubmit={handleOrderSubmit}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">
                      Full Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="farmerName"
                      value={orderForm.farmerName}
                      onChange={handleInputChange}
                      className="w-full bg-gray-700/50 border border-gray-600/50 text-white text-sm rounded-lg p-2.5 focus:ring-emerald-500 focus:border-emerald-500"
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">
                      Email <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="email"
                      name="farmerEmail"
                      value={orderForm.farmerEmail}
                      onChange={handleInputChange}
                      className="w-full bg-gray-700/50 border border-gray-600/50 text-white text-sm rounded-lg p-2.5 focus:ring-emerald-500 focus:border-emerald-500"
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">
                      Phone Number <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="tel"
                      name="farmerPhone"
                      value={orderForm.farmerPhone}
                      onChange={handleInputChange}
                      className="w-full bg-gray-700/50 border border-gray-600/50 text-white text-sm rounded-lg p-2.5 focus:ring-emerald-500 focus:border-emerald-500"
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">
                      Quantity <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="number"
                      name="quantity"
                      value={orderForm.quantity}
                      onChange={handleInputChange}
                      min="1"
                      className="w-full bg-gray-700/50 border border-gray-600/50 text-white text-sm rounded-lg p-2.5 focus:ring-emerald-500 focus:border-emerald-500"
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">
                      Preferred Service Date <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="date"
                      name="serviceDate"
                      value={orderForm.serviceDate}
                      onChange={handleInputChange}
                      min={new Date().toISOString().split('T')[0]}
                      className="w-full bg-gray-700/50 border border-gray-600/50 text-white text-sm rounded-lg p-2.5 focus:ring-emerald-500 focus:border-emerald-500"
                      required
                    />
                  </div>
                </div>

                <div className="mt-4">
                  <label className="block text-sm font-medium text-gray-300 mb-1">
                    Address <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="farmerAddress"
                    value={orderForm.farmerAddress}
                    onChange={handleInputChange}
                    className="w-full bg-gray-700/50 border border-gray-600/50 text-white text-sm rounded-lg p-2.5 focus:ring-emerald-500 focus:border-emerald-500"
                    required
                  />
                </div>
                
                <div className="mt-4">
                  <label className="block text-sm font-medium text-gray-300 mb-1">
                    Additional Notes
                  </label>
                  <textarea
                    name="notes"
                    value={orderForm.notes}
                    onChange={handleInputChange}
                    rows={3}
                    className="w-full bg-gray-700/50 border border-gray-600/50 text-white text-sm rounded-lg p-2.5 focus:ring-emerald-500 focus:border-emerald-500"
                    placeholder="Any specific requirements or notes..."
                  />
                </div>
                
                <div className="mt-6 flex justify-end space-x-3">
                  <button
                    type="button"
                    onClick={() => {
                      setIsOrderModalOpen(false);
                      setSelectedProduct(null);
                    }}
                    className="px-4 py-2 text-sm font-medium text-gray-300 bg-gray-700/50 hover:bg-gray-600/50 rounded-lg transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 text-sm font-medium text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg transition-colors"
                  >
                    Confirm Order
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Order Complete Modal */}
      {isOrderCompleteModalOpen && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
          <div className="bg-gray-800 rounded-xl w-full max-w-sm">
            <div className="p-6 text-center">
              <div className="w-16 h-16 bg-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                </svg>
              </div>
              <h3 className="text-lg font-bold text-white mb-2">Order Complete!</h3>
              <p className="text-gray-300 text-sm mb-4">
                Your product order has been submitted successfully. The company will contact you soon to confirm the details.
              </p>
              <button
                onClick={() => setIsOrderCompleteModalOpen(false)}
                className="w-full bg-emerald-600 hover:bg-emerald-700 text-white py-2 rounded-lg font-medium transition-colors"
              >
                OK
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}