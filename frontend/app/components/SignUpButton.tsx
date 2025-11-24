'use client';

import { useRouter } from 'next/navigation';

export default function SignUpButton() {
  const router = useRouter();

  return (
    <button 
      onClick={() => router.push('/signup')}
      className="px-3 py-2 rounded-full bg-white/5 text-sm hover:bg-white/10 transition"
    >
      Sign Up
    </button>
  );
}