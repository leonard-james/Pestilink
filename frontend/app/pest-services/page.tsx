'use client';

import Image from 'next/image';
import { useRouter } from 'next/navigation';
import DashboardSidebar from '../components/DashboardSidebar';
import Footer from '../components/Footer';

export default function PestServicesLanding() {
  const router = useRouter();

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

      <main className="relative z-10 flex-1 ml-20 peer-hover:ml-64 transition-all duration-300 container mx-auto px-4 pt-12 pb-24">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold mb-4">Pest Management Hub</h1>
            <p className="text-white/80 max-w-3xl mx-auto">
              Browse the pest library, read prevention and treatment guidance, and connect to services tagged for each pest. No image uploads or AIeverything is based on the curated dataset.
            </p>
            <div className="mt-6 flex flex-wrap gap-4 justify-center">
              <button
                onClick={() => router.push('/pest-services/pests')}
                className="px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-semibold transition"
              >
                Browse Pests
              </button>
              <button
                onClick={() => router.push('/services')}
                className="px-6 py-3 bg-white/10 hover:bg-white/20 text-white rounded-lg font-semibold transition"
              >
                View Services
              </button>
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-6 mb-12">
            <div className="bg-emerald-800/30 backdrop-blur-sm rounded-xl p-6 border border-white/10">
              <h3 className="text-xl font-semibold mb-2">Pest Library</h3>
              <p className="text-sm text-white/80">31 pests with description, biology, signs, prevention, treatment, and DIY tips.</p>
              <button
                onClick={() => router.push('/pest-services/pests')}
                className="mt-4 text-emerald-300 hover:text-emerald-200 text-sm font-semibold"
              >
                Open library 
              </button>
            </div>
            <div className="bg-emerald-800/30 backdrop-blur-sm rounded-xl p-6 border border-white/10">
              <h3 className="text-xl font-semibold mb-2">Tagged Services</h3>
              <p className="text-sm text-white/80">Company services are tagged to pests and surface automatically on each pest page.</p>
              <button
                onClick={() => router.push('/services')}
                className="mt-4 text-emerald-300 hover:text-emerald-200 text-sm font-semibold"
              >
                See services 
              </button>
            </div>
            <div className="bg-emerald-800/30 backdrop-blur-sm rounded-xl p-6 border border-white/10">
              <h3 className="text-xl font-semibold mb-2">Book & Track</h3>
              <p className="text-sm text-white/80">Book a service from a pest page and track approval from your dashboard.</p>
              <button
                onClick={() => router.push('/dashboard/farmer')}
                className="mt-4 text-emerald-300 hover:text-emerald-200 text-sm font-semibold"
              >
                Go to dashboard 
              </button>
            </div>
          </div>

          <div className="bg-emerald-900/20 border border-emerald-500/20 rounded-2xl p-8">
            <h2 className="text-2xl font-bold mb-4">Quick Navigation</h2>
            <div className="grid md:grid-cols-2 gap-4">
              <button
                onClick={() => router.push('/pest-services/pests/american-cockroach')}
                className="w-full text-left bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg px-4 py-3 transition"
              >
                American Cockroach
              </button>
              <button
                onClick={() => router.push('/pest-services/pests/rice-bug')}
                className="w-full text-left bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg px-4 py-3 transition"
              >
                Rice Bug
              </button>
              <button
                onClick={() => router.push('/pest-services/pests/termite')}
                className="w-full text-left bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg px-4 py-3 transition"
              >
                Termite
              </button>
              <button
                onClick={() => router.push('/pest-services/pests/mosquito')}
                className="w-full text-left bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg px-4 py-3 transition"
              >
                Mosquito
              </button>
            </div>
          </div>
        </div>
      </main>

      <div className="relative z-10">
        <Footer />
      </div>
    </div>
  );
}
