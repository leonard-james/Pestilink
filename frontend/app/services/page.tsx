'use client';

import Image from 'next/image';
import DashboardSidebar from '../components/DashboardSidebar';
import Footer from '../components/Footer';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

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
  pest_types?: string[];
}

export default function ServicesPage() {
  const router = useRouter();
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterType, setFilterType] = useState('');
  const [filterLocation, setFilterLocation] = useState('');

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
                  className="bg-emerald-800/30 backdrop-blur-sm rounded-2xl p-6 text-white hover:bg-emerald-800/40 transition"
                >
                  {service.image && (
                    <div className="w-full h-48 rounded-lg overflow-hidden mb-4">
                      <img
                        src={service.image}
                        alt={service.title}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}
                  <h3 className="text-lg font-bold mb-2">{service.title}</h3>
                  <p className="text-sm text-white/80 mb-4 line-clamp-2">{service.description}</p>
                  
                  <div className="space-y-2 mb-4 text-sm">
                    <div className="flex items-start gap-2">
                      <span className="opacity-90">{service.company_name}</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <span className="opacity-90">{service.location}</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <span className="opacity-90">{service.phone}</span>
                    </div>
                    {service.price && (
                      <div className="flex items-start gap-2">
                        <span className="opacity-90 font-semibold">₱{service.price.toLocaleString()}</span>
                      </div>
                    )}
                    {service.pest_types && service.pest_types.length > 0 && (
                      <div className="flex flex-wrap gap-2 mt-2">
                        {service.pest_types.slice(0, 4).map((pest) => (
                          <span
                            key={pest}
                            className="text-xs bg-emerald-900/40 text-emerald-200 px-2 py-1 rounded-full border border-emerald-500/30"
                          >
                            {pest}
                          </span>
                        ))}
                        {service.pest_types.length > 4 && (
                          <span className="text-xs text-white/60">+{service.pest_types.length - 4} more</span>
                        )}
                      </div>
                    )}
                  </div>

                  <button
                    onClick={() => {
                      // Open email client or show contact info
                      if (service.email) {
                        window.location.href = `mailto:${service.email}?subject=Inquiry about ${service.title}`;
                      } else if (service.phone) {
                        window.location.href = `tel:${service.phone}`;
                      }
                    }}
                    className="w-full bg-emerald-600 hover:bg-emerald-700 text-white py-2.5 rounded-lg text-center font-semibold text-sm transition-all duration-200 shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
                  >
                    {service.email ? 'CONTACT NOW' : service.phone ? 'CALL NOW' : 'VIEW DETAILS'}
                  </button>
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
    </div>
  );
}

