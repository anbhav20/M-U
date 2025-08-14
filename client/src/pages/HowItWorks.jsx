import React from 'react';

export default function HowItWorks() {
  return (
    <div className="container mx-auto px-4 py-6 sm:py-12">
      <div className="max-w-3xl mx-auto">
        <div className="bg-white rounded-xl shadow-md overflow-hidden">
          <div className="p-4 sm:p-8">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-800 mb-6">
              How It Works
            </h2>
            <p className="text-gray-600 text-base sm:text-lg mb-4">
              M&U Chat lets you connect anonymously with strangers via text or video chat. Here's how:
            </p>
            <ul className="list-disc list-inside text-gray-600 space-y-2">
              <li>Choose your match preference: same country or global.</li>
              <li>Select your gender and the gender you prefer to chat with.</li>
              <li>Start a text chat or video chat instantly with a random user.</li>
              <li>Chats are fully anonymous, and no messages are stored.</li>
              <li>Use filters responsibly to find compatible people.</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
