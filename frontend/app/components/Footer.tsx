import Link from 'next/link';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-800 text-white py-8">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <h3 className="text-xl font-bold mb-4">PestLink</h3>
            <p className="text-gray-300">
              Connecting you to professional pest control services for a pest-free environment.
            </p>
          </div>
          
          <div>
            <h4 className="text-lg font-semibold mb-4">Contact Us</h4>
            <address className="not-italic text-gray-300">
              <p>Email: info@pestlink.com</p>
              <p>Phone: (123) 456-7890</p>
              <p>123 Pest Control St, City</p>
            </address>
          </div>
        </div>
        
        <div className="border-t border-gray-700 mt-8 pt-6 text-center text-gray-400">
          <p>&copy; {currentYear} PestLink. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
