import Image from 'next/image';
import Header from '../components/Header';

export default function SignupPage() {
  return (
    <div className="min-h-screen relative">
      <Header />
      
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
              className="w-full px-4 py-3 rounded-lg bg-white/20 border-none text-white placeholder:text-white/60"
            />
            <input
              type="username"
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
              type="addess"
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