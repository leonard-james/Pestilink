'use client';

import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import DashboardSidebar from '../../components/DashboardSidebar';
import Footer from '../../components/Footer';
import { completePestData, getPestImages, type PestData } from './complete-data';

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
        setServices(data.services || []);
      }
    } catch (err) {
      console.error('Error loading services', err);
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
                <div className="relative w-full h-64 rounded-lg overflow-hidden border border-white/10 mb-4 bg-white/5 flex items-center justify-center">
                  {pestImages.length > 0 ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={pestImages[selectedImageIndex]}
                      alt={pest.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="text-6xl">{pest.image}</div>
                  )}
                </div>
                {pestImages.length > 1 && (
                  <div className="flex gap-2 overflow-x-auto pb-2">
                    {pestImages.map((img, idx) => (
                      <button
                        key={img}
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

