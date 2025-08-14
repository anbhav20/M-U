import React from 'react';

export default function TermsOfService() {
  return (
    <div className="container mx-auto px-4 py-6 sm:py-12">
      <div className="max-w-3xl mx-auto">
        <div className="bg-white rounded-xl shadow-md overflow-hidden">
          <div className="p-4 sm:p-8">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-800 mb-6">
              Terms of Service
            </h2>
            <p className="text-gray-600 text-base sm:text-lg mb-4">
              By accessing or using M&U Chat, you agree to the following terms:
            </p>
            <ul className="list-disc list-inside text-gray-600 space-y-2">
              <li>All chats are anonymous; respect other users and do not share personal info.</li>
              <li>Do not use our service for illegal activities or harassment.</li>
              <li>We reserve the right to suspend or block users violating our rules.</li>
              <li>We do not store chat data, so no history is maintained.</li>
            </ul>
            <p className="text-gray-600 text-base sm:text-lg mt-4">
              These Terms may be updated occasionally. Using our service means you accept the latest Terms of Service.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
