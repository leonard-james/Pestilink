import Image from 'next/image';
import Link from 'next/link';


export default function SignupPage() {
  return (
    <div className="min-h-screen relative">
      {/* Navigation */}
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
                href="/"
                className="px-3 py-2 rounded-full bg-white/5 text-sm hover:bg-white/10 transition"
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
              <Link
                href="#"
                className="px-3 py-2 rounded-full bg-white/5 text-sm hover:bg-white/10 transition font-bold"
              >
                Sign Up
              </Link>
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

      {/* Background Image */}
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
      <div className="relative z-10 min-h-screen flex items-center justify-center px-4">
        <div className="w-full max-w-md p-8 rounded-2xl bg-emerald-800/30 backdrop-blur-sm">
          <h2 className="text-3xl font-bold text-white text-center mb-2">Sign up</h2>
          <p className="text-white/80 text-center mb-8">Sign up to continue</p>
          
          <form className="space-y-4">
            <input
              type="text"
              placeholder="Full Name"
              className="w-full px-4 py-3 rounded-lg bg-white/20 border-none text-white placeholder:text-white/60 focus:outline-none focus:ring-2 focus:ring-white/50"
            />
            <input
              type="email"
              placeholder="Email"
              className="w-full px-4 py-3 rounded-lg bg-white/20 border-none text-white placeholder:text-white/60 focus:outline-none focus:ring-2 focus:ring-white/50"
            />
            <input
              type="password"
              placeholder="Password"
              className="w-full px-4 py-3 rounded-lg bg-white/20 border-none text-white placeholder:text-white/60 focus:outline-none focus:ring-2 focus:ring-white/50"
            />
            <button 
              type="submit"
              className="w-full bg-[#0b2036] text-white py-3 rounded-lg hover:bg-[#12293b] transition-colors mt-4"
            >
              SIGN UP
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}