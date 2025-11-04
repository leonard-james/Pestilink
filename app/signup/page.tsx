import Image from 'next/image';
import Header from '../components/Header';

export default function SignupPage() {
  return (
    <div className="min-h-screen relative">
      {/* make header fixed and always on top */}
      <div className="fixed inset-x-0 top-0 z-[9999] pointer-events-auto">
        <Header />
      </div>

      {/* Background Image (visual only) */}
      <Image
        src="/farm pic.jpg"
        alt="Farm background"
        fill
        className="object-cover pointer-events-none"
        priority
      />

      {/* Overlay gradient (visual only, doesn't block clicks) */}
      <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/40 to-transparent pointer-events-none z-0"></div>

      {/* Content (modal) - add top padding so it sits below the fixed header */}
      <div className="relative z-10 min-h-screen flex items-start justify-center px-4 pt-24 pointer-events-auto">
        <div className="w-full max-w-sm p-6 rounded-2xl bg-emerald-800/30 backdrop-blur-sm">
          <h4 className="text-2xl md:text-3xl font-bold text-white text-center mb-4">Sign up to continue</h4>

          <form className="space-y-3">
            <input
              type="text"
              placeholder="Full Name"
              className="w-full px-3 py-2 rounded-lg bg-white/20 border-none text-white placeholder:text-white/60 text-sm"
            />
            <input
              type="text"
              placeholder="Username"
              className="w-full px-3 py-2 rounded-lg bg-white/20 border-none text-white placeholder:text-white/60 text-sm"
            />
            <input
              type="email"
              placeholder="Email"
              className="w-full px-3 py-2 rounded-lg bg-white/20 border-none text-white placeholder:text-white/60 text-sm"
            />
            <input
              type="tel"
              placeholder="Contact Number"
              className="w-full px-3 py-2 rounded-lg bg-white/20 border-none text-white placeholder:text-white/60 text-sm"
            />
            <input
              type="text"
              placeholder="Address"
              className="w-full px-3 py-2 rounded-lg bg-white/20 border-none text-white placeholder:text-white/60 text-sm"
            />
            <input
              type="password"
              placeholder="Password"
              className="w-full px-3 py-2 rounded-lg bg-white/20 border-none text-white placeholder:text-white/60 text-sm"
            />
            <input
              type="password"
              placeholder="Confirm Password"
              className="w-full px-3 py-2 rounded-lg bg-white/20 border-none text-white placeholder:text-white/60 text-sm"
            />
            <button 
              type="submit"
              className="w-full bg-[#0b2036] text-white py-2 rounded-lg hover:bg-[#12293b] text-sm"
            >
              SIGN UP
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}