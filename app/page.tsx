import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";

export default function Home() {
  const router = useRouter();

  const handleSignUp = () => {
    router.push("/signup"); // Redirect to the sign-up page
  };

  return (
    <div className="min-h-screen w-full bg-black text-white">
      {/* Header / Nav */}
      <header className="absolute top-0 left-0 right-0 z-20">
        <nav className="mx-auto flex max-w-7xl items-center justify-between px-8 py-6">
          <div className="flex items-center gap-4">
            {/* Logo */}
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-md bg-gradient-to-br from-emerald-500 to-lime-400 flex items-center justify-center font-bold text-black">
                X
              </div>
              <div className="hidden flex-col leading-tight sm:flex">
                <span className="text-sm font-bold uppercase text-emerald-200">
                  PEST LINK
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-4">
            {/* Nav buttons (moved before search) */}
            <div className="hidden items-center gap-2 sm:flex">
              <Link
                href="#"
                className="px-3 py-2 rounded-full bg-white/5 text-sm hover:bg-white/10 transition font-bold"
              >
                Home
              </Link>
              <Link
                href="#"
                className="px-3 py-2 rounded-full bg-white/5 text-sm hover:bg-white/10 transition"
              >
                Services
              </Link>
              <Link
                href="#"
                className="px-3 py-2 rounded-full bg-white/5 text-sm hover:bg-white/10 transition"
              >
                Contact Us
              </Link>
              <SignUpButton />
            </div>

            {/* Search (now after nav buttons) */}
            <div className="relative hidden sm:flex">
              <input
                type="search"
                placeholder="Search..."
                className="h-10 w-64 rounded-full border border-white/20 bg-white/10 px-4 pr-10 placeholder:text-white/70 focus:outline-none focus:ring-2 focus:ring-emerald-400"
              />
              <div className="absolute right-3 top-1/2 -translate-y-1/2 text-white/80">
                🔍
              </div>
            </div>

            {/* Log in */}
            <Link
              href="#"
              className="flex items-center gap-2 rounded-full bg-[#0b2036] px-4 py-2 text-sm font-medium shadow-sm hover:bg-[#12293b] transition-colors"
            >
              <span className="h-6 w-6 rounded-full bg-white/10 flex items-center justify-center">
                👤
              </span>
              <span className="hidden sm:inline">Log In</span>
            </Link>
          </div>
        </nav>
      </header>

      {/* Hero */}
      <main className="relative z-10">
        <div className="relative h-screen">
          {/* Background image */}
          <Image
            src="/farm pic.jpg"
            alt="Hero background"
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

              <div className="flex items-center gap-4">
                <Link
                  href="#"
                  className="flex items-center gap-3 rounded-full bg-[#081226]/90 px-6 py-3 text-sm font-semibold shadow-lg hover:bg-[#0b2036]"
                >
                  <span>Book Now</span>
                  <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-white/10">
                    ➜
                  </span>
                </Link>

                <Link
                  href="#"
                  className="flex items-center gap-2 rounded-full border border-white/20 px-4 py-3 text-sm hover:bg-white/5"
                >
                  Learn More
                </Link>
              </div>
            </div>
          </div>

          {/* Bottom slight vignette to match screenshot */}
          <div className="absolute inset-x-0 bottom-0 h-36 bg-gradient-to-t from-black/60 to-transparent"></div>
        </div>
      </main>
    </div>
  );
}

const SignUpButton = () => {
  const router = useRouter();

  const handleSignUp = () => {
    router.push("/signup"); // Redirect to the sign-up page
  };

  return (
    <button onClick={handleSignUp}>
      Sign Up
    </button>
  );
};
