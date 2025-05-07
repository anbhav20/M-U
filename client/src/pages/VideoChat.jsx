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

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="max-w-5xl mx-auto">
        <div className="bg-gray-900 rounded-xl shadow-md overflow-hidden">
          <div className="relative h-[80vh] bg-gray-800 flex items-center justify-center">
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