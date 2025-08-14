import { useEffect } from 'react';
import { useLocation } from 'wouter';
import { useToast } from '@/hooks/use-toast';
import useVideoChat from '@/hooks/useVideoChat';
import { 
  ConnectionPreference, 
  Gender,
  GenderPreference
} from '@shared/schema';
import {
  VideoContainer,
  VideoOverlay,
  VideoControls
} from '@/components/VideoChatComponents';

export default function VideoChat() {
  const [, navigate] = useLocation();
  const { toast } = useToast();

  // Get preferences from sessionStorage (set on the home page)
  const storedPreference = sessionStorage.getItem('matchPreference') || 'same-country';
  const storedGender = sessionStorage.getItem('gender') || Gender.PreferNotToSay;
  const storedGenderPreference = sessionStorage.getItem('genderPreference') || GenderPreference.Any;
  
  // Cast to proper types
  const matchPreference = (
    storedPreference === ConnectionPreference.SameCountry || 
    storedPreference === ConnectionPreference.AnyCountry
  ) ? storedPreference : ConnectionPreference.SameCountry;
  
  const gender = Object.values(Gender).includes(storedGender) 
    ? storedGender 
    : Gender.PreferNotToSay;
    
  const genderPreference = Object.values(GenderPreference).includes(storedGenderPreference)
    ? storedGenderPreference
    : GenderPreference.Any;
  
  const {
    status,
    localStreamRef,
    remoteStreamRef,
    isMicOn,
    isCameraOn,
    toggleMicrophone,
    toggleCamera,
    findNextStranger,
    disconnect,
    error
  } = useVideoChat({ 
    matchPreference,
    gender,
    genderPreference
  });

  useEffect(() => {
    if (error) {
      toast({
        title: "Video Connection Error",
        description: error,
        variant: "destructive"
      });
    }
  }, [error, toast]);

  const handleEndVideoChat = () => {
    disconnect();
    navigate('/');
  };

  // Add useEffect to handle mobile viewport height
  useEffect(() => {
    // Function to set the viewport height CSS variable
    const setVh = () => {
      const vh = window.innerHeight * 0.01;
      document.documentElement.style.setProperty('--vh', `${vh}px`);
    };
    
    // Set initial value
    setVh();
    
    // Update on resize and orientation change
    window.addEventListener('resize', setVh);
    window.addEventListener('orientationchange', setVh);
    
    return () => {
      window.removeEventListener('resize', setVh);
      window.removeEventListener('orientationchange', setVh);
    };
  }, []);

  return (
    <div className="container mx-auto px-0 sm:px-4 py-0 sm:py-6 min-h-screen"
         style={{ 
           // Use the CSS variable for height on mobile
           height: 'calc(var(--vh, 1vh) * 100)',
           // Prevent overscroll/bounce
           overscrollBehavior: 'none'
         }}>
      <div className="w-full max-w-5xl mx-auto h-full">
        <div className="bg-gray-900 rounded-none sm:rounded-xl shadow-none sm:shadow-md overflow-hidden h-full">
          <div className="relative h-full sm:h-[80vh] bg-gray-800 flex items-center justify-center">
            {status !== 'connected' && (
              <VideoOverlay status={status} />
            )}

            <VideoContainer
              localStreamRef={localStreamRef}
              remoteStreamRef={remoteStreamRef}
              isCameraOn={isCameraOn}
            />

            <VideoControls
              status={status}
              isMicOn={isMicOn}
              isCameraOn={isCameraOn}
              onToggleMic={toggleMicrophone}
              onToggleCamera={toggleCamera}
              onFindNext={findNextStranger}
              onEndCall={handleEndVideoChat}
            />
          </div>
        </div>
      </div>
    </div>
  );
}