'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import { useAuth } from '../../hooks/useAuth';
import { FiArrowLeft, FiCalendar, FiMail, FiPhone, FiMapPin, FiDollarSign, FiCheckCircle } from 'react-icons/fi';
import Footer from '../../components/Footer';
import DashboardSidebar from '../../components/DashboardSidebar';

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
  pest_types: string[];
  service_type: string;
  is_active?: boolean;
}

export default function ServiceDetails() {
  const router = useRouter();
  const { user } = useAuth();
  const params = useParams();
  const [service, setService] = useState<Service | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isOrderModalOpen, setIsOrderModalOpen] = useState(false);
  
  // Get the ID from the URL parameters
  const serviceId = params?.id;
  const idToFetch = serviceId ? (Array.isArray(serviceId) ? serviceId[0] : serviceId) : '';
  
  const [orderForm, setOrderForm] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '',
    address: user?.address || '',
    date: '',
    notes: '',
    service_id: idToFetch
  });

  useEffect(() => {
    const fetchService = async () => {
      if (!idToFetch) {
        setError('No service ID provided');
        setLoading(false);
        return;
      }
      
      try {
        const response = await fetch(`/api/services/${encodeURIComponent(idToFetch)}`, {
          method: 'GET',
          headers: { 'Content-Type': 'application/json' },
          cache: 'no-store'
        });
        
        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          throw new Error(errorData.error || 'Failed to fetch service');
        }
        
        const data = await response.json();
        setService(data);
      } catch (err) {
        console.error('Error fetching service:', err);
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchService();
  }, [idToFetch]);

  // Handle order form changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setOrderForm(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleOrderSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch('/api/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          serviceId: service?.id,
          ...orderForm,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to place order');
      }

      // Redirect to orders page or show success message
      router.push('/orders');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to place order');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-100">
        <div className="container mx-auto px-4 py-8 text-center">
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">
            <span className="block sm:inline">{error || 'An error occurred'}</span>
          </div>
          <button
            onClick={() => router.back()}
            className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  if (!service) {
    return (
      <>
        <main className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <svg
                className="mx-auto h-12 w-12 text-gray-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <h3 className="mt-2 text-sm font-medium text-gray-900">No service found</h3>
              <p className="mt-1 text-sm text-gray-500">The service you're looking for doesn't exist or has been removed.</p>
              <div className="mt-6">
                <button
                  onClick={() => router.push('/services')}
                  className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  View all services
                </button>
              </div>
            </div>
          </div>
        </main>
      </>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <DashboardSidebar role="farmer" />
      
      <div className="relative">
        <div className="ml-0 md:ml-20 lg:ml-64 p-4 md:p-6">
          <button
            onClick={() => router.back()}
            className="flex items-center text-green-700 hover:text-green-800 mb-6 transition-colors"
          >
            <FiArrowLeft className="mr-2" />
            Back to Services
          </button>

          <div className="container mx-auto bg-white rounded-lg shadow-sm overflow-hidden border border-gray-200">
            <div className="md:flex">
              {/* Service Image */}
              <div className="md:w-1/2 relative">
                <div className="aspect-w-16 aspect-h-9 w-full">
                  {service.image ? (
                    <Image
                      src={service.image}
                      alt={service.title}
                      width={800}
                      height={600}
                      className="w-full h-full object-cover"
                      priority
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center text-gray-400">
                      <span>No image available</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
            
            {/* Service Details */}
            <div className="p-6 md:p-8 md:w-1/2 bg-white">
              <div className="flex justify-between items-start mb-6">
                <div>
                  <span className="inline-block bg-blue-100 text-blue-800 text-xs font-semibold px-3 py-1 rounded-full mb-3">
                    {service.service_type}
                  </span>
                  <h1 className="text-3xl font-bold text-gray-900 mb-2">{service.title}</h1>
                </div>
                {service.price !== null && (
                  <div className="text-2xl font-bold text-green-600 bg-green-50 px-4 py-2 rounded-lg">
                    ₱{service.price.toLocaleString()}
                  </div>
                )}
              </div>

              {/* Description */}
              <div className="mb-8">
                <h2 className="text-lg font-semibold text-gray-800 mb-3 pb-2 border-b border-gray-100">
                  Service Description
                </h2>
                <p className="text-gray-700 leading-relaxed">{service.description}</p>
              </div>

              {/* Target Pests */}
              <div className="mb-8">
                <h2 className="text-lg font-semibold text-gray-800 mb-3 pb-2 border-b border-gray-100">
                  Target Pests
                </h2>
                <div className="flex flex-wrap gap-2">
                  {service.pest_types && service.pest_types.length > 0 ? (
                    service.pest_types.map((pest, index) => (
                      <span
                        key={index}
                        className="bg-green-100 text-green-800 text-sm font-medium px-3 py-1.5 rounded-full border border-green-200"
                      >
                        {pest}
                      </span>
                    ))
                  ) : (
                    <span className="text-gray-500 text-sm">No specific pests targeted</span>
                  )}
                </div>
              </div>

              {/* Company Information */}
              <div className="bg-gray-50 p-6 rounded-lg border border-gray-100">
                <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                  <FiMapPin className="mr-2 text-blue-500" />
                  Company Information
                </h2>
                <div className="space-y-4">
                  <div className="flex items-start">
                    <div className="flex-shrink-0">
                      <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                        <FiMapPin className="h-5 w-5 text-blue-600" />
                      </div>
                    </div>
                    <div className="ml-3">
                      <p className="text-sm font-medium text-gray-500">Location</p>
                      <p className="text-gray-900">{service.location}</p>
                    </div>
                  </div>

                  {/* Phone */}
                  <div className="flex items-start">
                  <div className="flex-shrink-0">
                    <div className="h-10 w-10 rounded-full bg-green-100 flex items-center justify-center">
                      <FiPhone className="h-5 w-5 text-green-600" />
                    </div>
                  </div>
                  <div className="ml-3">
                    <p className="text-sm font-medium text-gray-500">Phone</p>
                    <a href={`tel:${service.phone}`} className="text-blue-600 hover:underline">
                      {service.phone}
                    </a>
                  </div>
                </div>

                {/* Email */}
                <div className="flex items-start">
                    <div className="flex-shrink-0">
                      <div className="h-10 w-10 rounded-full bg-purple-100 flex items-center justify-center">
                        <FiMail className="h-5 w-5 text-purple-600" />
                      </div>
                    </div>
                    <div className="ml-3">
                      <p className="text-sm font-medium text-gray-500">Email</p>
                      <a href={`mailto:${service.email}`} className="text-blue-600 hover:underline">
                        {service.email}
                      </a>
                    </div>
                  </div>
                </div>
              </div>

              {/* Call to Action Button */}
              <div className="mt-6">
                <button
                  onClick={() => setIsOrderModalOpen(true)}
                  className="w-full bg-gradient-to-r from-green-600 to-emerald-700 hover:from-green-700 hover:to-emerald-800 text-white font-semibold py-3 px-6 rounded-lg shadow-md hover:shadow-lg transition-all duration-200 transform hover:-translate-y-0.5 flex items-center justify-center space-x-2"
                >
                  <FiCalendar className="h-5 w-5" />
                  <span>Book This Service</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Order Modal */}
      {isOrderModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md border border-gray-200">
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-bold text-gray-900">Book Service</h3>
                <button
                  type="button"
                  onClick={() => setIsOrderModalOpen(false)}
                  className="text-gray-400 hover:text-gray-500"
                >
                  <span className="sr-only">Close</span>
                  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              
              <form onSubmit={handleOrderSubmit}>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                    <input
                      type="text"
                      required
                      value={orderForm.name}
                      onChange={(e) => setOrderForm({...orderForm, name: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 bg-white"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                    <input
                      type="email"
                      required
                      value={orderForm.email}
                      onChange={(e) => setOrderForm({...orderForm, email: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 bg-white"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                    <input
                      type="tel"
                      required
                      value={orderForm.phone}
                      onChange={(e) => setOrderForm({...orderForm, phone: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 bg-white"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
                    <textarea
                      required
                      value={orderForm.address}
                      onChange={(e) => setOrderForm({...orderForm, address: e.target.value})}
                      rows={3}
                      className="w-full px-3 py-2 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 bg-white"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Preferred Date</label>
                    <input
                      type="date"
                      required
                      value={orderForm.date}
                      onChange={(e) => setOrderForm({...orderForm, date: e.target.value})}
                      min={new Date().toISOString().split('T')[0]}
                      className="w-full px-3 py-2 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 bg-white"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Additional Notes</label>
                    <textarea
                      value={orderForm.notes}
                      onChange={(e) => setOrderForm({...orderForm, notes: e.target.value})}
                      rows={3}
                      className="w-full px-3 py-2 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 bg-white"
                      placeholder="Any special requirements or notes..."
                    />
                  </div>
                </div>
                
                <div className="mt-6 flex justify-end space-x-3">
                  <button
                    type="button"
                    onClick={() => setIsOrderModalOpen(false)}
                    className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 border border-transparent rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                  >
                    Submit Request
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
      
      <Footer />
    </div>
  );
}
