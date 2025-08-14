import React from 'react';

export function VideoOverlay({ status }) {
  const getMessage = () => {
    switch (status) {
      case 'waiting':
        return 'Looking for someone to video chat with...';
      case 'disconnected':
        return 'Disconnected. Start a new chat to continue.';
      default:
        return 'Connection error. Please try again.';
    }
  };

  return (
    <div className="absolute inset-0 flex items-center justify-center z-20 bg-gray-900 bg-opacity-70">
      <div className="text-center p-6">
        <div className="inline-block mb-4">
          <div className="w-16 h-16 rounded-full border-4 border-t-status-waiting border-gray-700 animate-spin"></div>
        </div>
        <h3 className="text-white text-xl font-medium mb-2">{getMessage()}</h3>
        <p className="text-gray-300">Please wait while we connect you with a stranger</p>
      </div>
    </div>
  );
}

export function VideoContainer({ localStreamRef, remoteStreamRef, isCameraOn }) {
  return (
    <div className="flex flex-col md:flex-row w-full h-full">
      {/* Stranger's video (full size) */}
      <div className="relative flex-1 bg-gray-800">
        <video 
          ref={remoteStreamRef}
          className="w-full h-full object-cover" 
          autoPlay 
          playsInline
        ></video>
        
        {/* When not connected */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-gray-400 text-4xl sm:text-6xl">
            <i className="fas fa-user-circle"></i>
          </div>
        </div>

        {/* User's video (picture-in-picture) */}
        <div className="absolute bottom-4 right-4 w-28 h-24 sm:w-48 sm:h-36 bg-gray-700 rounded-lg overflow-hidden shadow-lg">
          {isCameraOn ? (
            <video 
              ref={localStreamRef}
              className="w-full h-full object-cover" 
              autoPlay 
              playsInline 
              muted
            ></video>
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gray-800">
              <i className="fas fa-video-slash text-gray-400 text-sm sm:text-xl"></i>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export function VideoControls({
  status,
  isMicOn,
  isCameraOn,
  onToggleMic,
  onToggleCamera,
  onFindNext,
  onEndCall
}) {
  const getStatusColor = () => {
    switch (status) {
      case 'connected': return 'bg-status-connected';
      case 'waiting': return 'bg-status-waiting';
      default: return 'bg-status-error';
    }
  };

  const getStatusText = () => {
    switch (status) {
      case 'connected': return 'Connected';
      case 'waiting': return 'Looking for a match...';
      default: return 'Disconnected';
    }
  };

  return (
    <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black to-transparent p-2 sm:p-4">
      <div className="flex justify-between items-center">
        <div>
          <span className="text-white text-xs sm:text-sm font-medium flex items-center">
            <span className={`w-2 h-2 rounded-full ${getStatusColor()} inline-block mr-1 sm:mr-2`}></span>
            <span>{getStatusText()}</span>
          </span>
        </div>
        <div className="flex space-x-2 sm:space-x-4">
          <button 
            onClick={onToggleMic}
            className={`w-8 h-8 sm:w-10 sm:h-10 ${isMicOn ? 'bg-gray-700' : 'bg-red-600'} rounded-full flex items-center justify-center text-white hover:bg-gray-600 transition-colors`}
          >
            <i className={`fas ${isMicOn ? 'fa-microphone' : 'fa-microphone-slash'} text-xs sm:text-base`}></i>
          </button>
          <button 
            onClick={onToggleCamera}
            className={`w-8 h-8 sm:w-10 sm:h-10 ${isCameraOn ? 'bg-gray-700' : 'bg-red-600'} rounded-full flex items-center justify-center text-white hover:bg-gray-600 transition-colors`}
          >
            <i className={`fas ${isCameraOn ? 'fa-video' : 'fa-video-slash'} text-xs sm:text-base`}></i>
          </button>
          <button 
            onClick={onFindNext}
            className="w-8 h-8 sm:w-10 sm:h-10 bg-yellow-600 rounded-full flex items-center justify-center text-white hover:bg-yellow-700 transition-colors"
            disabled={status === 'disconnected'}
          >
            <i className="fas fa-random text-xs sm:text-base"></i>
          </button>
          <button 
            onClick={onEndCall}
            className="w-8 h-8 sm:w-10 sm:h-10 bg-red-600 rounded-full flex items-center justify-center text-white hover:bg-red-700 transition-colors"
          >
            <i className="fas fa-phone-slash text-xs sm:text-base"></i>
          </button>
        </div>
      </div>
    </div>
  );
}
