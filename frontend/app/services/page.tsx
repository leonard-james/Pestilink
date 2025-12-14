'use client';

import Image from 'next/image';
import Link from 'next/link';
import DashboardSidebar from '../components/DashboardSidebar';
import Footer from '../components/Footer';
import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';

interface Service {
  id: number;
  title: string;
  description: string;
  price: number | null;
  company_name: string;
  location: string;
  phone: string;
  email: string;
  image: string | null;
  service_type?: 'service' | 'product';
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

// Function to convert pest name to URL-friendly slug
const slugify = (text: string) => {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, '') // Remove special characters
    .replace(/\s+/g, '-') // Replace spaces with hyphens
    .replace(/--+/g, '-') // Replace multiple hyphens with single hyphen
    .trim();
};

export default function ServicesPage() {
  const router = useRouter();
  const { user } = useAuth();
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterType, setFilterType] = useState('');
  const [filterLocation, setFilterLocation] = useState('');
  const [isOrderModalOpen, setIsOrderModalOpen] = useState(false);
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const [isOrderCompleteModalOpen, setIsOrderCompleteModalOpen] = useState(false);
  const [orderForm, setOrderForm] = useState<OrderForm>({
    farmerName: user?.name || '',
    farmerEmail: user?.email || '',
    farmerPhone: '',
    farmerAddress: '',
    serviceDate: '',
    quantity: 1,
    notes: ''
  });

  useEffect(() => {
    fetchServices();
  }, []);

  const fetchServices = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'}/api/services`);
      if (response.ok) {
        const data = await response.json();
        setServices(data);
      }
    } catch (error) {
      console.error('Error fetching services:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredServices = services.filter((service) => {
    const matchesType = !filterType || service.title.toLowerCase().includes(filterType.toLowerCase());
    const matchesLocation = !filterLocation || service.location.toLowerCase().includes(filterLocation.toLowerCase());
    return matchesType && matchesLocation;
  });

  const handleAvailNow = (service: Service) => {
    if (!user) {
      router.push('/login');
      return;
    }
    
    setSelectedService(service);
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
    
    if (!selectedService) return;

    // Create order object
    const isProduct = selectedService.service_type === 'product';
    const quantity = isProduct ? orderForm.quantity : 1;
    const basePrice = selectedService.price || 0;
    const totalAmount = isProduct ? basePrice * quantity : basePrice;
    
    const order = {
      id: Date.now(), // Simple ID generation
      farmerName: orderForm.farmerName,
      farmerEmail: orderForm.farmerEmail,
      farmerPhone: orderForm.farmerPhone,
      farmerAddress: orderForm.farmerAddress,
      serviceTitle: selectedService.title,
      companyName: selectedService.company_name,
      orderDate: new Date().toISOString(),
      status: 'pending' as const,
      quantity: isProduct ? quantity : undefined,
      totalAmount: totalAmount,
      notes: orderForm.notes,
      serviceDate: orderForm.serviceDate
    };

    // Save to localStorage (in a real app, this would be sent to an API)
    const existingOrders = JSON.parse(localStorage.getItem('pestlink_orders') || '[]');
    existingOrders.push(order);
    localStorage.setItem('pestlink_orders', JSON.stringify(existingOrders));

    // Close order modal and show success modal
    setIsOrderModalOpen(false);
    setIsOrderCompleteModalOpen(true);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target as HTMLInputElement;
    setOrderForm(prev => ({
      ...prev,
      [name]: type === 'number' ? parseInt(value) || 1 : value
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
            <h1 className="text-4xl font-bold mb-4">Pest Control Services</h1>
            <p className="text-white/80 max-w-2xl mx-auto">
              Browse and connect with professional pest control companies in your area.
            </p>
          </div>

          {/* Filters */}
          <div className="flex flex-wrap gap-4 justify-center mb-8">
            <input
              type="text"
              placeholder="Search by service type..."
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

          {/* Services Grid */}
          {loading ? (
            <div className="text-center text-white/80">Loading services...</div>
          ) : filteredServices.length > 0 ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredServices.map((service) => (
                <div 
                  key={service.id} 
                  className="bg-green-900/20 backdrop-blur-sm rounded-xl border border-emerald-800/30 overflow-hidden hover:shadow-xl hover:shadow-emerald-900/10 transition-all duration-300 hover:-translate-y-1 flex flex-col h-full"
                >
                  <div className="w-full h-48 bg-gray-800/50 overflow-hidden">
                    {service.image ? (
                      <img
                        src={service.image}
                        alt={service.title}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-gray-800/30">
                        <svg className="w-12 h-12 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                      </div>
                    )}
                  </div>
                  <div className="p-5 space-y-3 text-sm flex-1 flex flex-col">
                    <h3 className="text-xl font-bold text-amber-50 mb-2">{service.title}</h3>
                    <div className="flex-1">
                      <p className="text-amber-50/80 mb-4 leading-relaxed line-clamp-3 min-h-[4.5rem]">
                        {service.description || 'No description available'}
                      </p>
                    </div>
                    <div className="flex items-start gap-2">
                      <svg className="w-4 h-4 text-amber-400/80 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                      </svg>
                      <span className="text-amber-50/90">{service.company_name}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <svg className="w-4 h-4 text-amber-400/80" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                      <span className="text-amber-50/90">{service.location}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <svg className="w-4 h-4 text-amber-400/80" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                      </svg>
                      <span className="text-amber-50/90">{service.phone}</span>
                    </div>
                    {service.pest_types && service.pest_types.length > 0 && (
                      <div className="flex flex-wrap gap-2 mt-2">
                        {service.pest_types.slice(0, 4).map((pest) => (
                          <Link
                            key={pest}
                            href={`/pest-services/pests/${slugify(pest)}`}
                            className="text-xs bg-emerald-700/50 hover:bg-emerald-600/60 text-emerald-100 px-3 py-1 rounded-full border border-emerald-600/40 transition-all duration-200 hover:border-emerald-500/60"
                            onClick={(e) => {
                              e.stopPropagation();
                            }}
                          >
                            {pest}
                          </Link>
                        ))}
                        {service.pest_types.length > 4 && (
                          <span className="text-xs text-white/60">+{service.pest_types.length - 4} more</span>
                        )}
                      </div>
                    )}
                  </div>

                  <div className="mt-auto pt-4 border-t border-emerald-800/40 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <svg className="w-5 h-5 text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <span className="text-lg font-bold text-amber-300">
                        {service.price ? `₱${service.price.toLocaleString()}` : 'Price on request'}
                      </span>
                    </div>
                    <button
                      onClick={() => handleAvailNow(service)}
                      className="px-5 py-2 bg-emerald-700 hover:bg-emerald-600 text-amber-50 font-semibold rounded-lg text-sm transition-all duration-200 hover:shadow-md hover:scale-[1.02] border border-emerald-600/50"
                    >
                      Avail Now
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center text-white/80">
              {services.length === 0 ? 'No services available yet.' : 'No services match your filters.'}
            </div>
          )}
        </div>
      </main>

      <div className="relative z-10 mt-auto pt-8">
        <Footer />
      </div>

      {/* Order Modal */}
      {isOrderModalOpen && selectedService && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-gray-900/95 backdrop-blur-md rounded-xl border border-emerald-800/30 shadow-2xl shadow-emerald-900/20 w-full max-w-md max-h-[90vh] flex flex-col">
            <div className="p-6 border-b border-emerald-900/50">
              <h2 className="text-2xl font-bold text-amber-50">Service Request</h2>
              <p className="text-sm text-emerald-300 mt-1">Complete the form to request this service</p>
            </div>
            
            <div className="p-6 border-b border-emerald-900/50 bg-emerald-900/10">
              <div className="flex items-start gap-4">
                {selectedService.image && (
                  <div className="w-16 h-16 rounded-lg overflow-hidden flex-shrink-0 border border-emerald-800/50">
                    <img
                      src={selectedService.image}
                      alt={selectedService.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}
                <div className="flex-1">
                  <h3 className="font-semibold text-amber-50">{selectedService.title}</h3>
                  <p className="text-sm text-emerald-300">{selectedService.company_name}</p>
                  {selectedService.price && (
                    <div className="mt-1 flex items-center">
                      <svg className="w-4 h-4 text-amber-400 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <span className="font-bold text-amber-300">₱{selectedService.price.toLocaleString()}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
            
            <form onSubmit={handleOrderSubmit} className="flex-1 flex flex-col overflow-hidden">
              <div className="flex-1 overflow-y-auto p-6 space-y-5">
                <div>
                  <label className="block text-sm font-medium text-amber-100 mb-1.5">
                    Full Name <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="text"
                    name="farmerName"
                    value={orderForm.farmerName}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2.5 bg-gray-800/60 border border-emerald-800/40 rounded-lg focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500/50 text-amber-50 placeholder-gray-400 transition-all duration-200"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-amber-100 mb-1.5">
                    Email <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="email"
                    name="farmerEmail"
                    value={orderForm.farmerEmail}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2.5 bg-gray-800/60 border border-emerald-800/40 rounded-lg focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500/50 text-amber-50 placeholder-gray-400 transition-all duration-200"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-amber-100 mb-1.5">
                    Phone Number <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="tel"
                    name="farmerPhone"
                    value={orderForm.farmerPhone}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2.5 bg-gray-800/60 border border-emerald-800/40 rounded-lg focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500/50 text-amber-50 placeholder-gray-400 transition-all duration-200"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-amber-100 mb-1.5">
                    Address <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="text"
                    name="farmerAddress"
                    value={orderForm.farmerAddress}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2.5 bg-gray-800/60 border border-emerald-800/40 rounded-lg focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500/50 text-amber-50 placeholder-gray-400 transition-all duration-200"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-amber-100 mb-1.5">
                    Preferred Service Date <span className="text-red-400">*</span>
                  </label>
                  <div className="relative">
                    <input
                      type="date"
                      name="serviceDate"
                      value={orderForm.serviceDate}
                      onChange={handleInputChange}
                      min={new Date().toISOString().split('T')[0]}
                      className="w-full px-4 py-2.5 bg-gray-800/60 border border-emerald-800/40 rounded-lg focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500/50 text-amber-50 placeholder-gray-400 pr-10 appearance-none"
                      required
                    />
                    <div className="absolute right-3 top-1/2 -translate-y-1/2 text-emerald-400 pointer-events-none">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                    </div>
                  </div>
                </div>

                {selectedService.service_type === 'product' && (
                  <div>
                    <label className="block text-sm font-medium text-amber-100 mb-1.5">
                      Quantity <span className="text-red-400">*</span>
                    </label>
                    <div className="relative">
                      <input
                        type="number"
                        name="quantity"
                        min="1"
                        value={orderForm.quantity}
                        onChange={handleInputChange}
                        className="w-full px-4 py-2.5 bg-gray-800/60 border border-emerald-800/40 rounded-lg focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500/50 text-amber-50 placeholder-gray-400 transition-all duration-200 pr-10"
                        required
                      />
                      <div className="absolute right-3 top-1/2 -translate-y-1/2 text-emerald-400 pointer-events-none">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                        </svg>
                      </div>
                    </div>
                  </div>
                )}
                
                <div>
                  <label className="block text-sm font-medium text-amber-100 mb-1.5">
                    Additional Notes
                  </label>
                  <textarea
                    name="notes"
                    value={orderForm.notes}
                    onChange={handleInputChange}
                    rows={3}
                    className="w-full px-4 py-2.5 bg-gray-800/60 border border-emerald-800/40 rounded-lg focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500/50 text-amber-50 placeholder-gray-400 transition-all duration-200 resize-none"
                    placeholder="Any specific requirements or notes..."
                  />
                </div>
              </div>
              
              <div className="sticky bottom-0 bg-gray-900/80 backdrop-blur-sm p-4 border-t border-emerald-900/50">
                <div className="flex justify-end space-x-3">
                  <button
                    type="button"
                    onClick={() => {
                      setIsOrderModalOpen(false);
                      setSelectedService(null);
                    }}
                    className="px-5 py-2.5 text-sm font-medium text-amber-100 bg-gray-700/80 hover:bg-gray-600/80 rounded-lg transition-colors duration-200 border border-gray-600/50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2.5 text-sm font-medium text-white bg-emerald-600 hover:bg-emerald-500 rounded-lg transition-colors duration-200 flex items-center gap-2 border border-emerald-500/50 shadow-lg shadow-emerald-900/30"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    Confirm Order
                  </button>
                </div>
              </div>
            </form>
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
                Your service order has been submitted successfully. The company will contact you soon to confirm the details.
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

