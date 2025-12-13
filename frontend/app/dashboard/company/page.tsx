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

      <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/40 to-transparent pointer-events-none z-0"></div>

      <main className="relative z-10 flex-1 ml-20 peer-hover:ml-64 transition-all duration-300 container mx-auto px-4 pt-8 pb-24 min-h-[calc(100vh-200px)]">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-4xl font-bold mb-4">Company Dashboard</h1>
              <p className="text-white/80">Manage your services and reach more farmers.</p>
            </div>
            <button
              onClick={handleAddService}
              className="bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-3 rounded-lg font-medium"
            >
              + Add Service/Product
            </button>
          </div>

          {/* Services/Products List */}
          <div>
            <h2 className="text-2xl font-bold mb-4">My Services/Products</h2>
            {loading ? (
              <div className="text-center text-white/80 py-8">Loading services...</div>
            ) : services.length > 0 ? (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {services.map((service) => (
                  <div
                    key={service.id}
                    className="bg-emerald-800/30 backdrop-blur-sm rounded-xl p-6"
                  >
                    {service.image && (
                      <div className="w-full h-40 rounded-lg overflow-hidden mb-4">
                        <img
                          src={service.image}
                          alt={service.title}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    )}
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="text-lg font-bold">{service.title}</h3>
                      <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                        service.service_type === 'product' 
                          ? 'bg-blue-900/50 text-blue-300' 
                          : 'bg-green-900/50 text-green-300'
                      }`}>
                        {service.service_type === 'product' ? 'Product' : 'Service'}
                      </span>
                    </div>
                    <p className="text-sm text-white/80 mb-4 line-clamp-2">{service.description}</p>
                    <div className="text-sm text-white/70 mb-4">
                      <p>Category: {service.service_type}</p>
                      {service.price && <p className="font-semibold">₱{service.price.toLocaleString()}</p>}
                      {service.pest_types && service.pest_types.length > 0 && (
                        <p>Pests: {service.pest_types.join(', ')}</p>
                      )}
                    </div>
                    <div className="flex gap-2">
                      <button 
                        onClick={() => handleEditService(service)}
                        className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white py-2 rounded-lg text-center font-medium text-sm transition"
                      >
                        EDIT
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
                        className="flex-1 bg-red-600 text-white py-2 rounded-lg hover:bg-red-700 text-center font-medium text-sm transition"
                      >
                        DELETE
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center text-white/80 py-8">No services or products posted yet. Add your first item!</div>
            )}
          </div>

          {/* Bookings */}
          <div className="mt-12">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold">Bookings</h2>
              <button
                onClick={fetchBookings}
                className="text-sm px-4 py-2 bg-white/10 hover:bg-white/20 rounded-lg"
              >
                Refresh
              </button>
            </div>

            {loadingBookings ? (
              <div className="text-center text-white/70 py-6">Loading bookings...</div>
            ) : bookings.length > 0 ? (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {bookings.map((booking) => (
                  <div
                    key={booking.id}
                    className="bg-emerald-800/30 backdrop-blur-sm rounded-xl p-5 border border-white/10"
                  >
                    <div className="flex justify-between items-start gap-3 mb-3">
                      <div>
                        <p className="text-xs text-white/60">Service</p>
                        <h3 className="text-lg font-semibold">{booking.service?.title || 'Service'}</h3>
                        <p className="text-sm text-white/70">Client: {booking.user?.name || 'Customer'}</p>
                      </div>
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-semibold ${
                          booking.status === 'approved'
                            ? 'bg-emerald-900/50 text-emerald-300'
                            : booking.status === 'cancelled'
                            ? 'bg-red-900/40 text-red-300'
                            : 'bg-yellow-900/40 text-yellow-200'
                        }`}
                      >
                        {booking.status}
                      </span>
                    </div>
                    {booking.booking_notes && (
                      <div className="text-sm text-white/80 mb-3">
                        <p className="text-white/60 text-xs mb-1">Notes</p>
                        <p>{booking.booking_notes}</p>
                      </div>
                    )}
                    <div className="flex justify-between items-center text-xs text-white/60 mb-3">
                      <span>{booking.created_at ? new Date(booking.created_at).toLocaleString() : ''}</span>
                    </div>
                    {booking.status === 'pending' && (
                      <div className="flex gap-2">
                        <button
                          onClick={() => updateBookingStatus(booking.id, 'approved')}
                          className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white py-2 rounded-lg text-sm font-medium transition"
                        >
                          Approve
                        </button>
                        <button
                          onClick={() => updateBookingStatus(booking.id, 'cancelled')}
                          className="flex-1 bg-red-600 hover:bg-red-700 text-white py-2 rounded-lg text-sm font-medium transition"
                        >
                          Decline
                        </button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center text-white/70 py-8 bg-white/5 rounded-xl border border-white/10">
                No bookings yet.
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
