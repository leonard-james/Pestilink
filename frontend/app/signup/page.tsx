import Image from 'next/image';
import Header from '../components/Header';
import Footer from '../components/Footer';
import Input from '../components/Input';

export default function SignupPage() {
  return (
    <div className="min-h-screen relative">
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

      <div className="relative z-10 min-h-screen flex items-start justify-center px-4 pt-24 pointer-events-auto">
        <div className="w-full max-w-sm p-6 rounded-2xl bg-emerald-800/30 backdrop-blur-sm">
          <h4 className="text-2xl md:text-3xl font-bold text-white text-center mb-4">Sign up to continue</h4>

          <form className="space-y-3">
            <Input
              type="text"
              placeholder="Full Name"
            />
            <Input
              type="text"
              placeholder="Username"
            />
            <Input
              type="email"
              placeholder="Email"
            />
            <Input
              type="tel"
              placeholder="Contact Number"
            />
            <Input
              type=""
              placeholder="Address"
            />
            <Input
              type="password"
              placeholder="Password"
            />
            <Input
              type="password"
              placeholder="Confirm Password"
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
      <Footer />
    </div>
  );
}