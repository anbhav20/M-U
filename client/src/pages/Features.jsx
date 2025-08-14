import React from 'react';

export default function Features() {
  return (
    <div className="container mx-auto px-4 py-6 sm:py-12">
      <div className="max-w-3xl mx-auto">
        <div className="bg-white rounded-xl shadow-md overflow-hidden">
          <div className="p-4 sm:p-8">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-800 mb-6">
              Features
            </h2>
            <ul className="list-disc list-inside text-gray-600 space-y-2">
              <li>Anonymous text and video chat.</li>
              <li>Filters: gender preference and country-based matching.</li>
              <li>No chat history is stored.</li>
              <li>Mobile friendly and responsive design.</li>
              <li>Instant connection with strangers worldwide.</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
