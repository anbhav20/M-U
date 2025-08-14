import { ConnectionPreference } from '@shared/schema';

export default function MatchPreferenceSelector({
  matchPreference,
  setMatchPreference,
  country,
  isLoadingCountry
}) {
  return (
    <div className="mb-8">
      <h3 className="text-lg font-medium text-gray-700 mb-3">I want to talk with people from:</h3>
      <div className="flex flex-col sm:flex-row justify-center gap-4 mb-6">
        <label 
          className={`flex items-center p-4 border rounded-lg cursor-pointer transition-colors hover:bg-gray-50 ${
            matchPreference === ConnectionPreference.SameCountry ? 'bg-blue-50 border-primary' : ''
          }`}
        >
          <input 
            type="radio" 
            name="match-preference" 
            value={ConnectionPreference.SameCountry} 
            className="hidden peer" 
            checked={matchPreference === ConnectionPreference.SameCountry}
            onChange={() => setMatchPreference(ConnectionPreference.SameCountry)}
          />
          <div className="w-6 h-6 rounded-full border-2 border-gray-400 flex items-center justify-center mr-3">
            {matchPreference === ConnectionPreference.SameCountry && (
              <div className="w-3 h-3 rounded-full bg-primary"></div>
            )}
          </div>
          <div>
            <span className="font-medium block">Same Country</span>
            <span className="text-sm text-gray-500">
              Connect with people in {isLoadingCountry ? 'loading...' : country || 'your country'}
            </span>
          </div>
        </label>
        
        <label 
          className={`flex items-center p-4 border rounded-lg cursor-pointer transition-colors hover:bg-gray-50 ${
            matchPreference === ConnectionPreference.AnyCountry ? 'bg-blue-50 border-primary' : ''
          }`}
        >
          <input 
            type="radio" 
            name="match-preference" 
            value={ConnectionPreference.AnyCountry} 
            className="hidden peer"
            checked={matchPreference === ConnectionPreference.AnyCountry}
            onChange={() => setMatchPreference(ConnectionPreference.AnyCountry)}
          />
          <div className="w-6 h-6 rounded-full border-2 border-gray-400 flex items-center justify-center mr-3">
            {matchPreference === ConnectionPreference.AnyCountry && (
              <div className="w-3 h-3 rounded-full bg-primary"></div>
            )}
          </div>
          <div>
            <span className="font-medium block">Any Country</span>
            <span className="text-sm text-gray-500">Connect with people worldwide</span>
          </div>
        </label>
      </div>
    </div>
  );
}
