'use client';
import React, { useState, useRef } from 'react';
import Image from 'next/image';
import Header from '../../../components/Header';
import Footer from '../../../components/Footer';
import Dropdown from '../../../components/Dropdown';
import { useRouter } from 'next/navigation';

const pests = [
    {
        name: 'Ants',
        description:
            'Small social insects that form colonies ranging from a few dozen to millions. Different species (e.g., carpenter, pavement, odorous house, and fire ants) behave differently — some forage for sugary foods while others chew wood or nest in soil. Ant trails, small piles of dirt, or tiny chewed openings are common signs of infestation.',
        image: '🐜',
        prevention:
            'Keep kitchens and eating areas free of crumbs and spills; store food in sealed containers; take out garbage regularly and keep bins sealed; caulk cracks, gaps, and access points around windows, doors, and foundations; trim vegetation away from the house to reduce nesting and foraging routes.',
    },
    {
        name: 'Cockroaches',
        description:
            'Nocturnal, hardy insects that thrive in warm, humid environments and can survive on tiny amounts of food. They are known to spread bacteria and trigger allergies and asthma in sensitive individuals. Signs include droppings, shed skins, and a musty odor in heavy infestations.',
        image: '🪳',
        prevention:
            'Eliminate food and water sources by cleaning under appliances and inside cabinets; store dry goods in airtight containers; fix plumbing leaks and reduce humidity; seal cracks, vents, and gaps around pipes and walls; use traps or bait stations and consult professionals for persistent infestations.',
    },
    {
        name: 'Mosquitoes',
        description:
            'Flying insects that breed in standing water and are most active at dawn and dusk. Females bite to obtain blood for egg production and can transmit diseases (e.g., dengue, Zika, West Nile) depending on region and species. Larval habitats include gutters, birdbaths, and any container holding water.',
        image: '🦟',
        prevention:
            'Remove or regularly empty standing water (plant saucers, buckets, clogged gutters); maintain swimming pools and treat or cover compost piles; install and repair window/door screens; use repellents and wear protective clothing during peak activity; consider neighborhood source reduction for larger risk areas.',
    },
    {
        name: 'Rats',
        description:
            'Large rodents (e.g., Norway rat, roof rat) that gnaw through materials, contaminate food, and can carry diseases and parasites. They reproduce quickly and leave droppings, gnaw marks, and runways; roof rats prefer elevated areas while Norway rats favor ground-level burrows.',
        image: '🐀',
        prevention:
            'Seal holes and gaps larger than a quarter-inch with steel wool and caulk or sheet metal; store food and pet food in heavy-duty containers; keep yards tidy and remove dense vegetation and debris; secure compost and garbage bins; place traps or consult pest control professionals for active infestations.',
    },
    {
        name: 'Termites',
        description:
            'Wood-destroying insects that feed on cellulose and can cause significant, often hidden structural damage over time. Subterranean termites build mud tubes to access wood, while drywood termites live inside the wood. Infestations are often detected by discarded wings, hollow-sounding wood, or buckling paint.',
        image: '🐜',
        prevention:
            'Reduce wood-to-soil contact by keeping firewood and lumber away from the foundation; fix moisture problems (leaky plumbing, poor drainage) and maintain proper ventilation in crawl spaces; seal foundation cracks; schedule professional inspections and consider preventative soil treatments in termite-prone areas.',
    },
    {
        name: 'Flies',
        description:
            'Various species (house flies, blow flies, fruit flies) that breed in decaying organic matter, garbage, and overripe produce. Flies transfer bacteria and pathogens from waste to food surfaces and are a nuisance in kitchens and food handling areas.',
        image: '🪰',
        prevention:
            'Keep garbage cans tightly closed and clean them regularly; manage compost and pet waste correctly; store ripe produce in the refrigerator; maintain clean drains and remove food residues; install screens and use fly traps or UV light traps in commercial or heavily affected areas.',
    },
    {
        name: 'Bed Bugs',
        description:
            'Small, wingless insects that feed on human blood, usually at night. They hide in mattress seams, bed frames, furniture joints, and behind baseboards. Bites are small, itchy welts often in lines or clusters and can cause sleep disruption and stress; infestations spread via luggage, used furniture, and close living conditions.',
        image: '🛏️',
        prevention:
            'Inspect second-hand furniture and luggage before bringing items indoors; use protective, zippered covers on mattresses and box springs; reduce clutter and vacuum regularly (including crevices and seams); wash bedding in hot water and dry on high heat; engage professional treatment for confirmed infestations as DIY methods are often ineffective.',
    },
    {
        name: 'Spiders',
        description:
            'Arachnids that vary from beneficial predators to species that can pose a medical risk. Many common house spiders help reduce other pest populations, but venomous species (varies by region) require caution. Typical signs include webs in corners, basements, attics, and behind furniture.',
        image: '🕷️',
        prevention:
            'Reduce clutter and remove webs regularly; seal gaps around doors, windows, and vents to limit entry; keep outdoor lighting away from doors (lighting attracts prey which in turn attracts spiders); control other insects to reduce food sources; for venomous species sightings, consult specialists for safe removal.',
    },
    {
        name: 'Mice',
        description:
            'Small rodents that enter structures through very small openings. They contaminate food, damage insulation and wiring by gnawing, and can carry diseases. Evidence includes droppings, gnaw marks, and a musky odor in enclosed spaces.',
        image: '🐭',
        prevention:
            'Seal entry points using metal flashing, steel wool, or caulk; store food and grains in rodent-proof containers; maintain clean storage areas and reduce clutter where mice can nest; set traps along walls and near activity signs; consider professional exclusion and control for recurring problems.',
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
    const [filterType, setFilterType] = useState('');
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
            <div className="fixed inset-x-0 top-0 z-9999 pointer-events-auto">
                <Header />
            </div>

            <Image
                src="/farm pic.jpg"
                alt="Farm background"
                fill
                className="object-cover pointer-events-none"
                priority
            />

            <div className="absolute inset-0 bg-linear-to-r from-black/70 via-black/40 to-transparent pointer-events-none z-0"></div>

            <main className="relative z-10 flex-1 container mx-auto px-4 pt-28 pb-8 flex flex-col items-center justify-center">
                <div className="mb-6 w-full max-w-2xl">
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
                    {pests.filter(pest => pest.name.toLowerCase() === 'beetles').map((pest, index) => (
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
                <div className="fixed inset-0 z-99999 flex items-center justify-center">
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



