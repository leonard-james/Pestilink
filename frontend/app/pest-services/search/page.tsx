'use client';
import React, { useState, useEffect, Suspense } from 'react';
import Image from 'next/image';
import { useSearchParams, useRouter } from 'next/navigation';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import Dropdown from '../../components/Dropdown';

// Component to handle pest images with fallback
function PestImage({ src, fallback, alt }: { src: string; fallback: string; alt: string }) {
    const [imgSrc, setImgSrc] = useState(src);
    
    useEffect(() => {
        setImgSrc(src);
    }, [src]);

    return (
        <img
            src={imgSrc}
            alt={alt}
            className="w-full h-full object-cover"
            onError={() => {
                if (imgSrc !== fallback) {
                    setImgSrc(fallback);
                }
            }}
        />
    );
}

// Extended pest data with photos
// Note: Add specific pest images to /public/pests/ folder with these filenames
const pestsData = [
    {
        name: 'Ants',
        description: 'Small insects that form colonies and are attracted to food sources. Common types include carpenter ants, fire ants, and sugar ants. They can enter homes through tiny cracks and are often found near food sources.',
        image: '🐜',
        photo: '/pests/ants.jpg', // Add ants.jpg to /public/pests/ folder
        fallbackPhoto: '/pest.webp',
        prevention: 'Keep food sealed, clean up spills immediately, and seal entry points.',
        habitat: 'Kitchens, pantries, gardens, and areas with food debris',
    },
    {
        name: 'Cockroaches',
        description: 'Nocturnal insects that thrive in warm, moist environments. They can carry diseases and contaminate food. Cockroaches are known for their resilience and ability to survive in various conditions.',
        image: '🪳',
        photo: '/pests/cockroaches.jpg', // Add cockroaches.jpg to /public/pests/ folder
        fallbackPhoto: '/pest.webp',
        prevention: 'Maintain cleanliness, fix leaks, and seal cracks and crevices.',
        habitat: 'Bathrooms, kitchens, basements, and areas with moisture',
    },
    {
        name: 'Mosquitoes',
        description: 'Flying insects that breed in standing water. They can transmit diseases like dengue and malaria. Female mosquitoes bite to obtain blood for egg production.',
        image: '🦟',
        photo: '/pests/mosquitoes.jpg', // Add mosquitoes.jpg to /public/pests/ folder
        fallbackPhoto: '/pest.webp',
        prevention: 'Remove standing water, use screens on windows, and apply repellent.',
        habitat: 'Areas with standing water, gardens, and outdoor spaces',
    },
    {
        name: 'Rats',
        description: 'Rodents that can cause property damage and spread diseases. They reproduce quickly and are active at night. Rats can chew through wires, insulation, and wood.',
        image: '🐀',
        photo: '/pests/rats.jpg', // Add rats.jpg to /public/pests/ folder
        fallbackPhoto: '/pest.webp',
        prevention: 'Seal entry points, store food properly, and maintain cleanliness.',
        habitat: 'Attics, basements, walls, and areas with food sources',
    },
    {
        name: 'Termites',
        description: 'Wood-destroying insects that can cause significant structural damage. They work silently and are often undetected until damage is severe. Termites feed on cellulose found in wood.',
        image: '🐜',
        photo: '/pests/termites.jpg', // Add termites.jpg to /public/pests/ folder
        fallbackPhoto: '/pest.webp',
        prevention: 'Keep wood away from foundation, fix moisture problems, and schedule regular inspections.',
        habitat: 'Wooden structures, soil, and areas with moisture',
    },
    {
        name: 'Flies',
        description: 'Common household pests that can contaminate food and spread bacteria. They are attracted to garbage and decaying matter. Flies can lay hundreds of eggs in a short time.',
        image: '🪰',
        photo: '/pests/flies.jpg', // Add flies.jpg to /public/pests/ folder
        fallbackPhoto: '/pest.webp',
        prevention: 'Keep garbage covered, clean regularly, and use screens on doors and windows.',
        habitat: 'Kitchens, garbage areas, and places with organic waste',
    },
    {
        name: 'Bed Bugs',
        description: 'Small, blood-feeding insects that hide in mattresses and furniture. They cause itchy bites and are difficult to eliminate. Bed bugs are excellent hitchhikers and can spread quickly.',
        image: '🛏️',
        photo: '/pests/bedbugs.jpg', // Add bedbugs.jpg to /public/pests/ folder
        fallbackPhoto: '/pest.webp',
        prevention: 'Inspect second-hand furniture, use protective covers on mattresses, and vacuum regularly.',
        habitat: 'Mattresses, bed frames, furniture, and cracks in walls',
    },
    {
        name: 'Spiders',
        description: 'Arachnids that can be beneficial by eating other pests, but some species are venomous and can be a nuisance. Most spiders are harmless to humans.',
        image: '🕷️',
        photo: '/pests/spiders.jpg', // Add spiders.jpg to /public/pests/ folder
        fallbackPhoto: '/pest.webp',
        prevention: 'Reduce clutter, seal entry points, and remove webs regularly.',
        habitat: 'Corners, basements, attics, and dark areas',
    },
    {
        name: 'Mice',
        description: 'Small rodents that can enter through tiny openings. They contaminate food and can cause property damage. Mice reproduce rapidly and can establish large populations quickly.',
        image: '🐭',
        photo: '/pests/mice.jpg', // Add mice.jpg to /public/pests/ folder
        fallbackPhoto: '/pest.webp',
        prevention: 'Seal entry points, store food in airtight containers, and set traps if needed.',
        habitat: 'Walls, attics, kitchens, and areas with food sources',
    },
];

