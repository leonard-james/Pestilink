import Image from "next/image";
import Header from "./components/Header";
import Footer from "./components/Footer";

export default function Home() {
  return (
    <div className="min-h-screen w-full bg-black text-white flex flex-col">
      <Header />

      {/* Hero */}
      <main className="relative z-10 flex-1">
        <div className="relative h-screen">
          {/* Background image */}
          <Image
            src="/farm pic.jpg"
            alt="Farm background"
            fill
            className="object-cover"
            priority
          />

          {/* Overlay gradient */}
          <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/40 to-transparent"></div>

          {/* Content - Centered */}
          <div className="absolute inset-0 mx-auto flex max-w-7xl items-center justify-center px-8">
            <div className="text-center max-w-2xl flex flex-col items-center">
              
              {/* Title Box */}
              <div className="mb-6 bg-gray-600/30 px-8 py-6 rounded-lg">
                <h1 className="text-3xl font-extrabold leading-tight tracking-tight uppercase sm:text-4xl">
                  Solve your pest problems in one tap
                </h1>
              </div>

              {/* Description Box */}
              <div className="mb-8 bg-gray-600/30 px-8 py-4 rounded-lg max-w-md">
                <p className="text-base text-white leading-relaxed">
                  Identify pests instantly, access eco-friendly DIY tips, and connect
                  with trusted local pest control services.
                </p>
              </div>

              {/* Get Started Button */}
              <button
                className="px-8 py-3 bg-gray-500 hover:bg-gray-600 text-white font-semibold rounded-full transition"
              >
                Get Started →
              </button>

            </div>
          </div>

          {/* Bottom slight vignette to match screenshot */}
          <div className="absolute inset-x-0 bottom-0 h-36 bg-gradient-to-t from-black/60 to-transparent"></div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
