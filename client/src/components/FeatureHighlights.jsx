import React from 'react';

export default function FeatureHighlights() {
  return (
    <div id="features" className="mt-8 sm:mt-12 grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
      <div className="bg-white p-4 sm:p-6 rounded-lg shadow-sm">
        <div className="text-primary mb-3 sm:mb-4">
          <i className="fas fa-lock text-2xl sm:text-3xl"></i>
        </div>
        <h3 className="font-bold text-lg sm:text-xl mb-1 sm:mb-2">Anonymous & Secure</h3>
        <p className="text-gray-600 text-sm sm:text-base">Your identity remains private. We don't store your conversations or personal data.</p>
      </div>
      <div className="bg-white p-4 sm:p-6 rounded-lg shadow-sm">
        <div className="text-primary mb-3 sm:mb-4">
          <i className="fas fa-globe text-2xl sm:text-3xl"></i>
        </div>
        <h3 className="font-bold text-lg sm:text-xl mb-1 sm:mb-2">Global Connection</h3>
        <p className="text-gray-600 text-sm sm:text-base">Talk to people from around the world or stay connected with those in your country.</p>
      </div>
      <div className="bg-white p-4 sm:p-6 rounded-lg shadow-sm">
        <div className="text-primary mb-3 sm:mb-4">
          <i className="fas fa-random text-2xl sm:text-3xl"></i>
        </div>
        <h3 className="font-bold text-lg sm:text-xl mb-1 sm:mb-2">Find New People</h3>
        <p className="text-gray-600 text-sm sm:text-base">Don't like your match? Just click "Next" to find another stranger instantly.</p>
      </div>
    </div>
  );
}
