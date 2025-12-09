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
  company_name: string;
  location: string;
  phone: string;
  email: string;
  image: string | null;
}

export default function FarmerDashboard() {
  const router = useRouter();
  const { user } = useAuth();
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [recentDetections, setRecentDetections] = useState<any[]>([]);

  useEffect(() => {
    fetchServices();
    // Load recent pest detections from localStorage if available
    const stored = localStorage.getItem('recentPestDetections');
    if (stored) {
      try {
        setRecentDetections(JSON.parse(stored).slice(0, 5));
      } catch (e) {
        console.error('Error loading recent detections:', e);
      }
    }
  }, []);

  const fetchServices = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('authToken');
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'}/api/services`, {
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

  return (
    <div className="min-h-screen w-full bg-black text-white flex flex-col relative">
      <DashboardSidebar role="farmer" />

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
          {/* Welcome Section */}
          <div className="mb-8 bg-emerald-800/30 backdrop-blur-sm rounded-2xl p-6">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <div>
                <h1 className="text-3xl md:text-4xl font-bold mb-2">
                  Welcome back, {user?.name || 'Farmer'}!
                </h1>
                <p className="text-white/80">
                  Manage your pest control needs and protect your crops.
                </p>
              </div>
              <button
                onClick={() => router.push('/pest-services')}
                className="bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-3 rounded-lg font-semibold transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 whitespace-nowrap"
              >
                Detect Pest Now
              </button>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-emerald-800/30 backdrop-blur-sm rounded-xl p-6">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-white/80 text-sm">Available Services</h3>
                <svg className="w-6 h-6 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <p className="text-3xl font-bold">{services.length}</p>
            </div>
            <div className="bg-emerald-800/30 backdrop-blur-sm rounded-xl p-6">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-white/80 text-sm">Pest Detections</h3>
                <svg className="w-6 h-6 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <p className="text-3xl font-bold">{recentDetections.length}</p>
            </div>
            <div className="bg-emerald-800/30 backdrop-blur-sm rounded-xl p-6">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-white/80 text-sm">Companies Nearby</h3>
                <svg className="w-6 h-6 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
              <p className="text-3xl font-bold">
                {new Set(services.map(s => s.company_name)).size}
              </p>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="mb-8">
            <h2 className="text-2xl font-bold mb-4">Quick Actions</h2>
            <div className="grid md:grid-cols-3 gap-6">
              <button
                onClick={() => router.push('/pest-services')}
                className="bg-emerald-800/30 backdrop-blur-sm rounded-xl p-6 hover:bg-emerald-800/40 transition-all duration-200 text-left group shadow-md hover:shadow-lg transform hover:-translate-y-1"
              >
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-12 h-12 bg-emerald-600 rounded-lg flex items-center justify-center group-hover:scale-110 transition">
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                    </svg>
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-semibold mb-1">Pest Classification</h3>
                    <p className="text-white/80 text-sm">Search or upload image to identify pests</p>
                  </div>
                </div>
              </button>
              
              <button
                onClick={() => router.push('/services')}
                className="bg-emerald-800/30 backdrop-blur-sm rounded-xl p-6 hover:bg-emerald-800/40 transition-all duration-200 text-left group shadow-md hover:shadow-lg transform hover:-translate-y-1"
              >
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-12 h-12 bg-emerald-600 rounded-lg flex items-center justify-center group-hover:scale-110 transition">
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-semibold mb-1">Browse Services</h3>
                    <p className="text-white/80 text-sm">Find professional pest control</p>
                  </div>
                </div>
              </button>
              
              <button
                onClick={() => router.push('/pest-services')}
                className="bg-emerald-800/30 backdrop-blur-sm rounded-xl p-6 hover:bg-emerald-800/40 transition-all duration-200 text-left group shadow-md hover:shadow-lg transform hover:-translate-y-1"
              >
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-12 h-12 bg-emerald-600 rounded-lg flex items-center justify-center group-hover:scale-110 transition">
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                    </svg>
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-semibold mb-1">Pest Classification</h3>
                    <p className="text-white/80 text-sm">Learn about different pests</p>
                  </div>
                </div>
              </button>
            </div>
          </div>

          {/* Recent Pest Detections */}
          {recentDetections.length > 0 && (
            <div className="mb-8">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-bold">Recent Pest Detections</h2>
                <button
                  onClick={() => router.push('/pest-services')}
                  className="text-emerald-400 hover:text-emerald-300 text-sm font-medium"
                >
                  View All →
                </button>
              </div>
              <div className="grid md:grid-cols-5 gap-4">
                {recentDetections.map((detection, index) => (
                  <div
                    key={index}
                    className="bg-emerald-800/30 backdrop-blur-sm rounded-xl p-4 text-center"
                  >
                    <p className="font-semibold text-sm mb-1">{detection.pest_name || 'Unknown'}</p>
                    {detection.confidence && (
                      <p className="text-xs text-white/60">
                        {Math.round(detection.confidence * 100)}% confidence
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Available Services */}
          <div className="mb-8">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold">Available Services</h2>
              <button
                onClick={() => router.push('/services')}
                className="text-emerald-400 hover:text-emerald-300 text-sm font-medium"
              >
                View All →
              </button>
            </div>
            {loading ? (
              <div className="text-center text-white/80 py-8">
                <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
                <p className="mt-2">Loading services...</p>
              </div>
            ) : services.length > 0 ? (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {services.slice(0, 6).map((service) => (
                  <div
                    key={service.id}
                    className="bg-emerald-800/30 backdrop-blur-sm rounded-xl p-6 hover:bg-emerald-800/40 transition-all duration-200 shadow-md hover:shadow-lg transform hover:-translate-y-1"
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
                    <div className="text-sm text-white/70 mb-4 space-y-1">
                      <p className="font-medium">{service.company_name}</p>
                      <p className="flex items-center gap-1">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                        {service.location}
                      </p>
                      {service.price && (
                        <p className="font-semibold text-emerald-400">₱{service.price.toLocaleString()}</p>
                      )}
                    </div>
                    <button
                      onClick={() => router.push(`/services`)}
                      className="w-full bg-[#0b2036] text-white py-2.5 rounded-lg hover:bg-[#12293b] text-center font-semibold text-sm transition-all duration-200 shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
                    >
                      CONTACT NOW
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center text-white/80 py-12 bg-emerald-800/30 backdrop-blur-sm rounded-xl">
                <svg className="w-16 h-16 mx-auto mb-4 text-white/40" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                </svg>
                <p className="text-lg mb-2">No services available yet</p>
                <p className="text-sm text-white/60">Check back soon for pest control services in your area</p>
              </div>
            )}
          </div>
        </div>
      </main>

      <div className="relative z-10 mt-auto pt-8">
        <Footer />
      </div>
    </div>
  );
}
