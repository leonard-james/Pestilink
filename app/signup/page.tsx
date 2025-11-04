import Image from 'next/image';
import Header from '../components/Header';

export default function SignupPage() {
  return (
    <div className="min-h-screen relative">
      {/* put header in a higher stacking context so it sits above overlay/modal */}
      <div className="relative z-[50]">
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

      {/* Content (modal) */}
      <div className="relative z-10 min-h-screen flex items-center justify-center px-4 pointer-events-auto">
        <div className="w-full max-w-md p-8 rounded-2xl bg-emerald-800/30 backdrop-blur-sm">
          <h4 className="text-3xl font-bold text-white text-center mb-2">Sign up to continue</h4>
          
          <form className="space-y-4">
            <input
              type="text"
              placeholder="Full Name"
              className="w-full px-4 py-3 rounded-lg bg-white/20 border-none text-white placeholder:text-white/60"
            />
            <input
              type="text"
              placeholder="Username"
              className="w-full px-4 py-3 rounded-lg bg-white/20 border-none text-white placeholder:text-white/60"
            />
            <input
              type="email"
              placeholder="Email"
              className="w-full px-4 py-3 rounded-lg bg-white/20 border-none text-white placeholder:text-white/60"
            />
            <input
              type="tel"
              placeholder="Contact Number"
              className="w-full px-4 py-3 rounded-lg bg-white/20 border-none text-white placeholder:text-white/60"
            />
            <input
              type="text"
              placeholder="Address"
              className="w-full px-4 py-3 rounded-lg bg-white/20 border-none text-white placeholder:text-white/60"
            />
            <input
              type="password"
              placeholder="Password"
              className="w-full px-4 py-3 rounded-lg bg-white/20 border-none text-white placeholder:text-white/60"
            />
            <button 
              type="submit"
              className="w-full bg-[#0b2036] text-white py-3 rounded-lg hover:bg-[#12293b]"
            >
              SIGN UP
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}