function SearchContent() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const [searchQuery, setSearchQuery] = useState('');
    const [searchResults, setSearchResults] = useState<any[]>([]);
    const [hasSearched, setHasSearched] = useState(false);

    useEffect(() => {
        const query = searchParams.get('q') || '';
        setSearchQuery(query);
        // Only show results if there's a query parameter (user came from another page with search)
        if (query.trim()) {
            setHasSearched(true);
            const filtered = pestsData.filter((pest) =>
                pest.name.toLowerCase().includes(query.toLowerCase()) ||
                pest.description.toLowerCase().includes(query.toLowerCase()) ||
                pest.habitat.toLowerCase().includes(query.toLowerCase())
            );
            setSearchResults(filtered);
        } else {
            setHasSearched(false);
            setSearchResults([]);
        }
    }, [searchParams]);

    const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        const query = formData.get('search') as string;
        
        if (query?.trim()) {
            setSearchQuery(query);
            setHasSearched(true);
            // Update URL without navigation
            router.push(`/pest-services/search?q=${encodeURIComponent(query)}`, { scroll: false });
            
            // Perform search
            const filtered = pestsData.filter((pest) =>
                pest.name.toLowerCase().includes(query.toLowerCase()) ||
                pest.description.toLowerCase().includes(query.toLowerCase()) ||
                pest.habitat.toLowerCase().includes(query.toLowerCase())
            );
            setSearchResults(filtered);
        }
    };

    return (
        <div className="min-h-screen w-full bg-black text-white flex flex-col relative">
            <div className="fixed inset-x-0 top-0 z-[9999] pointer-events-auto">
                <Header />
            </div>

            <Image
                src="/farm pic.jpg"
                alt="Farm background"
                fill
                className="object-cover pointer-events-none"
                priority
            />

            <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/40 to-transparent pointer-events-none z-0"></div>

            <main className="relative z-10 flex-1 container mx-auto px-4 pt-28 pb-8">
                <div className="max-w-3xl mx-auto text-center mb-6">
                    <form onSubmit={handleSearch} className="relative max-w-2xl mx-auto mb-4">
                        <input
                            type="text"
                            name="search"
                            placeholder="Type pest name or description..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
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
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="2"
                                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                                />
                            </svg>
                        </button>
                    </form>

                    <div className="flex gap-4 justify-center mb-6">
                        <Dropdown
                            title="Identifying pests"
                            options={['Pests', 'FAQ`s']}
                            onChange={(val: string) => {
                                if (val === 'Pests') {
                                    router.push('/pest-services/pests');
                                } else if (val === 'FAQ`s') {
                                    router.push('/pest-services/faq');
                                }
                            }}
                        />

                        <Dropdown
                            title="Pest management information"
                            options={['Contact a Professionals', 'Pest Prevention Tips']}
                            onChange={(val: string) => {
                                if (val === 'Contact a Professionals') {
                                    router.push('/pest-services/professionals');
                                } else if (val === 'Pest Prevention Tips') {
                                    router.push('/pest-services/pretips');
                                }
                            }}
                        />
                    </div>
                </div>

                <div className="max-w-6xl mx-auto">
                    {hasSearched && searchQuery ? (
                        <>
                            <h1 className="text-2xl font-bold text-white mb-6">
                                Search Results for "{searchQuery}"
                            </h1>
                            {searchResults.length > 0 ? (
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    {searchResults.map((pest, index) => (
                                        <div
                                            key={index}
                                            className="bg-emerald-800/30 backdrop-blur-sm rounded-2xl overflow-hidden hover:bg-emerald-800/40 transition-all"
                                        >
                                            <div className="relative h-48 w-full">
                                                <PestImage
                                                    src={pest.photo}
                                                    fallback={pest.fallbackPhoto}
                                                    alt={pest.name}
                                                />
                                                <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent"></div>
                                                <div className="absolute bottom-4 left-4 right-4">
                                                    <div className="text-4xl mb-2">{pest.image}</div>
                                                    <h2 className="text-2xl font-bold text-white">
                                                        {pest.name}
                                                    </h2>
                                                </div>
                                            </div>
                                            <div className="p-6">
                                                <p className="text-white/80 text-sm leading-relaxed mb-4">
                                                    {pest.description}
                                                </p>
                                                <div className="space-y-3">
                                                    <div>
                                                        <p className="text-xs text-white/70 font-semibold mb-1">
                                                            Habitat:
                                                        </p>
                                                        <p className="text-xs text-white/80">{pest.habitat}</p>
                                                    </div>
                                                    <div className="pt-3 border-t border-white/20">
                                                        <p className="text-xs text-white/70 font-semibold mb-1">
                                                            Prevention:
                                                        </p>
                                                        <p className="text-xs text-white/80">{pest.prevention}</p>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="text-center py-12">
                                    <p className="text-white/60 text-lg mb-2">No pests found</p>
                                    <p className="text-white/40 text-sm">
                                        Try searching with different keywords
                                    </p>
                                </div>
                            )}
                        </>
                    ) : (
                        <div className="text-center py-12">
                            <p className="text-white/60 text-lg mb-2">Enter a search query to find pests</p>
                            <p className="text-white/40 text-sm">
                                Type a pest name or description and press Enter or click the search button
                            </p>
                        </div>
                    )}
                </div>
            </main>

            <div className="relative z-10">
                <Footer />
            </div>
        </div>
    );
}

export default function SearchPage() {
    return (
        <Suspense fallback={
            <div className="min-h-screen w-full bg-black text-white flex items-center justify-center">
                <p className="text-white/60">Loading...</p>
            </div>
        }>
            <SearchContent />
        </Suspense>
    );
}

