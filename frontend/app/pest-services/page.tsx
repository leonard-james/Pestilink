'use client';
import Image from 'next/image';
import DashboardSidebar from '../components/DashboardSidebar';
import Footer from '../components/Footer';
import Dropdown from '../components/Dropdown';
import { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';

interface Service {
  id: number;
  title: string;
  description: string;
  price: number | null;
  company_name: string;
  location: string;
  phone: string;
  email: string;
  image: string | null;
}

export default function PestClassificationPage() {
	const router = useRouter();
	const [selectedImage, setSelectedImage] = useState<File | null>(null);
	const [previewUrl, setPreviewUrl] = useState<string | null>(null);
	const [prediction, setPrediction] = useState<string>('');
	const [confidence, setConfidence] = useState<number>(0);
	const [details, setDetails] = useState<any[]>([]);
	const [isAnalyzing, setIsAnalyzing] = useState(false);
	const [modalOpen, setModalOpen] = useState(false);
	const [showDescription, setShowDescription] = useState(false);
	const [suggestedServices, setSuggestedServices] = useState<Service[]>([]);
	const [loadingServices, setLoadingServices] = useState(false);
	const fileInputRef = useRef<HTMLInputElement | null>(null);

	const handleImageUpload = async (file: File) => {
		setSelectedImage(file);
		setPreviewUrl(URL.createObjectURL(file));
		setIsAnalyzing(true);
		setPrediction('');
		setDetails([]);
		setShowDescription(false);
		setSuggestedServices([]);

		const formData = new FormData();
		formData.append('image', file);

		try {
			// Ensure API URL doesn't have double /api
			const apiBase = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
			const apiUrl = apiBase.endsWith('/api') ? `${apiBase}/pest/classify` : `${apiBase}/api/pest/classify`;
			
			const res = await fetch(apiUrl, {
				method: 'POST',
				body: formData,
			});
			
			if (!res.ok) {
				let errorData;
				const contentType = res.headers.get('content-type');
				if (contentType && contentType.includes('application/json')) {
					try {
						errorData = await res.json();
					} catch (e) {
						errorData = { error: `HTTP ${res.status}: ${res.statusText}` };
					}
				} else {
					const text = await res.text();
					errorData = { error: text || `HTTP ${res.status}: ${res.statusText}` };
				}
				console.error('Classification error:', {
					status: res.status,
					statusText: res.statusText,
					errorData,
				});
				throw new Error(errorData.error || errorData.message || `Classification failed (${res.status})`);
			}

			const data = await res.json();
			setPrediction(data?.pest_name || data?.prediction || '');
			setConfidence(data?.confidence || 0);
			setDetails(data?.details || []);
			setModalOpen(true);

			// Fetch suggested services based on the identified pest
			if (data?.pest_name || data?.prediction) {
				fetchSuggestedServices(data?.pest_name || data?.prediction);
			}
		} catch (err) {
			console.error(err);
			setPrediction('Failed to analyze image. Please try again.');
			setModalOpen(true);
		} finally {
			setIsAnalyzing(false);
		}
	};

	const fetchSuggestedServices = async (pestName: string) => {
		try {
			setLoadingServices(true);
			// Ensure API URL doesn't have double /api
			const apiBase = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
			const apiUrl = apiBase.endsWith('/api') 
				? `${apiBase}/services/suggest?pest=${encodeURIComponent(pestName)}`
				: `${apiBase}/api/services/suggest?pest=${encodeURIComponent(pestName)}`;
			
			const response = await fetch(apiUrl);
			if (response.ok) {
				const data = await response.json();
				setSuggestedServices(data.services || []);
			}
		} catch (error) {
			console.error('Error fetching suggested services:', error);
		} finally {
			setLoadingServices(false);
		}
	};

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

			<main className="relative z-10 flex-1 ml-20 peer-hover:ml-64 transition-all duration-300 container mx-auto px-4 pt-8 pb-24 min-h-[calc(100vh-200px)]">
				<div className="max-w-3xl mx-auto text-center mb-6">
					<h1 className="text-4xl font-bold mb-4">PEST Classification</h1>
					<p className="text-white/80 mb-8 max-w-2xl mx-auto">
						Search and identify pests, access management information, and find professional help.
					</p>

					{/* Search Form */}
					<form 
						onSubmit={(e) => {
							e.preventDefault();
							const formData = new FormData(e.currentTarget);
							const query = formData.get('search') as string;
							if (query?.trim()) {
								router.push(`/pest-services/search?q=${encodeURIComponent(query)}`);
							}
						}}
						className="relative max-w-2xl mx-auto mb-6"
					>
						<input
							type="text"
							name="search"
							placeholder="Type pest name or description..."
							className="w-full px-4 py-3 pr-12 rounded-lg bg-white/10 backdrop-blur-sm text-white placeholder:text-white/60 border border-white/20"
						/>
						<button 
							type="submit"
							className="absolute right-2 top-1/2 -translate-y-1/2 p-2 rounded-lg hover:bg-white/10 transition-all duration-200"
						>
							<svg
								className="w-6 h-6 text-white/80 hover:text-white transition-colors"
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

					{/* Image Upload Section */}
					<div className="bg-emerald-800/30 backdrop-blur-sm rounded-2xl p-6 mb-8">
						<div className="flex flex-col items-center">
							<div className="flex items-center justify-center gap-2 text-white/80 text-sm mb-4">
								<span>Or upload an image to identify pest using AI</span>
							</div>
							<div
								onClick={() => fileInputRef.current?.click()}
								className="w-full max-w-md border-2 border-dashed border-white/30 rounded-lg p-8 cursor-pointer hover:border-emerald-400 transition"
							>
								{previewUrl ? (
									<div className="relative w-full h-48 rounded-lg overflow-hidden mb-4">
										<img
											src={previewUrl}
											alt="Preview"
											className="w-full h-full object-cover"
										/>
									</div>
								) : (
									<>
										<svg
											className="w-16 h-16 mx-auto text-white/60 mb-4"
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
										<p className="text-white/80 mb-2">Click to upload pest image</p>
										<p className="text-white/60 text-sm">or drag and drop</p>
									</>
								)}
							</div>

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

							{isAnalyzing && (
								<div className="mt-4 text-white">
									<div className="flex items-center justify-center gap-2">
										<div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white"></div>
										<span>Analyzing image with AI...</span>
									</div>
								</div>
							)}

							<p className="text-xs text-white/60 mt-4">
								Powered by Roboflow AI
							</p>
						</div>
					</div>

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
                                }
                            }}
                        />
                    </div>
				</div>
			</main>

			{/* Result Modal */}
			{modalOpen && (
				<div className="fixed inset-0 z-[99999] flex items-center justify-center p-4">
					<div
						className="absolute inset-0 bg-black/60"
						onClick={() => {
							setModalOpen(false);
							if (previewUrl) {
								URL.revokeObjectURL(previewUrl);
								setPreviewUrl(null);
							}
						}}
					/>

					<div className="relative bg-gray-900 w-full max-w-4xl max-h-[90vh] overflow-y-auto rounded-xl p-6">
						<button
							onClick={() => {
								setModalOpen(false);
								if (previewUrl) {
									URL.revokeObjectURL(previewUrl);
									setPreviewUrl(null);
								}
							}}
							className="absolute top-4 right-4 text-white/60 hover:text-white"
						>
							<svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
								<path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
							</svg>
						</button>

						<div className="text-center mb-6">
							<h2 className="text-3xl font-bold text-white mb-2">Pest Identified!</h2>
							{prediction && (
								<div>
									<p className="text-2xl font-semibold text-emerald-400 mb-2">{prediction}</p>
									{confidence > 0 && (
										<p className="text-white/80">Confidence: {Math.round(confidence * 100)}%</p>
									)}
								</div>
							)}
						</div>

						{previewUrl && (
							<div className="flex justify-center mb-6">
								<div className="w-64 h-64 rounded-lg overflow-hidden border border-white/20">
									<img
										src={previewUrl}
										alt="Identified pest"
										className="w-full h-full object-cover"
									/>
								</div>
							</div>
						)}

						<div className="mb-6">
							<button
								onClick={() => setShowDescription((s) => !s)}
								className="w-full bg-emerald-600 hover:bg-emerald-700 text-white py-3 rounded-lg font-semibold transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
							>
								{showDescription ? 'Hide' : 'Show'} Details
							</button>

							{showDescription && details && details.length > 0 && (
								<div className="mt-4 bg-gray-800 p-4 rounded-lg">
									<h4 className="text-white font-semibold mb-2">Additional Information</h4>
									<ul className="text-sm text-white/80 list-disc pl-5 space-y-1">
										{details.map((d: any, i: number) => (
											<li key={i}>
												{d.description || d}{' '}
												{d.score ? `(${Math.round(d.score * 100)}%)` : ''}
											</li>
										))}
									</ul>
								</div>
							)}
						</div>

						{/* Suggested Services */}
						{prediction && (
							<div className="border-t border-white/20 pt-6">
								<h3 className="text-xl font-bold text-white mb-4">Recommended Services</h3>
								{loadingServices ? (
									<div className="text-center text-white/80 py-8">Loading services...</div>
								) : suggestedServices.length > 0 ? (
									<div className="grid md:grid-cols-2 gap-4">
										{suggestedServices.map((service) => (
											<div
												key={service.id}
												className="bg-emerald-800/30 backdrop-blur-sm rounded-xl p-4"
											>
												<h4 className="font-semibold text-white mb-2">{service.title}</h4>
												<p className="text-sm text-white/80 mb-2 line-clamp-2">{service.description}</p>
												<div className="text-sm text-white/70 mb-3">
													<p>{service.company_name}</p>
													<p>{service.location}</p>
													{service.price && <p className="font-semibold">₱{service.price.toLocaleString()}</p>}
												</div>
												<button
													onClick={() => router.push(`/services`)}
													className="w-full bg-[#0b2036] text-white py-2.5 rounded-lg hover:bg-[#12293b] text-center font-semibold text-sm transition-all duration-200 shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
												>
													VIEW SERVICE
												</button>
											</div>
										))}
									</div>
								) : (
									<div className="text-center text-white/80 py-8">
										No services available for this pest yet.
									</div>
								)}
							</div>
						)}
					</div>
				</div>
			)}

			<div className="relative z-10 mt-16 pt-8">
				<Footer />
			</div>
		</div>
	);
}
