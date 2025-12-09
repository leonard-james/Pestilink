'use client';
import React, { useState, useRef } from 'react';
import Image from 'next/image';
import DashboardSidebar from '../../components/DashboardSidebar';
import Footer from '../../components/Footer';
import Dropdown from '../../components/Dropdown';
import { useRouter } from 'next/navigation';

const preventionTips = [
    {
        title: 'Eliminate Food Sources',
        description: 'Keep kitchen clean, store food in airtight containers, and dispose of garbage properly.',
        icon: '🍽️',
    },
    {
        title: 'Remove Standing Water',
        description: 'Drain stagnant water from containers, gutters, and pet bowls to prevent mosquito breeding.',
        icon: '💧',
    },
    {
        title: 'Seal Entry Points',
        description: 'Caulk cracks, seal gaps around pipes, and install door sweeps to block pest entry.',
        icon: '🔒',
    },
    {
        title: 'Maintain Cleanliness',
        description: 'Vacuum regularly, wipe surfaces, and declutter to eliminate pest hiding spots.',
        icon: '🧹',
    },
    {
        title: 'Trim Vegetation',
        description: 'Cut back bushes and tree branches away from your home to reduce pest harborage.',
        icon: '✂️',
    },
    {
        title: 'Store Firewood Properly',
        description: 'Keep firewood stacks away from home and elevated off the ground.',
        icon: '🪵',
    },
];

