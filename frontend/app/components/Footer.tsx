import Link from 'next/link';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="relative bg-black/40 backdrop-blur-md text-white py-12 border-t border-white/20">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-6xl mx-auto">
          <div>
            <h3 className="text-2xl font-bold mb-4 text-white [text-shadow:_0_1px_2px_rgb(0_0_0_/_40%)]">PestLink</h3>
            <p className="text-white/90 max-w-md [text-shadow:_0_1px_1px_rgb(0_0_0_/_50%)]">
              Connecting you to professional pest control services for a pest-free environment.
            </p>
          </div>
          
          <div className="md:text-right">
            <h4 className="text-lg font-semibold mb-4 text-white [text-shadow:_0_1px_2px_rgb(0_0_0_/_40%)]">Contact Us</h4>
            <address className="not-italic text-white/90 space-y-1 [text-shadow:_0_1px_1px_rgb(0_0_0_/_50%)]">
              <p>Email: info@pestlink.com</p>
              <p>Phone: (123) 456-7890</p>
              <p>123 Pest Control St, City</p>
            </address>
          </div>
        </div>
        
        <div className="border-t border-white/20 mt-12 pt-6 text-center text-white/80 [text-shadow:_0_1px_1px_rgb(0_0_0_/_50%)]">
          <p>&copy; {currentYear} PestLink. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
