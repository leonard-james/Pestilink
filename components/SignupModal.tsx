"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";

export default function SignupModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const router = useRouter();

  function close() {
    if (window.history.length > 1) router.back();
    else router.push("/");
  }

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    const form = e.currentTarget as HTMLFormElement;
    const fd = new FormData(form);
    const payload = {
      name: String(fd.get("name") || ""),
      email: String(fd.get("email") || ""),
      password: String(fd.get("password") || ""),
    };
    console.log("signup:", payload);
    router.push("/");
  }

  return (
    <>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          {/* Backdrop */}
          <div className="fixed inset-0 bg-black/60" onClick={onClose}></div>
          
          {/* Modal */}
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
      )}
    </>
  );
}