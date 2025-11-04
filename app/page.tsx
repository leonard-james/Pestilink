import Image from "next/image";
import Header from "./components/Header";

export default function Home() {
  return (
    <div className="min-h-screen w-full bg-black text-white">
      <Header />

      {/* Hero */}
      <main className="relative z-10">
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

          {/* Content */}
          <div className="absolute inset-0 mx-auto flex max-w-7xl items-center px-8">
            <div className="max-w-2xl">
              <h1 className="mb-6 max-w-lg text-4xl font-extrabold leading-[1.02] tracking-tight uppercase sm:text-5xl">
                Solve your pest problems in one tap—for a pest-free Bulan!
              </h1>

              <p className="mb-8 max-w-lg text-lg text-white/80">
                Identify pests instantly, access eco-friendly DIY tips, and connect
                with trusted local pest control services —whether at home, on the
                farm, or in your business.
              </p>

            </div>
          </div>

          {/* Bottom slight vignette to match screenshot */}
          <div className="absolute inset-x-0 bottom-0 h-36 bg-gradient-to-t from-black/60 to-transparent"></div>
        </div>
      </main>
    </div>
  );
}
