import React from 'react';

export default function CommunityGuidelines() {
  return (
    <div className="container mx-auto px-4 py-6 sm:py-12">
      <div className="max-w-3xl mx-auto">
        <div className="bg-white rounded-xl shadow-md overflow-hidden">
          <div className="p-4 sm:p-8">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-800 mb-6">
              Community Guidelines
            </h2>
            <p className="text-gray-600 text-base sm:text-lg mb-4">
              To keep M&U Chat safe and enjoyable for everyone, please follow these rules:
            </p>
            <ul className="list-disc list-inside text-gray-600 space-y-2">
              <li>Respect all users and avoid harassment or abusive language.</li>
              <li>Do not share personal information such as phone numbers or addresses.</li>
              <li>Illegal activities are strictly prohibited.</li>
              <li>Report users who violate these guidelines.</li>
              <li>Remember chats are anonymous — be responsible for your behavior.</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
