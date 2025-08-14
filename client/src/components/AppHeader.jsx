import React, { useState } from 'react';
import { Link } from 'wouter';
import { useOnlineUsers } from '@/contexts/OnlineUsersContext';

export default function AppHeader() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { onlineUsers } = useOnlineUsers();

  return (
    <header className="bg-white shadow-sm">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <Link href="/">
          <div className="flex items-center space-x-2 cursor-pointer">
            <i className="fas fa-comments text-primary text-2xl"></i>
            <h1 className="text-2xl font-bold text-gray-800">M&U</h1>
          </div>
        </Link>

        <div className="hidden md:flex items-center space-x-6">
          <div className="flex items-center text-green-600">
            <span className="inline-block w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse"></span>
            <span className="text-sm font-medium">{onlineUsers} {onlineUsers === 1 ? 'user' : 'users'} online</span>
          </div>
          <a href="/how-it-works" className="text-gray-600 hover:text-primary transition-colors">How it works</a>
  <a href="/about" className="text-gray-600 hover:text-primary transition-colors">About</a>
        </div>

        <div className="md:hidden flex items-center">
          <div className="flex items-center text-green-600 mr-4">
            <span className="inline-block w-2 h-2 bg-green-500 rounded-full mr-1 animate-pulse"></span>
            <span className="text-xs font-medium">{onlineUsers}</span>
          </div>
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
            <a href="/how-it-works" className="block text-gray-600 hover:text-primary transition-colors py-2">How it works</a>
            <a href="/about" className="block text-gray-600 hover:text-primary transition-colors py-2">About</a>
          </div>
        </div>
      )}
      
    </header>
  );
}
