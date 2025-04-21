import React from 'react';
import { Link } from 'wouter';

export default function AppHeader() {
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);

  return (
    <header className="bg-white shadow-sm">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <Link href="/">
          <div className="flex items-center space-x-2 cursor-pointer">
            <i className="fas fa-comments text-primary text-2xl"></i>
            <h1 className="text-2xl font-bold text-gray-800">M&U</h1>
          </div>
        </Link>

        <div className="hidden md:flex items-center space-x-4">
          <a href="#" className="text-gray-600 hover:text-primary transition-colors">How it works</a>
          <a href="#" className="text-gray-600 hover:text-primary transition-colors">About</a>
          <a href="#" className="text-gray-600 hover:text-primary transition-colors">FAQ</a>
        </div>

        <div className="md:hidden">
          <button 
            className="text-gray-600 focus:outline-none"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            <i className={`fas ${mobileMenuOpen ? 'fa-times' : 'fa-bars'} text-xl`}></i>
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white shadow-md">
          <div className="px-4 py-3 space-y-2">
            <a href="#" className="block text-gray-600 hover:text-primary transition-colors py-2">How it works</a>
            <a href="#" className="block text-gray-600 hover:text-primary transition-colors py-2">About</a>
            <a href="#" className="block text-gray-600 hover:text-primary transition-colors py-2">FAQ</a>
          </div>
        </div>
      )}
    </header>
  );
}
