'use client';

import Image from 'next/image';
import DashboardSidebar from '../../components/DashboardSidebar';
import Footer from '../../components/Footer';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../hooks/useAuth';

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

export default function CompanyDashboard() {
  const router = useRouter();
  const { user } = useAuth();
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    price: '',
    service_type: '',
    pest_types: '',
    image: null as File | null,
  });
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  useEffect(() => {
    fetchServices();
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
      formDataToSend.append('pest_types', formData.pest_types);
      if (formData.image) {
        formDataToSend.append('image', formData.image);
      }

      const response = await fetch(`${getApiBase()}/api/company/services`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        body: formDataToSend,
      });

      if (response.ok) {
        setShowAddModal(false);
        setFormData({
          title: '',
          description: '',
          price: '',
          service_type: '',
          pest_types: '',
          image: null,
        });
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
                      <button className="flex-1 bg-[#0b2036] text-white py-2 rounded-lg hover:bg-[#12293b] text-center font-medium text-sm">
                        EDIT
                      </button>
                      <button className="flex-1 bg-red-600 text-white py-2 rounded-lg hover:bg-red-700 text-center font-medium text-sm">
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
        </div>
      </main>

      {/* Add Service Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-[99999] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60" onClick={() => setShowAddModal(false)} />
          <div className="relative bg-gray-900 w-full max-w-2xl rounded-xl p-6 max-h-[90vh] overflow-y-auto">
            <h2 className="text-2xl font-bold mb-4">Add New Service</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
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
              <div>
                <label className="block text-white/80 mb-2">Target Pests (comma-separated)</label>
                <input
                  type="text"
                  value={formData.pest_types}
                  onChange={(e) => setFormData({ ...formData, pest_types: e.target.value })}
                  placeholder="e.g., Ants, Cockroaches, Termites"
                  className="w-full px-4 py-2 rounded-lg bg-white/10 text-white border border-white/20"
                />
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
                  Create Service
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

