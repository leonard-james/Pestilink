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
      {services.length === 0 ? (
        <div className="bg-gray-900/80 backdrop-blur-sm rounded-xl border border-white/10 p-8 text-center">
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
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((service) => (
            <div
              key={service.id}
              className="bg-emerald-800/30 backdrop-blur-sm rounded-xl p-6 hover:bg-emerald-800/50 transition-colors"
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
                {service.price !== null && <p>Price: ₱{service.price.toLocaleString()}</p>}
                {service.pest_types && service.pest_types.length > 0 && (
                  <p className="mt-2">
                    <span className="font-semibold">Target Pests:</span>{' '}
                    <span className="text-white/80">{service.pest_types.join(', ')}</span>
                  </p>
                )}
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => {
                    setEditingService(service);
                    setShowAddModal(true);
                  }}
                  className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white py-2 rounded-lg text-center font-medium text-sm transition"
                >
                  EDIT
                </button>
                <button
                  onClick={() => handleDeleteService(service.id)}
                  className="flex-1 bg-red-600 hover:bg-red-700 text-white py-2 rounded-lg text-center font-medium text-sm transition"
                >
                  DELETE
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
    </CompanyPageLayout>
  );
}
