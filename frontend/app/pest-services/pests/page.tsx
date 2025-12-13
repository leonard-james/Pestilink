'use client';

import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import DashboardSidebar from '../../components/DashboardSidebar';
import Footer from '../../components/Footer';
import Dropdown from '../../components/Dropdown';
import { completePestData, getPestImages } from './complete-data';

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
        
        <div className="max-w-full max-h-full flex items-center justify-center">
          <img 
            src={images[currentIndex]} 
            alt={`Pest image ${currentIndex + 1}`}
            className="max-w-full max-h-[90vh] object-contain"
          />
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

export default function PestsPage() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [showRecommendations, setShowRecommendations] = useState(false);
  const [fullscreenImage, setFullscreenImage] = useState<{images: string[], index: number} | null>(null);
  const [pests, setPests] = useState([...completePestData].sort((a, b) => a.name.localeCompare(b.name)));
  
  const handleDelete = async (slug: string) => {
    if (!confirm('Are you sure you want to delete this pest? This action cannot be undone.')) {
      return;
    }

    try {
      const token = localStorage.getItem('authToken');
      if (!token) {
        throw new Error('No authentication token found. Please log in again.');
      }

      console.log('Attempting to delete pest with slug:', slug);
      console.log('Using API URL:', process.env.NEXT_PUBLIC_API_URL);
      
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/pests/${slug}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        credentials: 'include', // Include cookies if your API uses them
      });
      
      const responseData = await response.json();
      console.log('Delete response:', { status: response.status, data: responseData });
      
      if (!response.ok) {
        const errorMessage = responseData?.message || 
                            responseData?.error || 
                            `Failed to delete user. Status: ${response.status} ${response.statusText}`;
        throw new Error(errorMessage);
      }

      // Update the UI by removing the deleted pest
      setPests(prevPests => prevPests.filter(pest => pest.slug !== slug));
      alert('User deleted successfully!');
      
    } catch (error) {
      console.error('Error deleting user:', error);
      const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
      console.error('Full error details:', error);
      alert(`Error: ${errorMessage}`);
    }
  };

  // Filter pests based on search query
  const filteredPests = searchQuery.trim() 
    ? pests.filter(pest => 
        pest.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        pest.description.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : pests;

  // Get recommended pests for search suggestions
  const recommendedPests = searchQuery.trim() && searchQuery.length > 1
    ? pests.filter(pest => 
        pest.name.toLowerCase().includes(searchQuery.toLowerCase())
      ).slice(0, 5)
    : [];

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      setShowRecommendations(false);
      // If there's an exact match, navigate to that pest
      const exactMatch = pests.find(pest => 
        pest.name.toLowerCase() === searchQuery.toLowerCase()
      );
      if (exactMatch) {
        router.push(`/pest-services/pests/${exactMatch.slug}`);
      }
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchQuery(value);
    setShowRecommendations(value.trim().length > 1);
  };

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
        <div className="max-w-6xl mx-auto text-center mb-6">
          <form
            onSubmit={handleSearch}
            className="relative max-w-4xl mx-auto mb-4"
          >
            <input
              type="text"
              value={searchQuery}
              onChange={handleInputChange}
              placeholder="Search pest by name..."
              className="w-full px-6 py-4 pr-16 rounded-lg bg-white/10 backdrop-blur-sm text-white placeholder:text-white/60 border border-white/20 text-lg"
              onFocus={() => setShowRecommendations(searchQuery.trim().length > 1)}
              onBlur={() => setTimeout(() => setShowRecommendations(false), 200)}
            />
            <button
              type="submit"
              className="absolute right-4 top-1/2 -translate-y-1/2 hover:bg-white/10 p-2 rounded-full transition-colors"
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
            
            {/* Search Recommendations */}
            {showRecommendations && recommendedPests.length > 0 && (
              <div className="absolute top-full left-0 right-0 mt-2 bg-gray-800/95 backdrop-blur-sm rounded-lg border border-white/20 shadow-xl z-50">
                <div className="p-2">
                  <div className="text-xs text-gray-400 px-3 py-2 border-b border-white/10">
                    Recommended Results
                  </div>
                  {recommendedPests.map((pest) => (
                    <button
                      key={pest.slug}
                      onClick={() => {
                        router.push(`/pest-services/pests/${pest.slug}`);
                        setShowRecommendations(false);
                      }}
                      className="w-full flex items-center gap-3 px-3 py-3 hover:bg-white/10 rounded-lg transition-colors text-left"
                    >
                      <div className="w-10 h-10 rounded-lg overflow-hidden bg-white/5 flex-shrink-0">
                        {getPestImages(pest.folderName)[0] ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img 
                            src={getPestImages(pest.folderName)[0]} 
                            alt={pest.name} 
                            className="w-full h-full object-cover" 
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-xs">
                            {pest.image}
                          </div>
                        )}
                      </div>
                      <div>
                        <div className="text-white font-medium">{pest.name}</div>
                        <div className="text-xs text-gray-400 truncate max-w-xs">
                          {pest.description.substring(0, 60)}...
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}
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
            Pest Library ({filteredPests.length})
            {searchQuery && (
              <span className="block text-lg font-normal text-gray-300 mt-2">
                {filteredPests.length > 0 
                  ? `Found ${filteredPests.length} result${filteredPests.length !== 1 ? 's' : ''} for "${searchQuery}"`
                  : `No results found for "${searchQuery}"`
                }
              </span>
            )}
          </h1>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredPests.map((pest) => {
              const images = getPestImages(pest.folderName);
              // Use second image for Stripe Rice Stem Borer, first image for others
              const firstImage = pest.name === 'Stripe Rice Stem Borer' && images[1] ? images[1] : images[0];
              return (
                <div
                  key={pest.slug}
                  onClick={() => router.push(`/pest-services/pests/${pest.slug}`)}
                  className="bg-emerald-800/30 backdrop-blur-sm rounded-2xl p-6 text-white hover:bg-emerald-800/40 transition-all flex flex-col items-center cursor-pointer text-left border border-white/10"
                >
                  <div className="w-full h-40 rounded-xl overflow-hidden mb-4 bg-white/5 flex items-center justify-center border border-white/10 relative group">
                    {firstImage ? (
                      <>
                        <img 
                          src={firstImage} 
                          alt={pest.name} 
                          className="w-full h-full object-cover cursor-pointer"
                          onClick={() => setFullscreenImage({ images: images, index: 0 })}
                        />
                        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                          <button 
                            onClick={(e) => {
                              e.stopPropagation();
                              setFullscreenImage({ images: images, index: 0 });
                            }}
                            className="px-3 py-1 bg-white/90 text-black rounded-full text-sm font-medium hover:bg-white transition-colors"
                          >
                            View Fullscreen
                          </button>
                        </div>
                      </>
                    ) : (
                      <span className="text-5xl">{pest.image}</span>
                    )}
                  </div>
                  <h3 className="text-xl font-bold text-center">{pest.name}</h3>
                </div>
              );
            })}
          </div>
        </div>
      </main>

      <div className="relative z-10">
        <Footer />
      </div>

      {fullscreenImage && (
        <FullscreenImageViewer 
          images={fullscreenImage.images}
          initialIndex={fullscreenImage.index}
          onClose={() => setFullscreenImage(null)}
        />
      )}
    </div>
  );
}

