import { FaGithub, FaTwitter, FaInstagram } from 'react-icons/fa';
import { Link } from 'wouter';

export default function AppFooter() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-900 text-white py-8 mt-auto">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* App description */}
          <div>
            <h3 className="text-xl font-semibold mb-4 bg-gradient-to-r from-blue-400 to-purple-500 text-transparent bg-clip-text">M&U</h3>
            <p className="text-gray-300 mb-4">Connect with people from around the world through secure and anonymous text and video chats.</p>
            <div className="flex space-x-4">
              <a href="https://github.com" className="text-gray-400 hover:text-white transition-colors" target="_blank" rel="noopener noreferrer">
                <FaGithub size={20} />
              </a>
              <a href="https://twitter.com" className="text-gray-400 hover:text-white transition-colors" target="_blank" rel="noopener noreferrer">
                <FaTwitter size={20} />
              </a>
              <a href="https://instagram.com" className="text-gray-400 hover:text-white transition-colors" target="_blank" rel="noopener noreferrer">
                <FaInstagram size={20} />
              </a>
            </div>
          </div>

          {/* Quick links */}
          <div>
            <h3 className="text-xl font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/" className="text-gray-300 hover:text-white transition-colors">Home</Link>
              </li>
              <li>
                <Link href="/chat" className="text-gray-300 hover:text-white transition-colors">Text Chat</Link>
              </li>
              <li>
                <Link href="/video" className="text-gray-300 hover:text-white transition-colors">Video Chat</Link>
              </li>
              <li>
                <a href="#features" className="text-gray-300 hover:text-white transition-colors">Features</a>
              </li>
            </ul>
          </div>

          {/* Safety info */}
          <div>
            <h3 className="text-xl font-semibold mb-4">Safety First</h3>
            <p className="text-gray-300 mb-4">Your safety is our priority. Remember:</p>
            <ul className="text-gray-300 list-disc pl-5 space-y-1">
              <li>Never share personal information</li>
              <li>Report inappropriate behavior</li>
              <li>Exit any uncomfortable conversations</li>
              <li>Be respectful to others</li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
          <p>© {currentYear} M&U. All rights reserved.</p>
          <div className="mt-2 space-x-4">
            <a href="#" className="text-gray-400 hover:text-white transition-colors">Privacy Policy</a>
            <a href="#" className="text-gray-400 hover:text-white transition-colors">Terms of Service</a>
            <a href="#" className="text-gray-400 hover:text-white transition-colors">Community Guidelines</a>
          </div>
        </div>
      </div>
    </footer>
  );
}