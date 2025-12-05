'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import Header from '../components/Header';
import Footer from '../components/Footer';
import Input from '../components/Input';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email) {
      setMessage({
        text: 'Please enter your email address',
        type: 'error',
      });
      return;
    }

    setIsSubmitting(true);
    setMessage(null);

    try {
      const response = await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (response.ok) {
        setMessage({
          text: 'If an account exists with this email, you will receive a password reset link.',
          type: 'success',
        });
        // Clear form on success
        setEmail('');
      } else {
        setMessage({
          text: data.message || 'Failed to send reset link. Please try again.',
          type: 'error',
        });
      }
    } catch (error) {
      console.error('Password reset error:', error);
      setMessage({
        text: 'An error occurred. Please try again later.',
        type: 'error',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      {/* Background Image and Overlay */}
      <div className="fixed inset-0 -z-10">
        <Image
          src="/farm pic.jpg"
          alt="Farm background"
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/40 to-transparent"></div>
      </div>

      {/* Header */}
      <div className="sticky top-0 z-50">
        <Header hideNav />
      </div>

      {/* Main Content */}
      <main className="flex-grow flex items-start justify-center px-4 pt-20 pb-10">
        <div className="w-full max-w-md p-8 rounded-2xl bg-emerald-800/30 backdrop-blur-sm mt-10">
          <h4 className="text-3xl md:text-4xl font-bold text-white text-center mb-2">
            Reset Your Password
          </h4>
          <p className="text-white/80 text-center mb-8">
            Enter your email and we'll send you a link to reset your password
          </p>

          {message && (
            <div 
              className={`mb-6 p-3 rounded text-sm ${
                message.type === 'success' 
                  ? 'bg-green-500/20 border border-green-500/50 text-green-200' 
                  : 'bg-red-500/20 border border-red-500/50 text-red-200'
              }`}
            >
              {message.text}
            </div>
          )}

          <form className="space-y-6" onSubmit={handleSubmit}>
            <div>
              <Input
                type="email"
                name="email"
                placeholder="Email address"
                className="text-lg"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={isSubmitting}
              />
            </div>
            
            <button 
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-[#0b2036] text-white py-4 rounded-lg hover:bg-[#12293b] disabled:opacity-50 disabled:cursor-not-allowed text-base font-medium transition"
            >
              {isSubmitting ? 'SENDING...' : 'SEND RESET LINK'}
            </button>

            <p className="text-center text-white/80 text-base mt-6">
              Remember your password?{' '}
              <Link 
                href="/login" 
                className="text-white hover:underline font-medium"
              >
                Back to Login
              </Link>
            </p>
          </form>
        </div>
      </main>

      {/* Footer */}
      <div className="mt-auto">
        <Footer />
      </div>
    </div>
  );
}