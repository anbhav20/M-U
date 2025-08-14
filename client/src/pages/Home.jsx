import { useState, useEffect } from 'react';
import { useLocation } from 'wouter';
import MatchPreferenceSelector from '@/components/MatchPreferenceSelector';
import GenderSelector from '@/components/GenderSelector';
import ConnectionButtons from '@/components/ConnectionButtons';
import FeatureHighlights from '@/components/FeatureHighlights';
import useGeoLocation from '@/hooks/useGeoLocation';
import { 
  ConnectionPreference, 
  Gender,
  GenderPreference
} from '@shared/schema';

export default function Home() {
  const [matchPreference, setMatchPreference] = useState(ConnectionPreference.SameCountry);
  const [gender, setGender] = useState(Gender.PreferNotToSay); 
  const [genderPreference, setGenderPreference] = useState(GenderPreference.Any);
  const [location, navigate] = useLocation();
  const { country, isLoading: isLoadingCountry } = useGeoLocation();

  // Load saved preferences from sessionStorage if they exist
  useEffect(() => {
    const savedGender = sessionStorage.getItem('gender');
    const savedGenderPref = sessionStorage.getItem('genderPreference');
    
    if (savedGender) {
      setGender(savedGender);
    }
    
    if (savedGenderPref) {
      setGenderPreference(savedGenderPref);
    }
  }, []);

  const handleStartTextChat = () => {
    // Store all preferences in sessionStorage to persist across pages
    sessionStorage.setItem('matchPreference', matchPreference);
    sessionStorage.setItem('gender', gender);
    sessionStorage.setItem('genderPreference', genderPreference);
    navigate('/chat');
  };

  const handleStartVideoChat = () => {
    // Store all preferences in sessionStorage to persist across pages
    sessionStorage.setItem('matchPreference', matchPreference);
    sessionStorage.setItem('gender', gender);
    sessionStorage.setItem('genderPreference', genderPreference);
    navigate('/video');
  };

  return (
    <div className="container mx-auto px-4 py-6 sm:py-12">
      <div className="max-w-3xl mx-auto">
        <div className="bg-white rounded-xl shadow-md overflow-hidden">
          <div className="p-4 sm:p-8">
            <div className="text-center mb-6 sm:mb-8">
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-800 mb-3 sm:mb-4">Meet Strangers Across the World</h2>
              <p className="text-gray-600 text-base sm:text-lg mb-4 sm:mb-6">Connect anonymously with people through text or video chat. Choose your matching preferences and start talking!</p>
            </div>

            <MatchPreferenceSelector 
              matchPreference={matchPreference}
              setMatchPreference={setMatchPreference}
              country={country}
              isLoadingCountry={isLoadingCountry}
            />

            <GenderSelector 
              gender={gender}
              setGender={setGender}
              genderPreference={genderPreference}
              setGenderPreference={setGenderPreference}
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