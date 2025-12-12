'use client';

import Image from 'next/image';
import { useRouter } from 'next/navigation';
import DashboardSidebar from '../../components/DashboardSidebar';
import Footer from '../../components/Footer';
import Dropdown from '../../components/Dropdown';
import { completePestData, getPestImages } from './complete-data';

export default function PestsPage() {
  const router = useRouter();
  const pests = [...completePestData].sort((a, b) => a.name.localeCompare(b.name));

  return (
    <div className="min-h-screen w-full bg-black text-white flex flex-col relative">
      <div className="fixed inset-x-0 top-0 z-[9999] pointer-events-auto">
        <DashboardSidebar />
      </div>

      <Image
        src="/farm pic.jpg"
        alt="Farm background"
        fill
        className="object-cover pointer-events-none"
        priority
      />

      <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/40 to-transparent pointer-events-none z-0"></div>

      <main className="relative z-10 flex-1 ml-20 peer-hover:ml-64 transition-all duration-300 container mx-auto px-4 pt-10 pb-14">
        <div className="max-w-4xl mx-auto text-center mb-6">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              const formData = new FormData(e.currentTarget);
              const query = formData.get('search') as string;
              if (query?.trim()) {
                router.push(`/pest-services/pests/${encodeURIComponent(query.trim().toLowerCase().replace(/\\s+/g, '-'))}`);
              }
            }}
            className="relative max-w-2xl mx-auto mb-4"
          >
            <input
              type="text"
              name="search"
              placeholder="Search pest by name..."
              className="w-full px-4 py-3 pr-12 rounded-lg bg-white/10 backdrop-blur-sm text-white placeholder:text-white/60 border border-white/20"
            />
            <button
              type="submit"
              className="absolute right-3 top-1/2 -translate-y-1/2"
            >
              <svg
                className="w-6 h-6 text-white/60"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </button>
          </form>

          <div className="flex gap-4 justify-center mb-6">
            <Dropdown
              title="More info"
              options={['FAQ`s', 'Pest Prevention Tips', 'Contact a Professionals']}
              onChange={(val: string) => {
                if (val === 'FAQ`s') router.push('/pest-services/faq');
                if (val === 'Pest Prevention Tips') router.push('/pest-services/pretips');
                if (val === 'Contact a Professionals') router.push('/pest-services/professionals');
              }}
            />
          </div>
        </div>

        <div className="max-w-6xl mx-auto">
          <h1 className="text-center text-3xl font-bold text-white mb-12">
            Pest Library (31)
          </h1>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {pests.map((pest) => {
              const images = getPestImages(pest.folderName);
              const firstImage = images[0];
              return (
                <button
                  key={pest.slug}
                  onClick={() => router.push(`/pest-services/pests/${pest.slug}`)}
                  className="bg-emerald-800/30 backdrop-blur-sm rounded-2xl p-6 text-white hover:bg-emerald-800/40 transition-all flex flex-col items-center cursor-pointer text-left border border-white/10"
                >
                  <div className="w-full h-40 rounded-xl overflow-hidden mb-4 bg-white/5 flex items-center justify-center border border-white/10">
                    {firstImage ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={firstImage} alt={pest.name} className="w-full h-full object-cover" />
                    ) : (
                      <span className="text-5xl">{pest.image}</span>
                    )}
                  </div>
                  <h3 className="text-xl font-bold text-center">{pest.name}</h3>
                </button>
              );
            })}
          </div>
        </div>
      </main>

      <div className="relative z-10">
        <Footer />
      </div>
    </div>
  );
}

