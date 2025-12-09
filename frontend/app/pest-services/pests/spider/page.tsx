'use client';
import React, { useState, useRef } from 'react';
import Image from 'next/image';
import DashboardSidebar from '../../../components/DashboardSidebar';
import Footer from '../../../components/Footer';
import Dropdown from '../../../components/Dropdown';
import { useRouter } from 'next/navigation';

const pests = [
    {
        name: 'Spiders',
        description:
            'Arachnids that vary from beneficial predators to species that can pose a medical risk. Many common house spiders help reduce other pest populations, but venomous species (varies by region) require caution. Typical signs include webs in corners, basements, attics, and behind furniture.',
        image: '🕷️',
        prevention:
            'Reduce clutter and remove webs regularly; seal gaps around doors, windows, and vents to limit entry; keep outdoor lighting away from doors (lighting attracts prey which in turn attracts spiders); control other insects to reduce food sources; for venomous species sightings, consult specialists for safe removal.',
    },
];

export default function PestsPage() {
    const router = useRouter();
    const [selectedImage, setSelectedImage] = useState<File | null>(null);
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);
    const [prediction, setPrediction] = useState<string>('');
    const [details, setDetails] = useState<any[]>([]);
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [modalOpen, setModalOpen] = useState(false);
    const [showDescription, setShowDescription] = useState(false);
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
            <div className="fixed inset-x-0 top-0 z-50 pointer-events-auto">
                <DashboardSidebar />
            </div>

            <Image
                src="/farm pic.jpg"
                alt="Farm background"
                fill
                className="object-cover pointer-events-none"
                priority
            />

            <div className="absolute inset-0 bg-linear-to-r from-black/70 via-black/40 to-transparent pointer-events-none z-0"></div>

            <main className="relative z-10 flex-1 container mx-auto px-4 pt-8 ml-20 peer-hover:ml-64 transition-all duration-300 pb-8 flex flex-col items-center justify-center">
                <div className="mb-6">
                    <button
                        onClick={() => router.back()}
                        className="text-emerald-300 hover:text-emerald-200 transition flex items-center gap-2"
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                        </svg>
                        Back to Pests
                    </button>
                </div>

                <div className="max-w-2xl w-full">
                    {pests.filter(pest => pest.name.toLowerCase() === 'spiders').map((pest, index) => (
                        <div
                            key={index}
                            className="bg-emerald-800/30 backdrop-blur-sm rounded-2xl p-8 text-white"
                        >
                            <div className="text-7xl mb-6 text-center">{pest.image}</div>
                            <h1 className="text-4xl font-bold mb-6 text-center">{pest.name}</h1>
                            
                            <div className="space-y-6">
                                <section>
                                    <h2 className="text-xl font-semibold text-emerald-300 mb-3">Description</h2>
                                    <p className="text-white/90 leading-relaxed">
                                        {pest.description}
                                    </p>
                                </section>

                                <section className="pt-4 border-t border-white/20">
                                    <h2 className="text-xl font-semibold text-emerald-300 mb-3">Prevention Tips</h2>
                                    <p className="text-white/90 leading-relaxed">
                                        {pest.prevention}
                                    </p>
                                </section>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="mt-12 max-w-3xl mx-auto w-full text-center">
                    <h3 className="text-lg text-white/80 mb-6">Having trouble identifying a pest?</h3>
                    <button
                        onClick={() => fileInputRef.current?.click()}
                        className="inline-flex items-center gap-2 px-6 py-3 bg-emerald-600 hover:bg-emerald-700 rounded-lg text-white font-medium transition"
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        Image Search
                    </button>
                    <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*"
                        className="hidden" aria-label="Upload pest image for identification" onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) handleImageUpload(file);
                        }}
                    />
                    <p className="text-xs text-white/60 mt-2">Powered by AI Pest Recognition</p>
                </div>
            </main>

            {/* Result modal */}
            {modalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center">
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
                                {prediction ? (
                                    <span className="text-lg font-medium">{prediction}</span>
                                ) : (
                                    <span className="text-sm">No clear identification</span>
                                )}
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


