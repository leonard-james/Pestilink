'use client';

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import DashboardSidebar from "../components/DashboardSidebar";
import Footer from "../components/Footer";

export default function HomePage() {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userRole, setUserRole] = useState<string | null>(null);

  useEffect(() => {
    const token = typeof window !== 'undefined' ? localStorage.getItem('authToken') : null;
    const userStr = typeof window !== 'undefined' ? localStorage.getItem('authUser') : null;
    
    if (token && userStr) {
      setIsAuthenticated(true);
      try {
        const user = JSON.parse(userStr);
        setUserRole(user.role);
        
        // Redirect authenticated users to their dashboard
        if (user.role === 'farmer') {
          router.push('/dashboard/farmer');
        } else if (user.role === 'company') {
          router.push('/dashboard/company');
        } else if (user.role === 'admin') {
          router.push('/admin');
        }
      } catch (e) {
        console.error('Error parsing user data:', e);
      }
    }
  }, [router]);

  return (
    <div className="min-h-screen flex flex-col bg-black text-white">
      <DashboardSidebar />

      {/* Hero Section */}
      <section className="relative min-h-screen flex flex-col ml-20 peer-hover:ml-64 transition-all duration-300">
        <Image
          src="/farm pic.jpg"
          alt="Farm field"
          fill
          className="object-cover"
          priority
        />
        
        {/* Overlay gradient */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/40 to-transparent" />
        
        {/* Hero Content */}
        <div className="relative h-full flex items-center">
          <div className="container mx-auto px-6">
            <div className="max-w-3xl">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-6 text-white">
                Protect Your Crops with Precision
              </h1>
              <p className="text-xl md:text-2xl text-gray-200 leading-relaxed">
                Advanced pest detection and management solutions for modern farmers. Get real-time insights and protect your harvest.
              </p>
              <div className="mt-8 flex gap-4">
                <button
                  onClick={() => router.push('/pest-services')}
                  className="px-8 py-4 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-lg transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                >
                  Start Detection
                </button>
                <button
                  onClick={() => router.push('/services')}
                  className="px-8 py-4 bg-white/10 hover:bg-white/20 backdrop-blur-sm text-white font-semibold rounded-lg border border-white/20 transition-all duration-200"
                >
                  Browse Services
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-gray-900">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Why Choose PestLink?</h2>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto">
              Our platform offers comprehensive solutions for all your pest management needs.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="bg-gray-800 p-8 rounded-xl text-center">
              <div className="w-16 h-16 bg-emerald-600 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-3">Accurate Detection</h3>
              <p className="text-gray-300">
                Advanced AI technology for precise pest identification and monitoring.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="bg-gray-800 p-8 rounded-xl text-center">
              <div className="w-16 h-16 bg-emerald-600 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-3">Real-time Monitoring</h3>
              <p className="text-gray-300">
                Get instant alerts and updates on pest activity in your fields.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="bg-gray-800 p-8 rounded-xl text-center">
              <div className="w-16 h-16 bg-emerald-600 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-3">Fast Response</h3>
              <p className="text-gray-300">
                Quick identification leads to faster, more effective pest control.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-emerald-700 py-16">
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">Ready to protect your crops?</h2>
          <p className="text-xl text-emerald-100 mb-8 max-w-2xl mx-auto">
            Start using PestLink today and experience the future of pest management.
          </p>
        </div>
      </section>

      {/* Footer */}
      <div className="mt-auto pt-8">
        <Footer />
      </div>
    </div>
  );
}
