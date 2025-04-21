import React from 'react';

export default function FeatureHighlights() {
  return (
    <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
      <div className="bg-white p-6 rounded-lg shadow-sm">
        <div className="text-primary mb-4">
          <i className="fas fa-lock text-3xl"></i>
        </div>
        <h3 className="font-bold text-xl mb-2">Anonymous & Secure</h3>
        <p className="text-gray-600">Your identity remains private. We don't store your conversations or personal data.</p>
      </div>
      <div className="bg-white p-6 rounded-lg shadow-sm">
        <div className="text-primary mb-4">
          <i className="fas fa-globe text-3xl"></i>
        </div>
        <h3 className="font-bold text-xl mb-2">Global Connection</h3>
        <p className="text-gray-600">Talk to people from around the world or stay connected with those in your country.</p>
      </div>
      <div className="bg-white p-6 rounded-lg shadow-sm">
        <div className="text-primary mb-4">
          <i className="fas fa-random text-3xl"></i>
        </div>
        <h3 className="font-bold text-xl mb-2">Find New People</h3>
        <p className="text-gray-600">Don't like your match? Just click "Next" to find another stranger instantly.</p>
      </div>
    </div>
  );
}
