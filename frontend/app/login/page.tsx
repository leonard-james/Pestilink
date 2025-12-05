'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Header from '../components/Header';
import Footer from '../components/Footer';
import Input from '../components/Input';
import { useAuth } from '../hooks/useAuth';

export default function LoginPage() {
  const router = useRouter();
  const { login, isLoading, error, clearError } = useAuth();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [validationError, setValidationError] = useState<string | null>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
    setValidationError(null);
    clearError();
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // Validation
    if (!formData.email.trim()) {
      setValidationError('Email is required');
      return;
    }
    if (!formData.password) {
      setValidationError('Password is required');
      return;
    }

    try {
      await login(formData.email, formData.password);
      // Redirect to home page on successful login
      router.push('/home');
    } catch (err) {
      // Error is already set in the hook
      console.error('Login error:', err);
    }
  };

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

      <div className="relative z-10 min-h-screen flex items-start justify-center px-4 pt-20 pb-10 pointer-events-auto">
        <div className="w-full max-w-md p-8 rounded-2xl bg-emerald-800/30 backdrop-blur-sm">
          <h4 className="text-3xl md:text-4xl font-bold text-white text-center mb-8">Log in to continue</h4>

          {(error || validationError) && (
            <div className="mb-6 p-3 bg-red-500/20 border border-red-500 rounded text-red-200 text-sm">
              {error || validationError}
            </div>
          )}

          <form className="space-y-6" onSubmit={handleSubmit}>
            <Input
              type="email"
              name="email"
              placeholder="Email"
              className="text-lg"
              value={formData.email}
              onChange={handleInputChange}
              disabled={isLoading}
            />
            <div className="space-y-3">
              <Input
                type="password"
                name="password"
                placeholder="Password"
                className="text-lg"
                value={formData.password}
                onChange={handleInputChange}
                disabled={isLoading}
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
              disabled={isLoading}
              className="w-full bg-[#0b2036] text-white py-4 rounded-lg hover:bg-[#12293b] disabled:opacity-50 disabled:cursor-not-allowed text-base font-medium transition"
            >
              {isLoading ? 'LOGGING IN...' : 'LOG IN'}
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