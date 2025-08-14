import React from 'react';

export default function ConnectionButtons({
  onStartTextChat,
  onStartVideoChat
}) {
  return (
    <div className="flex flex-col sm:flex-row gap-4 justify-center">
      <button 
        onClick={onStartTextChat}
        className="flex-1 bg-primary hover:bg-blue-600 text-white font-medium py-3 px-6 rounded-lg transition-colors flex items-center justify-center"
      >
        <i className="fas fa-comment-alt mr-2"></i>
        Start Text Chat
      </button>
      <button 
        onClick={onStartVideoChat}
        className="flex-1 bg-secondary hover:bg-pink-600 text-white font-medium py-3 px-6 rounded-lg transition-colors flex items-center justify-center"
      >
        <i className="fas fa-video mr-2"></i>
        Start Video Chat
      </button>
    </div>
  );
}