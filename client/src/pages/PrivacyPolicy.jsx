import React from 'react';

export default function PrivacyPolicy() {
  return (
    <div className="container mx-auto px-4 py-6 sm:py-12">
      <div className="max-w-3xl mx-auto">
        <div className="bg-white rounded-xl shadow-md overflow-hidden">
          <div className="p-4 sm:p-8">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-800 mb-6">
              Privacy Policy
            </h2>
            <p className="text-gray-600 text-base sm:text-lg mb-4">
              Welcome to M&U Chat! Your privacy is important to us. Here's how we handle your information:
            </p>
            <ul className="list-disc list-inside text-gray-600 space-y-2">
              <li>We do <strong>not save chat messages</strong>. All chats are anonymous.</li>
              <li>We use filters like gender and country only for matching purposes.</li>
              <li>Your personal information is <strong>not shared with third parties</strong>.</li>
              <li>We may use cookies or local storage for preferences and session management.</li>
            </ul>
            <p className="text-gray-600 text-base sm:text-lg mt-4">
              By using M&U Chat, you agree to this Privacy Policy. Please use our service responsibly.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
