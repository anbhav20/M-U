import { FaGithub, FaTwitter, FaInstagram } from 'react-icons/fa';
import { Link } from 'wouter';

export default function AppFooter() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-900 text-white py-6 sm:py-8 mt-auto">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 sm:gap-8">
          {/* App description */}
          <div>
            <h3 className="text-lg sm:text-xl font-semibold mb-3 sm:mb-4 bg-gradient-to-r from-blue-400 to-purple-500 text-transparent bg-clip-text">M&U</h3>
            <p className="text-gray-300 text-sm sm:text-base mb-3 sm:mb-4">
              Connect with people from around the world through secure and anonymous text and video chats.
            </p>
            <div className="flex space-x-4">
              <a href="https://www.instagram.com/__anbhav/" className="text-gray-400 hover:text-white transition-colors" target="_blank" rel="noopener noreferrer">
                <FaInstagram size={18} />
              </a>
              <a href="mailto:spidey.9449@gmail.com" className="text-gray-400 hover:text-white transition-colors">
                <i className="fas fa-envelope text-lg"></i>
              </a>
            </div>
          </div>

          {/* Quick links */}
          <div>
            <h3 className="text-lg sm:text-xl font-semibold mb-3 sm:mb-4">Quick Links</h3>
            <ul className="space-y-1 sm:space-y-2 text-sm sm:text-base">
              <li><Link href="/" className="text-gray-300 hover:text-white transition-colors">Home</Link></li>
              <li><Link href="/chat" className="text-gray-300 hover:text-white transition-colors">Text Chat</Link></li>
              <li><Link href="/video" className="text-gray-300 hover:text-white transition-colors">Video Chat</Link></li>
              <li><a href="/features" className="text-gray-300 hover:text-white transition-colors">Features</a></li>
            </ul>
          </div>

          {/* Safety info */}
          <div className="sm:col-span-2 md:col-span-1">
            <h3 className="text-lg sm:text-xl font-semibold mb-3 sm:mb-4">Safety First</h3>
            <p className="text-gray-300 text-sm sm:text-base mb-2 sm:mb-3">Your safety is our priority. Remember:</p>
            <ul className="text-gray-300 text-sm sm:text-base list-disc pl-5 space-y-1">
              <li>Never share personal information</li>
              <li>Report inappropriate behavior</li>
              <li>Exit any uncomfortable conversations</li>
              <li>Be respectful to others</li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-6 sm:mt-8 pt-4 sm:pt-6 text-center text-gray-400 text-xs sm:text-sm">
          <p>© {currentYear} M&U. All rights reserved. Created By Anbhav.</p>
          <div className="mt-2 space-x-2 sm:space-x-4 flex flex-wrap justify-center">
            <Link href="/privacy-policy" className="text-gray-400 hover:text-white transition-colors">Privacy Policy</Link>
            <Link href="/terms-of-service" className="text-gray-400 hover:text-white transition-colors">Terms of Service</Link>
            <Link href="/community-guidelines" className="text-gray-400 hover:text-white transition-colors">Community Guidelines</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
