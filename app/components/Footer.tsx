'use client';

import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-black/80 border-t border-gray-700 px-8 py-8">
      <div className="mx-auto max-w-7xl">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          <div>
            <h3 className="font-bold text-lg mb-4">PestLink</h3>
            <p className="text-gray-400 text-sm">Your one-tap solution to pest problems.</p>
          </div>
          <div>
            <h4 className="font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2 text-sm text-gray-400">
              <li><Link href="/" className="hover:text-white">Home</Link></li>
              <li><Link href="/services" className="hover:text-white">Services</Link></li>
              <li><Link href="/about" className="hover:text-white">About</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-4">Contact Us</h4>
            <ul className="space-y-2 text-sm text-gray-400">
              <li><a href="mailto:info@pestlink.com" className="hover:text-white">info@pestlink.com</a></li>
              <li><a href="tel:+1234567890" className="hover:text-white">+63 9123 456 789</a></li>
              <li><p>Zone 8, Bulan Sorsogon, Philippines</p></li>
            </ul>
          </div>
        </div>
        <div className="border-t border-gray-700 pt-6 text-center text-sm text-gray-500">
          <p>&copy; 2025 PestLink. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}