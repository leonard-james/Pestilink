'use client';

import Image from 'next/image';
import DashboardSidebar from '../../components/DashboardSidebar';
import Footer from '../../components/Footer';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../hooks/useAuth';
import { getAllPestNames } from '../../pest-services/pests/complete-data';
import ServiceModal from '../../components/ServiceModal';

interface Service {
  id: number;
  title: string;
  description: string;
  price: number | null;
  service_type: string;
  pest_types: string[];
  image: string | null;
  is_active: boolean;
}

interface Booking {
  id: number;
  status: string;
  booking_notes?: string | null;
  created_at?: string;
  service?: {
    title?: string;
  };
  user?: {
    name?: string;
  };
}

export default function CompanyDashboard() {
  const router = useRouter();
  const { user } = useAuth();
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loadingBookings, setLoadingBookings] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingService, setEditingService] = useState<Service | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const allPestNames = getAllPestNames();

  const handleAddService = () => {
    setEditingService(null);
    setShowAddModal(true);
  };

  const handleEditService = (service: Service) => {
    setEditingService(service);
    setShowAddModal(true);
  };

  const handleServiceSubmit = async (formData: any) => {
    const token = localStorage.getItem('authToken');
    if (!token) {
      setErrorMsg('No authentication token found. Please log in again.');
      return false;
    }

    const formDataToSend = new FormData();
    formDataToSend.append('title', formData.title);
    formDataToSend.append('description', formData.description);
    formDataToSend.append('price', formData.price || '0');
    formDataToSend.append('service_type', formData.service_type);
    formDataToSend.append('pest_types', formData.pest_types);
    
    if (formData.image) {
      formDataToSend.append('image', formData.image);
    }

    try {
      const url = editingService 
        ? `${getApiBase()}/api/company/services/${editingService.id}`
        : `${getApiBase()}/api/company/services`;
      
      const method = editingService ? 'PUT' : 'POST';
      
      const response = await fetch(url, {
        method,
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        body: formDataToSend,
      });

      if (response.ok) {
        setShowAddModal(false);
        setEditingService(null);
        fetchServices();
        return true;
      } else {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to save service');
      }
    } catch (error) {
      console.error('Error saving service:', error);
      setErrorMsg(error instanceof Error ? error.message : 'Failed to save service');
      return false;
    }
  };

  useEffect(() => {
    fetchServices();
    fetchBookings();
  }, []);

  // Helper for API base
  const getApiBase = () => {
    const base = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
    // Remove trailing slash if any
    return base.replace(/\/?$/, '');
  };

  const fetchServices = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('authToken');
      const response = await fetch(`${getApiBase()}/api/company/services`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
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

  const fetchBookings = async () => {
    try {
      setLoadingBookings(true);
      const token = localStorage.getItem('authToken');
      const response = await fetch(`${getApiBase()}/api/bookings/company`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      if (response.ok) {
        const data = await response.json();
        setBookings(data.bookings || []);
      }
    } catch (error) {
      console.error('Error fetching bookings:', error);
    } finally {
      setLoadingBookings(false);
    }
  };

  const updateBookingStatus = async (id: number, status: 'approved' | 'cancelled') => {
    try {
      const token = localStorage.getItem('authToken');
      const response = await fetch(`${getApiBase()}/api/bookings/${id}/status`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status }),
      });
      if (response.ok) {
        fetchBookings();
      } else {
        console.error('Failed to update booking');
      }
    } catch (error) {
      console.error('Error updating booking:', error);
    }
  };


  return (
    <div className="min-h-screen w-full bg-black text-white flex flex-col relative">
      <DashboardSidebar role="company" />

      <Image
        src="/farm pic.jpg"
        alt="Farm background"
        fill
        className="object-cover pointer-events-none"
        priority
      />

      <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/50 to-black/30 pointer-events-none z-0"></div>

      <main className="relative z-10 flex-1 ml-20 peer-hover:ml-64 transition-all duration-300 container mx-auto px-4 pt-8 pb-24 min-h-[calc(100vh-200px)]">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-4xl font-bold mb-2 text-white">Company Dashboard</h1>
              <p className="text-white/80">Manage your services and reach more farmers.</p>
            </div>
            <button
              onClick={handleAddService}
              className="bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-3 rounded-lg font-medium transition-colors duration-200"
            >
              + Add Service/Product
            </button>
          </div>

          {/* Services/Products List */}
          <div className="w-full">
            <h2 className="text-2xl font-bold mb-6 text-white">My Services/Products</h2>
            {loading ? (
              <div className="text-center text-white/80 py-8">Loading services...</div>
            ) : services.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-4 md:gap-6 w-full">
                {services.map((service) => (
                  <div
                    key={service.id}
                    className="bg-gray-900/70 backdrop-blur-sm rounded-xl p-4 md:p-5 border border-white/10 hover:border-emerald-500/30 transition-all duration-200 flex flex-col h-full"
                  >
                    {service.image ? (
                      <div className="w-full aspect-video rounded-lg overflow-hidden mb-3">
                        <img
                          src={service.image}
                          alt={service.title}
                          className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                        />
                      </div>
                    ) : (
                      <div className="w-full aspect-video bg-gray-800/50 rounded-lg mb-3 flex items-center justify-center">
                        <span className="text-gray-400">No Image</span>
                      </div>
                    )}
                    
                    <div className="flex-1">
                      <div className="flex justify-between items-start gap-2 mb-2">
                        <h3 className="text-base md:text-lg font-bold text-white line-clamp-1">{service.title}</h3>
                        <span className={`px-2 py-1 rounded-full text-xs font-semibold whitespace-nowrap ${
                          service.service_type === 'product' 
                            ? 'bg-blue-900/50 text-blue-300' 
                            : 'bg-green-900/50 text-green-300'
                        }`}>
                          {service.service_type === 'product' ? 'Product' : 'Service'}
                        </span>
                      </div>
                      
                      <p className="text-sm text-gray-300 mb-3 line-clamp-2 h-10">{service.description}</p>
                      
                      <div className="space-y-1.5 text-sm text-gray-300 mb-4">
                        <div className="flex justify-between">
                          <span className="text-gray-400">Category:</span>
                          <span className="font-medium capitalize">{service.service_type}</span>
                        </div>
                        {service.price !== null && (
                          <div className="flex justify-between">
                            <span className="text-gray-400">Price:</span>
                            <span className="font-medium">₱{service.price.toLocaleString()}</span>
                          </div>
                        )}
                        {service.pest_types && service.pest_types.length > 0 && (
                          <div className="pt-1">
                            <div className="text-xs font-medium text-gray-400 mb-1">Target Pests:</div>
                            <div className="flex flex-wrap gap-1">
                              {service.pest_types.slice(0, 3).map((pest, idx) => (
                                <span key={idx} className="text-xs bg-gray-800/70 text-gray-200 px-2 py-0.5 rounded-full">
                                  {pest}
                                </span>
                              ))}
                              {service.pest_types.length > 3 && (
                                <span className="text-xs bg-gray-800/70 text-gray-400 px-2 py-0.5 rounded-full">
                                  +{service.pest_types.length - 3} more
                                </span>
                              )}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                    
                    <div className="flex gap-2 mt-auto">
                      <button
                        onClick={() => handleEditService(service)}
                        className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white py-1.5 rounded-lg text-center font-medium text-sm transition"
                      >
                        Edit
                      </button>
                      <button 
                        onClick={async () => {
                          if (confirm(`Are you sure you want to delete "${service.title}"?`)) {
                            try {
                              const token = localStorage.getItem('authToken');
                              const response = await fetch(`${getApiBase()}/api/company/services/${service.id}`, {
                                method: 'DELETE',
                                headers: {
                                  'Authorization': `Bearer ${token}`,
                                },
                              });
                              if (response.ok) {
                                fetchServices();
                              } else {
                                alert('Failed to delete service');
                              }
                            } catch (error) {
                              console.error('Error deleting service:', error);
                              alert('An error occurred while deleting the service');
                            }
                          }
                        }}
                        className="flex-1 bg-red-600/80 hover:bg-red-700 text-white py-1.5 rounded-lg text-center font-medium text-sm transition"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="bg-gray-900/80 backdrop-blur-sm rounded-xl border border-white/10 p-8 text-center w-full">
                <h2 className="text-2xl font-semibold mb-2">No Services/Products Yet</h2>
                <p className="text-gray-300 mb-6">Get started by adding your first service or product</p>
                <button
                  onClick={() => setShowAddModal(true)}
                  className="bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-2 rounded-lg font-medium transition-colors duration-200"
                >
                  + Add Service/Product
                </button>
              </div>
            )}
          </div>

          {/* Bookings */}
          <div className="mt-12">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-white">Bookings</h2>
              <button
                onClick={fetchBookings}
                className="text-sm px-4 py-2 bg-white/10 hover:bg-white/20 rounded-lg text-white/90 hover:text-white transition-colors duration-200"
              >
                Refresh
              </button>
            </div>

            {loadingBookings ? (
              <div className="text-center text-white/70 py-6">Loading bookings...</div>
            ) : bookings.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-4 md:gap-6 w-full">
                {bookings.map((booking) => (
                  <div
                    key={booking.id}
                    className="bg-gray-900/70 backdrop-blur-sm rounded-xl p-4 md:p-5 border border-white/10 hover:border-emerald-500/30 transition-all duration-200"
                  >
                    <div className="flex justify-between items-start gap-3 mb-3">
                      <div className="flex-1">
                        <p className="text-xs text-gray-400 mb-1">Service</p>
                        <h3 className="text-base font-semibold text-white line-clamp-1">{booking.service?.title || 'Service'}</h3>
                        <p className="text-sm text-gray-300 mt-1">Client: {booking.user?.name || 'Customer'}</p>
                      </div>
                      <span
                        className={`px-2.5 py-1 rounded-full text-xs font-semibold whitespace-nowrap ${
                          booking.status === 'approved'
                            ? 'bg-emerald-900/50 text-emerald-300'
                            : booking.status === 'cancelled'
                            ? 'bg-red-900/50 text-red-300'
                            : 'bg-yellow-900/50 text-yellow-200'
                        }`}
                      >
                        {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                      </span>
                    </div>
                    
                    {booking.booking_notes && (
                      <div className="mb-4">
                        <p className="text-xs text-gray-400 mb-1">Notes</p>
                        <p className="text-sm text-gray-300">{booking.booking_notes}</p>
                      </div>
                    )}
                    
                    <div className="text-xs text-gray-400 mb-4">
                      <p>{booking.created_at ? new Date(booking.created_at).toLocaleString() : ''}</p>
                    </div>
                    
                    {booking.status === 'pending' && (
                      <div className="flex gap-2 mt-auto">
                        <button
                          onClick={() => updateBookingStatus(booking.id, 'approved')}
                          className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white py-1.5 rounded-lg text-sm font-medium transition"
                        >
                          Approve
                        </button>
                        <button
                          onClick={() => updateBookingStatus(booking.id, 'cancelled')}
                          className="flex-1 bg-red-600/80 hover:bg-red-700 text-white py-1.5 rounded-lg text-sm font-medium transition"
                        >
                          Decline
                        </button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="bg-gray-900/80 backdrop-blur-sm rounded-xl border border-white/10 p-8 text-center">
                <h3 className="text-xl font-semibold mb-2">No Bookings Yet</h3>
                <p className="text-gray-300">Your upcoming bookings will appear here</p>
              </div>
            )}
          </div>
        </div>
      </main>

      <ServiceModal
        isOpen={showAddModal}
        onClose={() => {
          setShowAddModal(false);
          setEditingService(null);
          setErrorMsg(null);
        }}
        onSubmit={handleServiceSubmit}
        service={editingService}
      />
      {errorMsg && (
        <div className="fixed bottom-4 right-4 bg-red-600 text-white px-4 py-2 rounded-lg shadow-lg">
          {errorMsg}
        </div>
      )}
    </div>
  );
}
