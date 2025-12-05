'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Header from '../components/Header';
import Footer from '../components/Footer';
import Input from '../components/Input';
import { useAuth } from '../hooks/useAuth';

export default function SignupPage() {
  const router = useRouter();
  const { register, isLoading, error, clearError } = useAuth();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    passwordConfirm: '',
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
    if (!formData.name.trim()) {
      setValidationError('Full name is required');
      return;
    }
    if (!formData.email.trim()) {
      setValidationError('Email is required');
      return;
    }
    if (!formData.password) {
      setValidationError('Password is required');
      return;
    }
    if (formData.password.length < 8) {
      setValidationError('Password must be at least 8 characters');
      return;
    }
    if (formData.password !== formData.passwordConfirm) {
      setValidationError('Passwords do not match');
      return;
    }

    try {
      await register(
        formData.name,
        formData.email,
        formData.password,
        formData.passwordConfirm
      );
      // Redirect to login on successful registration
      router.push('/login');
    } catch (err) {
      // Error is already set in the hook
      console.error('Registration error:', err);
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
        <Header />
      </div>

      {/* Main Content */}
      <main className="flex-grow flex items-start justify-center px-4 pt-20 pb-10">
        <div className="w-full max-w-md p-8 rounded-2xl bg-emerald-800/30 backdrop-blur-sm mt-10">
          <h4 className="text-3xl md:text-4xl font-bold text-white text-center mb-8">Sign up to continue</h4>

          {(error || validationError) && (
            <div className="mb-4 p-3 bg-red-500/20 border border-red-500 rounded text-red-200 text-sm">
              {error || validationError}
            </div>
          )}

          <form className="space-y-6" onSubmit={handleSubmit}>
            <Input
              type="text"
              name="name"
              placeholder="Full Name"
              value={formData.name}
              onChange={handleInputChange}
              disabled={isLoading}
            />
            <Input
              type="email"
              name="email"
              placeholder="Email"
              value={formData.email}
              onChange={handleInputChange}
              disabled={isLoading}
            />
            <Input
              type="password"
              name="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleInputChange}
              disabled={isLoading}
            />
            <Input
              type="password"
              name="passwordConfirm"
              placeholder="Confirm Password"
              value={formData.passwordConfirm}
              onChange={handleInputChange}
              disabled={isLoading}
            />
            <button 
              type="submit"
              disabled={isLoading}
              className="w-full bg-[#0b2036] text-white py-2 rounded-lg hover:bg-[#12293b] disabled:opacity-50 disabled:cursor-not-allowed text-sm font-medium transition"
            >
              {isLoading ? 'SIGNING UP...' : 'SIGN UP'}
            </button>

            <p className="text-center text-white/80 text-sm mt-4">
              Already have an account?{' '}
              <Link 
                href="/login" 
                className="text-white hover:underline font-medium"
              >
                Log In
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