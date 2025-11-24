import Image from 'next/image';
import Link from 'next/link';
import Header from '../components/Header';
import Footer from '../components/Footer';
import Input from '../components/Input';

export default function LoginPage() {
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

      <div className="relative z-10 min-h-screen flex items-start justify-center px-4 pt-20 pointer-events-auto">
        <div className="w-full max-w-lg p-10 rounded-2xl bg-emerald-800/30 backdrop-blur-sm">
          <h4 className="text-3xl md:text-4xl font-bold text-white text-center mb-8">Log in to continue</h4>

          <form className="space-y-6">
            <Input
              type="text"
              placeholder="Username/Email"
              className="text-lg"
            />
            <div className="space-y-3">
              <Input
                type="password"
                placeholder="Password"
                className="text-lg"
              />
              <Link 
                href="/forgot-password" 
                className="text-sm text-white/80 hover:text-white block text-right"
              >
                Forgot Password?
              </Link>
            </div>
            
            <button 
              type="submit"
              className="w-full bg-[#0b2036] text-white py-4 rounded-lg hover:bg-[#12293b] text-base font-medium"
            >
              LOG IN
            </button>

            <p className="text-center text-white/80 text-base mt-6">
              Don't have an account?{' '}
              <Link 
                href="/signup" 
                className="text-white hover:underline font-medium"
              >
                Sign Up
              </Link>
            </p>
          </form>
        </div>
      </div>
      <Footer />
    </div>
  );
}