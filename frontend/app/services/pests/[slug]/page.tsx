import React from 'react';
import Link from 'next/link';
import Header from '../../../components/Header';
import Footer from '../../../components/Footer';
import { pests } from '../data';

export default function PestDetail({ params }: { params: { slug: string } }) {
    const slug = params.slug;
    const pest = pests.find((p) => p.slug === slug);

    if (!pest) {
        return (
            <div className="min-h-screen w-full bg-black text-white flex flex-col">
                <Header />
                <main className="container mx-auto py-24 text-center">
                    <h1 className="text-2xl font-semibold">Pest not found</h1>
                    <p className="mt-4">No data available for "{slug}".</p>
                    <Link href="/services/pests" className="mt-6 inline-block text-emerald-300 hover:underline">
                        Back to pests
                    </Link>
                </main>
                <Footer />
            </div>
        );
    }

    return (
        <div className="min-h-screen w-full bg-black text-white flex flex-col">
            <Header />
            <main className="container mx-auto py-14 px-4">
                <div className="max-w-4xl mx-auto bg-emerald-900/10 p-8 rounded-xl flex flex-col md:flex-row items-start gap-6">
                    <div className="md:flex-1">
                        <h1 className="text-4xl font-bold mb-2">{pest.name}</h1>

                        <section>
                            <h2 className="text-lg font-medium text-emerald-300 mb-2">Description</h2>
                            <p className="text-white/90">{pest.description}</p>
                        </section>
                    </div>

                    <div className="md:w-56 md:h-56 w-full h-56 rounded-lg overflow-hidden flex-shrink-0 border border-white/10 bg-white/5 flex items-center justify-center text-6xl">
                        <span aria-hidden>{pest.image}</span>
                    </div>
                </div>

                <div className="mt-6">
                    <Link href="/services/pests" className="text-emerald-300 hover:underline">← Back to pests</Link>
                </div>
            </main>
            <Footer />
        </div>
    );
}