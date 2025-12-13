'use client';

import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import DashboardSidebar from '../../components/DashboardSidebar';
import Footer from '../../components/Footer';
import { completePestData, getPestImages, type PestData } from './complete-data';

interface FullscreenImageProps {
  images: string[];
  initialIndex: number;
  onClose: () => void;
}

const FullscreenImageViewer = ({ images, initialIndex, onClose }: FullscreenImageProps) => {
  const [currentIndex, setCurrentIndex] = useState(initialIndex);

  const goToNext = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
  };

  const goToPrevious = () => {
    setCurrentIndex((prevIndex) => (prevIndex - 1 + images.length) % images.length);
  };

  // Handle keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      } else if (e.key === 'ArrowRight') {
        goToNext();
      } else if (e.key === 'ArrowLeft') {
        goToPrevious();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  return (
    <div className="fixed inset-0 bg-black/90 z-50 flex flex-col items-center justify-center p-4">
      <button 
        onClick={onClose}
        className="absolute top-4 right-4 text-white hover:text-gray-300 text-2xl z-10"
        aria-label="Close"
      >
        ✕
      </button>
      
      <div className="relative w-full h-full flex items-center justify-center">
        <button 
          onClick={goToPrevious}
          className="absolute left-4 bg-black/50 text-white p-2 rounded-full hover:bg-black/70 z-10"
          aria-label="Previous image"
        >
          ❮
        </button>
        
        <div className="w-full h-full flex items-center justify-center p-4">
          <div className="relative" style={{ minWidth: 'min(100%, 800px)', minHeight: 'min(80vh, 600px)' }}>
            <img 
              src={images[currentIndex]} 
              alt={`Pest image ${currentIndex + 1}`}
              className="max-w-full max-h-[90vh] object-contain"
              style={{
                width: 'auto',
                height: 'auto',
                maxWidth: '100%',
                maxHeight: '90vh',
                minWidth: 'min(100%, 600px)',
                minHeight: 'min(80vh, 500px)',
                objectFit: 'contain'
              }}
            />
          </div>
        </div>
        
        <button 
          onClick={goToNext}
          className="absolute right-4 bg-black/50 text-white p-2 rounded-full hover:bg-black/70 z-10"
          aria-label="Next image"
        >
          ❯
        </button>
      </div>
      
      <div className="absolute bottom-4 flex gap-2">
        {images.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentIndex(index)}
            className={`w-3 h-3 rounded-full ${currentIndex === index ? 'bg-white' : 'bg-gray-500'}`}
            aria-label={`Go to image ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
};

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

export default function PestPage({ slug }: { slug: string }) {
  const router = useRouter();
  const pest = findPestBySlug(slug);

  const [services, setServices] = useState<Service[]>([]);
  const [loadingServices, setLoadingServices] = useState(false);
  const [pestImages, setPestImages] = useState<string[]>([]);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);

  const apiBase = (process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000').replace(/\/$/, '');

  useEffect(() => {
    if (pest?.folderName) {
      const imgs = getPestImages(pest.folderName);
      setPestImages(imgs);
      setSelectedImageIndex(0);
    }
  }, [pest]);

  useEffect(() => {
    if (pest) fetchServicesForPest(pest.name);
  }, [pest]);

  const fetchServicesForPest = async (pestName: string) => {
    setLoadingServices(true);
    try {
      const res = await fetch(`${apiBase}/api/services/suggest?pest=${encodeURIComponent(pestName)}`);
      if (res.ok) {
        const data = await res.json();
        // The API returns the services array directly, not wrapped in a 'services' property
        setServices(Array.isArray(data) ? data : []);
      } else {
        console.error('Error response:', await res.text());
        setServices([]);
      }
    } catch (err) {
      console.error('Error loading services', err);
      setServices([]);
    } finally {
      setLoadingServices(false);
    }
  };

  if (!pest) {
    return (
      <div className="min-h-screen w-full bg-black text-white flex flex-col relative">
        <DashboardSidebar />
        <main className="relative z-10 flex-1 ml-20 container mx-auto px-4 pt-24 pb-12">
          <h1 className="text-3xl font-bold mb-4">Pest not found</h1>
          <button
            onClick={() => router.push('/pest-services/pests')}
            className="px-5 py-3 bg-emerald-600 rounded-lg text-white"
          >
            Back to pests
          </button>
        </main>
        <Footer />
      </div>
    );
  }

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
      <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/40 to-transparent pointer-events-none z-0" />

      <main className="relative z-10 flex-1 ml-20 container mx-auto px-4 pt-20 pb-12">
        <div className="max-w-6xl mx-auto">
          <button
            onClick={() => router.push('/pest-services/pests')}
            className="inline-flex items-center gap-2 text-emerald-300 hover:text-emerald-200 mb-6"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to pests
          </button>

          <div className="bg-emerald-900/20 backdrop-blur-sm rounded-2xl p-8 mb-8 border border-emerald-500/20">
            <div className="flex flex-col md:flex-row gap-6 items-start">
              <div className="flex-1">
                <h1 className="text-4xl md:text-5xl font-bold mb-3">{pest.name}</h1>
                
                <p className="text-white/80 leading-relaxed">{pest.description}</p>
              </div>
              <div className="md:w-96 w-full">
                <div className="relative w-full h-64 rounded-lg overflow-hidden border border-white/10 mb-4 bg-white/5 flex items-center justify-center group">
                  {pestImages.length > 0 ? (
                    <>
                      <img
                        src={pestImages[selectedImageIndex]}
                        alt={pest.name}
                        className="w-full h-full object-cover cursor-pointer"
                        onClick={() => setIsFullscreen(true)}
                      />
                      <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <button 
                          onClick={(e) => {
                            e.stopPropagation();
                            setIsFullscreen(true);
                          }}
                          className="px-3 py-1 bg-white/90 text-black rounded-full text-sm font-medium hover:bg-white transition-colors"
                        >
                          View Fullscreen
                        </button>
                      </div>
                    </>
                  ) : (
                    <div className="text-6xl">{pest.image}</div>
                  )}
                </div>
                {pestImages.length > 1 && (
                  <div className="flex gap-2 overflow-x-auto pb-2">
                    {pestImages.map((img, idx) => (
                      <button
                        key={`${img}-${idx}`}
                        onClick={() => setSelectedImageIndex(idx)}
                        className={`flex-shrink-0 w-16 h-16 rounded border-2 overflow-hidden transition ${
                          selectedImageIndex === idx ? 'border-emerald-400' : 'border-white/20 hover:border-white/40'
                        }`}
                      >
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={img} alt={`${pest.name} ${idx + 1}`} className="w-full h-full object-cover" />
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Services Section */}
          <div className="bg-emerald-900/20 backdrop-blur-sm rounded-2xl p-8 mb-8 border border-emerald-500/20">
            <h2 className="text-2xl font-bold mb-6">Available Services for {pest.name}</h2>
            
            {loadingServices ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="bg-white/5 rounded-lg p-4 animate-pulse">
                    <div className="h-6 bg-white/10 rounded w-3/4 mb-4"></div>
                    <div className="h-4 bg-white/10 rounded w-1/2 mb-2"></div>
                    <div className="h-3 bg-white/10 rounded w-full mb-3"></div>
                    <div className="h-3 bg-white/10 rounded w-5/6 mb-4"></div>
                    <div className="h-10 bg-white/10 rounded w-full"></div>
                  </div>
                ))}
              </div>
            ) : services.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {services.map((service) => (
                  <div 
                    key={service.id} 
                    className="bg-white/5 rounded-lg overflow-hidden border border-white/10 hover:border-emerald-400/50 transition-colors cursor-pointer group"
                    onClick={(e) => {
                      e.preventDefault();
                      if (service?.id) {
                        router.push(`/services`);
                      } else {
                        console.error('Service ID is missing');
                      }
                    }}
                  >
                    <div className="h-40 bg-white/5 relative overflow-hidden">
                      {service.image ? (
                        <Image
                          src={service.image}
                          alt={service.title}
                          fill
                          className="object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-white/30">
                          <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                        </div>
                      )}
                    </div>
                    <div className="p-4">
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="text-lg font-semibold text-white group-hover:text-emerald-300 transition-colors">
                          {service.title}
                        </h3>
                        {service.price !== null && (
                          <span className="bg-emerald-500/20 text-emerald-300 text-sm font-medium px-2 py-1 rounded">
                            ₱{service.price.toLocaleString()}
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-white/70 mb-3 line-clamp-2">
                        {service.description}
                      </p>
                      <div className="flex items-center text-sm text-white/60">
                        <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                        </svg>
                        <span>{service.company_name}</span>
                      </div>
                      <button 
                        className="mt-4 w-full py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-md transition-colors text-sm font-medium"
                        onClick={(e) => {
                          e.stopPropagation();
                          if (service?.id) {
                            router.push(`/services`);
                          } else {
                            console.error('Service ID is missing');
                          }
                        }}
                      >
                        View Details & Avail
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <svg className="mx-auto h-12 w-12 text-white/30" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <h3 className="mt-2 text-lg font-medium text-white">No services available</h3>
                <p className="mt-1 text-white/60">We couldn't find any services for {pest.name}.</p>
              </div>
            )}
          </div>

          <div className="grid md:grid-cols-2 gap-6 mb-8">
            <InfoCard title="Biology" body={pest.biology} />
            <InfoCard title="Signs of Infestation" body={pest.signs} />
            <InfoCard title="Prevention" body={pest.prevention} />
            <InfoCard title="Treatment" body={pest.treatment} />
            <InfoCard title="DIY / Home Remedies" body={pest.diy} />
          </div>

          <div className="bg-emerald-900/20 backdrop-blur-sm rounded-2xl p-8 border border-emerald-500/20">
            <h2 className="text-3xl font-bold mb-4">Services for {pest.name}</h2>
            {loadingServices ? (
              <div className="text-white/80 py-6">Loading services...</div>
            ) : services.length > 0 ? (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {services.map((service) => (
                  <div
                    key={service.id}
                    className="bg-emerald-800/30 backdrop-blur-sm rounded-xl p-5 border border-white/10 hover:border-emerald-400/50 transition"
                  >
                    {service.image && (
                      <div className="w-full h-32 rounded-lg overflow-hidden mb-3">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={service.image} alt={service.title} className="w-full h-full object-cover" />
                      </div>
                    )}
                    <h3 className="text-lg font-semibold mb-1">{service.title}</h3>
                    <p className="text-sm text-white/80 line-clamp-2 mb-3">{service.description}</p>
                    <div className="text-xs text-white/70 space-y-1 mb-3">
                      <p>Company: {service.company_name}</p>
                      {service.location && <p>Location: {service.location}</p>}
                      {service.price && <p className="text-emerald-300 font-semibold">₱{service.price.toLocaleString()}</p>}
                      {service.pest_types && service.pest_types.length > 0 && (
                        <p className="text-white/60">Covers: {service.pest_types.join(', ')}</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-white/70 py-6">No services linked to this pest yet.</div>
            )}
          </div>
        </div>
      </main>

      <div className="relative z-10">
        <Footer />
      </div>

      {isFullscreen && pestImages.length > 0 && (
        <FullscreenImageViewer 
          images={pestImages}
          initialIndex={selectedImageIndex}
          onClose={() => setIsFullscreen(false)}
        />
      )}
    </div>
  );
}

function InfoCard({ title, body }: { title: string; body: string }) {
  return (
    <div className="bg-emerald-900/10 backdrop-blur-sm rounded-xl p-6 border border-white/10">
      <h2 className="text-xl font-bold text-emerald-300 mb-3">{title}</h2>
      <p className="text-white/90 leading-relaxed">{body}</p>
    </div>
  );
}

function findPestBySlug(slug: string): PestData | undefined {
  return completePestData.find((p) => p.slug === slug);
}

