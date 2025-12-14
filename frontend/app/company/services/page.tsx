'use client';

import { useState, useEffect } from 'react';
import ServiceModal from './ServiceModal';
import CompanyPageLayout from '@/components/CompanyPageLayout';

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

export default function CompanyServicesPage() {
  const [isLoading, setIsLoading] = useState(true);
  const [services, setServices] = useState<Service[]>([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingService, setEditingService] = useState<Service | null>(null);

  useEffect(() => {
    fetchServices();
  }, []);

  const fetchServices = async () => {
    try {
      setIsLoading(true);
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
      setIsLoading(false);
    }
  };

  const getApiBase = () => {
    const base = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
    return base.replace(/\/?$/, '');
  };

  const handleSubmitService = async (formData: any) => {
    try {
      const token = localStorage.getItem('authToken');
      const formDataToSend = new FormData();
      
      formDataToSend.append('title', formData.title);
      formDataToSend.append('description', formData.description);
      formDataToSend.append('price', formData.price || '0');
      formDataToSend.append('service_type', formData.item_type === 'product' ? 'product' : formData.service_type);
      formDataToSend.append('pest_types', formData.pest_types);
      
      if (formData.image) {
        formDataToSend.append('image', formData.image);
      }

      const method = editingService ? 'PUT' : 'POST';
      const url = editingService 
        ? `${getApiBase()}/api/company/services/${editingService.id}`
        : `${getApiBase()}/api/company/services`;

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
      } else {
        console.error('Failed to save service');
      }
    } catch (error) {
      console.error('Error saving service:', error);
    }
  };

  const handleDeleteService = async (id: number) => {
    if (confirm('Are you sure you want to delete this service?')) {
      try {
        const token = localStorage.getItem('authToken');
        const response = await fetch(`${getApiBase()}/api/company/services/${id}`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });
        
        if (response.ok) {
          fetchServices();
        } else {
          console.error('Failed to delete service');
        }
      } catch (error) {
        console.error('Error deleting service:', error);
      }
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-emerald-500"></div>
      </div>
    );
  }

  const headerRight = (
    <button
      onClick={() => {
        setEditingService(null);
        setShowAddModal(true);
      }}
      className="bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-3 rounded-lg font-medium"
    >
      + Add Service/Product
    </button>
  );

  return (
    <CompanyPageLayout 
      title="Services & Products"
      description="Manage your services and products"
      headerRight={headerRight}
    >
      <div className="w-full">
        {services.length === 0 ? (
          <div className="bg-gray-900/80 backdrop-blur-sm rounded-xl border border-white/10 p-8 text-center w-full">
            <h2 className="text-2xl font-semibold mb-2">No Services/Products Yet</h2>
            <p className="text-gray-300 mb-6">Get started by adding your first service or product</p>
            <button
              onClick={() => setShowAddModal(true)}
              className="bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-2 rounded-lg font-medium"
            >
              + Add Service/Product
            </button>
          </div>
        ) : (
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
                    onClick={() => {
                      setEditingService(service);
                      setShowAddModal(true);
                    }}
                    className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white py-1.5 rounded-lg text-center font-medium text-sm transition"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDeleteService(service.id)}
                    className="flex-1 bg-red-600/80 hover:bg-red-700 text-white py-1.5 rounded-lg text-center font-medium text-sm transition"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
      )}

      <ServiceModal
        isOpen={showAddModal}
        onClose={() => {
          setShowAddModal(false);
          setEditingService(null);
        }}
        onSubmit={handleSubmitService}
        service={editingService}
      />
    </div>
    </CompanyPageLayout>
  );
}