export default function PreTipsPage() {
    const router = useRouter();
    const [selectedImage, setSelectedImage] = useState<File | null>(null);
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);
    const [prediction, setPrediction] = useState<string>('');
    const [details, setDetails] = useState<any[]>([]);
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [modalOpen, setModalOpen] = useState(false);
    const [showDescription, setShowDescription] = useState(false);
    const [filterType, setFilterType] = useState('');
    const [filterLocation, setFilterLocation] = useState('');
    const fileInputRef = useRef<HTMLInputElement | null>(null);

    const handleImageUpload = async (file: File) => {
        setSelectedImage(file);
        setPreviewUrl(URL.createObjectURL(file));
        setIsAnalyzing(true);
        setPrediction('');
        setDetails([]);
        setShowDescription(false);

        const formData = new FormData();
        formData.append('image', file);

        try {
            const res = await fetch('/api/analyze-pest', {
                method: 'POST',
                body: formData,
            });
            const data = await res.json();
            setPrediction(data?.prediction || '');
            setDetails(data?.details || []);
            setModalOpen(true);
        } catch (err) {
            console.error(err);
            setPrediction('Failed to analyze image. Please try again.');
            setModalOpen(true);
        } finally {
            setIsAnalyzing(false);
        }
    };

    return (
        <div className="min-h-screen w-full bg-black text-white flex flex-col relative">
            {/* Header (fixed) */}
            <div className="fixed inset-x-0 top-0 z-[9999] pointer-events-auto">
                <DashboardSidebar />
            </div>

            {/* Background image */}
            <Image
                src="/farm pic.jpg"
                alt="Farm background"
                fill
                className="object-cover pointer-events-none"
                priority
            />

            {/* gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/40 to-transparent pointer-events-none z-0"></div>

            <main className="relative z-10 flex-1 ml-20 peer-hover:ml-64 transition-all duration-300 container mx-auto px-4 pt-8 pb-8">
                <div className="max-w-3xl mx-auto text-center mb-6">
                    <form 
                        onSubmit={(e) => {
                            e.preventDefault();
                            const formData = new FormData(e.currentTarget);
                            const query = formData.get('search') as string;
                            if (query?.trim()) {
                                router.push(`/services/search?q=${encodeURIComponent(query)}`);
                            }
                        }}
                        className="relative max-w-2xl mx-auto mb-4"
                    >
                        <input
                            type="text"
                            name="search"
                            placeholder="Type pest name or description..."
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

                    {/* Dropdown buttons */}
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
                                } else {
                                    setFilterLocation(val);
                                }
                            }}
                        />
                    </div>

                    <div className="flex items-center justify-center gap-2 text-white/80 text-sm mb-8">
                        <span>Having trouble describing the pest? Try</span>

                        <button
                            onClick={() => fileInputRef.current?.click()}
                            className="flex items-center gap-1 text-white hover:underline"
                        >
                            Image Search
                            <svg
                                className="w-5 h-5"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="2"
                                    d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                                />
                            </svg>
                        </button>

                        <input
                            ref={fileInputRef}
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={(e) => {
                                const file = e.target.files?.[0];
                                if (file) handleImageUpload(file);
                            }}
                        />

                        <span className="text-xs opacity-60">
                            Powered by AI Pest Recognition
                        </span>
                    </div>

                    {isAnalyzing && (
                        <div className="text-white mb-4">Analyzing image...</div>
                    )}
                </div>

                {/* Prevention Tips Grid */}
                <div className="max-w-6xl mx-auto">
                    <h1 className="text-center text-3xl font-bold text-white mb-12">
                        Pest Prevention Tips
                    </h1>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {preventionTips.map((tip, index) => (
                            <div
                                key={index}
                                className="bg-emerald-800/30 backdrop-blur-sm rounded-2xl p-6 text-white hover:bg-emerald-800/40 transition-all"
                            >
                                <div className="text-4xl mb-4">{tip.icon}</div>
                                <h3 className="text-xl font-bold mb-3">{tip.title}</h3>
                                <p className="text-white/80 text-sm leading-relaxed">
                                    {tip.description}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            </main>

            {/* Result modal */}
            {modalOpen && (
                <div className="fixed inset-0 z-[99999] flex items-center justify-center">
                    <div
                        className="absolute inset-0 bg-black/60"
                        onClick={() => setModalOpen(false)}
                    />

                    <div className="relative bg-transparent w-[90vw] max-w-md rounded-xl p-6 text-center">
                        <div className="bg-white/5 backdrop-blur-md rounded-xl p-6">
                            <h2 className="text-2xl text-white font-semibold mb-2">
                                Pest Identified!
                            </h2>
                            <p className="text-white/90 mb-4">
                                {prediction}
                            </p>

                            {previewUrl && (
                                <div className="mx-auto mb-4 w-56 h-56 rounded-md overflow-hidden border border-white/20">
                                    <img
                                        src={previewUrl}
                                        alt="preview"
                                        className="w-full h-full object-cover"
                                    />
                                </div>
                            )}

                            <div className="flex flex-col gap-3">
                                <button
                                    onClick={() => setShowDescription((s) => !s)}
                                    className="mx-auto w-48 bg-transparent border-2 border-emerald-400 text-emerald-300 py-2 rounded-full text-lg font-medium hover:bg-emerald-500/10"
                                >
                                    View Description
                                </button>

                                <button
                                    onClick={() => {
                                        setModalOpen(false);
                                        setSelectedImage(null);
                                        if (previewUrl) {
                                            URL.revokeObjectURL(previewUrl);
                                            setPreviewUrl(null);
                                        }
                                    }}
                                    className="mx-auto w-32 bg-white/10 text-white py-2 rounded-md hover:bg-white/20"
                                >
                                    Close
                                </button>
                            </div>

                            {showDescription && (
                                <div className="mt-4 text-left bg-white/5 p-4 rounded-md">
                                    <h4 className="text-white font-semibold mb-2">Details</h4>
                                    {details && details.length > 0 ? (
                                        <ul className="text-sm text-white/80 list-disc pl-5 space-y-1">
                                            {details.map((d: any, i: number) => (
                                                <li key={i}>
                                                    {d.description}{' '}
                                                    {d.score
                                                        ? `(${Math.round(d.score * 100)}%)`
                                                        : ''}
                                                </li>
                                            ))}
                                        </ul>
                                    ) : (
                                        <p className="text-sm text-white/80">
                                            No additional details available.
                                        </p>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}
            <div className="relative z-10">
                <Footer />
            </div>
        </div>
    );
}