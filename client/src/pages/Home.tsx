import { useState, useEffect } from 'react';
import { useLocation } from 'wouter';
import MatchPreferenceSelector from '@/components/MatchPreferenceSelector';
import ConnectionButtons from '@/components/ConnectionButtons';
import FeatureHighlights from '@/components/FeatureHighlights';
import useGeoLocation from '@/hooks/useGeoLocation';
import { ConnectionPreference, ConnectionPreferenceType } from '@shared/schema';

export default function Home() {
  const [matchPreference, setMatchPreference] = useState<ConnectionPreferenceType>(ConnectionPreference.SameCountry);
  const [location, navigate] = useLocation();
  const { country, isLoading: isLoadingCountry } = useGeoLocation();

  const handleStartTextChat = () => {
    // Store preferences in sessionStorage to persist across pages
    sessionStorage.setItem('matchPreference', matchPreference);
    navigate('/chat');
  };

  const handleStartVideoChat = () => {
    // Store preferences in sessionStorage to persist across pages
    sessionStorage.setItem('matchPreference', matchPreference);
    navigate('/video');
  };

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-3xl mx-auto">
        <div className="bg-white rounded-xl shadow-md overflow-hidden">
          <div className="p-8">
            <div className="text-center mb-8">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">Meet Strangers Across the World</h2>
              <p className="text-gray-600 text-lg mb-6">Connect anonymously with people through text or video chat. Choose your matching preferences and start talking!</p>
            </div>

            <MatchPreferenceSelector 
              matchPreference={matchPreference}
              setMatchPreference={setMatchPreference}
              country={country}
              isLoadingCountry={isLoadingCountry}
            />

            <ConnectionButtons 
              onStartTextChat={handleStartTextChat}
              onStartVideoChat={handleStartVideoChat}
            />
          </div>
        </div>

        <FeatureHighlights />
      </div>
    </div>
  );
}
