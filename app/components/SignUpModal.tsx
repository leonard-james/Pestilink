'use client';

interface SignUpModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function SignUpModal({ isOpen, onClose }: SignUpModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="fixed inset-0 bg-black/60" onClick={onClose}></div>
      <div className="relative z-50 w-full max-w-md rounded-lg bg-white p-6">
        <button 
          onClick={onClose}
          className="absolute right-4 top-4 text-gray-500 hover:text-gray-700"
        >
          ✕
        </button>
        <h2 className="mb-4 text-2xl font-bold text-gray-900">Sign Up</h2>
        <form className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Email</label>
            <input 
              type="email"
              className="mt-1 w-full rounded-md border p-2"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Password</label>
            <input 
              type="password"
              className="mt-1 w-full rounded-md border p-2"
            />
          </div>
          <button 
            type="submit"
            className="w-full rounded-md bg-[#0b2036] py-2 text-white hover:bg-[#12293b]"
          >
            Create Account
          </button>
        </form>
      </div>
    </div>
  );
}