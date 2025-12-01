'use client';
import React, { useState } from 'react';
import Image from 'next/image';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import Dropdown from '../../components/Dropdown';
import { useRouter } from 'next/navigation';

const faqs = [
    {
        question: 'How do I identify common pests?',
        answer: 'You can use our AI-powered pest identification tool by uploading a photo, or search for pests by name or description. Common pests include ants, cockroaches, mosquitoes, rats, and termites.',
    },
    {
        question: 'What should I do if I find pests in my home?',
        answer: 'First, identify the pest using our identification tool. Then, check our prevention tips page for DIY solutions. For severe infestations, contact a professional pest control service through our professionals page.',
    },
    {
        question: 'Are pest control treatments safe for pets and children?',
        answer: 'Most modern pest control treatments are designed to be safe when applied correctly. However, always inform your pest control professional about pets and children in your home. They can recommend pet-safe and child-safe treatment options.',
    },
    {
        question: 'How often should I schedule pest control services?',
        answer: 'It depends on your location and the type of pests. Generally, quarterly treatments (every 3 months) are recommended for preventive maintenance. High-risk areas or active infestations may require monthly treatments.',
    },
    {
        question: 'Can I prevent pests without using chemicals?',
        answer: 'Yes! Many pests can be prevented through proper sanitation, sealing entry points, removing standing water, and maintaining cleanliness. Check our Pest Prevention Tips page for eco-friendly solutions.',
    },
    {
        question: 'What is the difference between pest control and pest extermination?',
        answer: 'Pest control focuses on managing and preventing pest populations, while extermination aims to completely eliminate them. Control is often more sustainable and focuses on long-term prevention.',
    },
    {
        question: 'How quickly can I get pest control service?',
        answer: 'Response times vary by service provider. Most professionals can schedule visits within 24-48 hours. For emergencies, some providers offer same-day service. Contact professionals directly through our platform.',
    },
    {
        question: 'Do I need to prepare my home before pest control treatment?',
        answer: 'Yes, preparation helps ensure effective treatment. Common preparations include cleaning, removing food items, covering or moving furniture, and ensuring access to infested areas. Your service provider will give specific instructions.',
    },
];

export default function FAQPage() {
    const router = useRouter();
    const [openIndex, setOpenIndex] = useState<number | null>(null);
    const [filterType, setFilterType] = useState('');

    const toggleFAQ = (index: number) => {
        setOpenIndex(openIndex === index ? null : index);
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

                <div className="max-w-4xl mx-auto">
                    <h1 className="text-center text-3xl font-bold text-white mb-12">
                        Frequently Asked Questions
                    </h1>
                    <div className="space-y-4">
                        {faqs.map((faq, index) => (
                            <div
                                key={index}
                                className="bg-emerald-800/30 backdrop-blur-sm rounded-2xl overflow-hidden transition-all"
                            >
                                <button
                                    onClick={() => toggleFAQ(index)}
                                    className="w-full px-6 py-4 text-left flex items-center justify-between hover:bg-emerald-800/40 transition-colors"
                                >
                                    <span className="text-lg font-semibold text-white pr-4">
                                        {faq.question}
                                    </span>
                                    <svg
                                        className={`w-6 h-6 text-white flex-shrink-0 transition-transform ${
                                            openIndex === index ? 'rotate-180' : ''
                                        }`}
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth="2"
                                            d="M19 9l-7 7-7-7"
                                        />
                                    </svg>
                                </button>
                                {openIndex === index && (
                                    <div className="px-6 pb-4">
                                        <p className="text-white/80 leading-relaxed">
                                            {faq.answer}
                                        </p>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            </main>

            <div className="relative z-10">
                <Footer />
            </div>
        </div>
    );
}

