import React from 'react';

export default function About() {
  return (
    <div className="container mx-auto px-4 py-6 sm:py-12">
      <div className="max-w-3xl mx-auto">
        <div className="bg-white rounded-xl shadow-md overflow-hidden">
          <div className="p-4 sm:p-8">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-800 mb-6">
              About M&U Chat
            </h2>
            <p className="text-gray-600 text-base sm:text-lg mb-4">
              M&U Chat is a free platform to meet new people worldwide anonymously. 
              Our mission is to help users connect, share thoughts, and have fun conversations safely.
            </p>
            <p className="text-gray-600 text-base sm:text-lg">
              Whether you want to make friends, practice languages, or simply chat randomly, M&U Chat offers a simple and private experience.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
