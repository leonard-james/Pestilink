'use client';

import Image from 'next/image';
import DashboardSidebar from '../../components/DashboardSidebar';
import Footer from '../../components/Footer';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../hooks/useAuth';
import { getAllPestNames } from '../../pest-services/pests/complete-data';

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
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    price: '',
    service_type: '',
    pest_types: '',
    image: null as File | null,
  });
  const [selectedPests, setSelectedPests] = useState<string[]>([]);
  const [pestSearchQuery, setPestSearchQuery] = useState('');
  const [showPestDropdown, setShowPestDropdown] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const allPestNames = getAllPestNames();

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    try {
      const token = localStorage.getItem('authToken');
      const formDataToSend = new FormData();
      formDataToSend.append('title', formData.title);
      formDataToSend.append('description', formData.description);
      formDataToSend.append('price', formData.price || '0');
      formDataToSend.append('service_type', formData.service_type);
      // Use selectedPests if available, otherwise fall back to pest_types input
      const pestsToSend = selectedPests.length > 0 ? selectedPests.join(', ') : formData.pest_types;
      formDataToSend.append('pest_types', pestsToSend);
      if (formData.image) {
        formDataToSend.append('image', formData.image);
      }

      const method = editingService ? 'PUT' : 'POST';
      const url = editingService 
        ? `${getApiBase()}/api/company/services/${editingService.id}`
        : `${getApiBase()}/api/company/services`;

      const response = await fetch(url, {
        method: method,
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        body: formDataToSend,
      });

      if (response.ok) {
        setShowAddModal(false);
        setEditingService(null);
        setFormData({
          title: '',
          description: '',
          price: '',
          service_type: '',
          pest_types: '',
          image: null,
        });
        setSelectedPests([]);
        setImagePreview(null);
        setErrorMsg(null);
        fetchServices();
      } else {
        // Try to parse error
        let error = 'Failed to create service';
        try {
          const json = await response.json();
          error = json?.message || JSON.stringify(json);
        } catch {}
        setErrorMsg(error);
      }
    } catch (error: any) {
      setErrorMsg(error?.message ?? 'Unknown error');
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
              onClick={() => setShowAddModal(true)}
              className="bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-3 rounded-lg font-medium"
            >
              + Add Service
            </button>
          </div>

          {/* Services List */}
          <div>
            <h2 className="text-2xl font-bold mb-4">My Services</h2>
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
                    <h3 className="text-lg font-bold mb-2">{service.title}</h3>
                    <p className="text-sm text-white/80 mb-4 line-clamp-2">{service.description}</p>
                    <div className="text-sm text-white/70 mb-4">
                      <p>Type: {service.service_type}</p>
                      {service.price && <p className="font-semibold">₱{service.price.toLocaleString()}</p>}
                      {service.pest_types && service.pest_types.length > 0 && (
                        <p>Pests: {service.pest_types.join(', ')}</p>
                      )}
                    </div>
                    <div className="flex gap-2">
                      <button 
                        onClick={() => {
                          setEditingService(service);
                          setFormData({
                            title: service.title,
                            description: service.description,
                            price: service.price?.toString() || '',
                            service_type: service.service_type || '',
                            pest_types: Array.isArray(service.pest_types) ? service.pest_types.join(', ') : '',
                            image: null,
                          });
                          setSelectedPests(Array.isArray(service.pest_types) ? service.pest_types : []);
                          setImagePreview(service.image);
                          setShowAddModal(true);
                        }}
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
              <div className="text-center text-white/80 py-8">No services posted yet. Add your first service!</div>
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

      {/* Add Service Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-[99999] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60" onClick={() => setShowAddModal(false)} />
          <div className="relative bg-gray-900 w-full max-w-2xl rounded-xl p-6 max-h-[90vh] overflow-y-auto">
            <h2 className="text-2xl font-bold mb-4">{editingService ? 'Edit Service' : 'Add New Service'}</h2>
            <form onSubmit={handleSubmit} className="space-y-4" onClick={(e) => {
              // Close dropdown when clicking outside
              if ((e.target as HTMLElement).closest('.pest-dropdown-container') === null) {
                setShowPestDropdown(false);
              }
            }}>
              <div>
                <label className="block text-white/80 mb-2">Service Title</label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full px-4 py-2 rounded-lg bg-white/10 text-white border border-white/20"
                />
              </div>
              <div>
                <label className="block text-white/80 mb-2">Description</label>
                <textarea
                  required
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-4 py-2 rounded-lg bg-white/10 text-white border border-white/20"
                  rows={4}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-white/80 mb-2">Price</label>
                  <input
                    type="number"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    className="w-full px-4 py-2 rounded-lg bg-white/10 text-white border border-white/20"
                  />
                </div>
                <div>
                  <label className="block text-white/80 mb-2">Service Type</label>
                  <input
                    type="text"
                    value={formData.service_type}
                    onChange={(e) => setFormData({ ...formData, service_type: e.target.value })}
                    className="w-full px-4 py-2 rounded-lg bg-white/10 text-white border border-white/20"
                  />
                </div>
              </div>
              <div className="pest-dropdown-container">
                <label className="block text-white/80 mb-2">Target Pests</label>
                <div className="relative">
                  <div className="flex flex-wrap gap-2 mb-2 min-h-[40px] p-2 bg-white/10 rounded-lg border border-white/20">
                    {selectedPests.length > 0 ? (
                      selectedPests.map((pest) => (
                        <span
                          key={pest}
                          className="inline-flex items-center gap-1 px-3 py-1 bg-emerald-600 text-white rounded-full text-sm"
                        >
                          {pest}
                          <button
                            type="button"
                            onClick={() => setSelectedPests(selectedPests.filter(p => p !== pest))}
                            className="hover:text-red-300"
                          >
                            ×
                          </button>
                        </span>
                      ))
                    ) : (
                      <span className="text-white/50 text-sm">No pests selected</span>
                    )}
                  </div>
                  <div className="relative">
                    <input
                      type="text"
                      value={pestSearchQuery}
                      onChange={(e) => {
                        setPestSearchQuery(e.target.value);
                        setShowPestDropdown(true);
                      }}
                      onFocus={() => setShowPestDropdown(true)}
                      placeholder="Search and select pests..."
                      className="w-full px-4 py-2 rounded-lg bg-white/10 text-white border border-white/20"
                    />
                    {showPestDropdown && (
                      <div className="absolute z-50 w-full mt-1 max-h-60 overflow-y-auto bg-gray-800 border border-white/20 rounded-lg shadow-lg">
                        {allPestNames
                          .filter(pest => 
                            pest.toLowerCase().includes(pestSearchQuery.toLowerCase()) &&
                            !selectedPests.includes(pest)
                          )
                          .map((pest) => (
                            <button
                              key={pest}
                              type="button"
                              onClick={() => {
                                if (!selectedPests.includes(pest)) {
                                  setSelectedPests([...selectedPests, pest]);
                                }
                                setPestSearchQuery('');
                                setShowPestDropdown(false);
                              }}
                              className="w-full text-left px-4 py-2 hover:bg-emerald-600/30 text-white text-sm"
                            >
                              {pest}
                            </button>
                          ))}
                        {allPestNames.filter(pest => 
                          pest.toLowerCase().includes(pestSearchQuery.toLowerCase()) &&
                          !selectedPests.includes(pest)
                        ).length === 0 && (
                          <div className="px-4 py-2 text-white/50 text-sm">No pests found</div>
                        )}
                      </div>
                    )}
                  </div>
                  <p className="text-xs text-white/60 mt-1">
                    Selected: {selectedPests.length} pest{selectedPests.length !== 1 ? 's' : ''}
                  </p>
                </div>
                {/* Keep the old input as fallback */}
                <div className="mt-2">
                  <label className="block text-white/60 mb-1 text-xs">Or enter manually (comma-separated)</label>
                  <input
                    type="text"
                    value={formData.pest_types}
                    onChange={(e) => setFormData({ ...formData, pest_types: e.target.value })}
                    placeholder="e.g., Ants, Cockroaches, Termites"
                    className="w-full px-4 py-2 rounded-lg bg-white/10 text-white border border-white/20"
                  />
                </div>
              </div>
              <div>
                <label className="block text-white/80 mb-2">Service Image</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    const file = e.target.files?.[0] || null;
                    setFormData({ ...formData, image: file });
                    if (file) {
                      const reader = new FileReader();
                      reader.onloadend = () => {
                        setImagePreview(reader.result as string);
                      };
                      reader.readAsDataURL(file);
                    } else {
                      setImagePreview(null);
                    }
                  }}
                  className="w-full px-4 py-2 rounded-lg bg-white/10 text-white border border-white/20"
                />
                {imagePreview && (
                  <img src={imagePreview} alt="Preview" className="mt-4 rounded-lg max-h-48 mx-auto" />
                )}
              </div>
              {errorMsg && (
                <div className="my-2 py-2 px-4 bg-red-700 text-white rounded-lg text-center">
                  {errorMsg}
                </div>
              )}
              <div className="flex gap-4">
                <button
                  type="submit"
                  className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white py-3 rounded-lg font-medium"
                >
                  {editingService ? 'Update Service' : 'Create Service'}
                </button>
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="flex-1 bg-gray-600 hover:bg-gray-700 text-white py-3 rounded-lg font-medium"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="relative z-10">
        <Footer />
      </div>
    </div>
  );
}

