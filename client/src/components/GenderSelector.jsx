import React from 'react';
import { Gender, GenderPreference } from '@shared/schema';

export default function GenderSelector({
  gender,
  setGender,
  genderPreference,
  setGenderPreference
}) {
  return (
    <div className="mb-6 bg-gray-50 p-6 rounded-lg">
      <h3 className="text-lg font-medium text-gray-900 mb-4">Gender Preferences</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Gender selection */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Your Gender
          </label>
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => setGender(Gender.Male)}
              className={`px-4 py-2 text-sm rounded-md ${
                gender === Gender.Male
                  ? 'bg-primary text-white'
                  : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
              }`}
            >
              Male
            </button>
            <button
              type="button"
              onClick={() => setGender(Gender.Female)}
              className={`px-4 py-2 text-sm rounded-md ${
                gender === Gender.Female
                  ? 'bg-primary text-white'
                  : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
              }`}
            >
              Female
            </button>
            <button
              type="button"
              onClick={() => setGender(Gender.NonBinary)}
              className={`px-4 py-2 text-sm rounded-md ${
                gender === Gender.NonBinary
                  ? 'bg-primary text-white'
                  : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
              }`}
            >
              Non-Binary
            </button>
            <button
              type="button"
              onClick={() => setGender(Gender.PreferNotToSay)}
              className={`px-4 py-2 text-sm rounded-md ${
                gender === Gender.PreferNotToSay
                  ? 'bg-primary text-white'
                  : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
              }`}
            >
              Prefer Not to Say
            </button>
          </div>
        </div>

        {/* Gender preference selection */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            You Want to Chat With
          </label>
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => setGenderPreference(GenderPreference.Male)}
              className={`px-4 py-2 text-sm rounded-md ${
                genderPreference === GenderPreference.Male
                  ? 'bg-primary text-white'
                  : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
              }`}
            >
              Males
            </button>
            <button
              type="button"
              onClick={() => setGenderPreference(GenderPreference.Female)}
              className={`px-4 py-2 text-sm rounded-md ${
                genderPreference === GenderPreference.Female
                  ? 'bg-primary text-white'
                  : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
              }`}
            >
              Females
            </button>
            <button
              type="button"
              onClick={() => setGenderPreference(GenderPreference.Both)}
              className={`px-4 py-2 text-sm rounded-md ${
                genderPreference === GenderPreference.Both
                  ? 'bg-primary text-white'
                  : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
              }`}
            >
              Males & Females
            </button>
            <button
              type="button"
              onClick={() => setGenderPreference(GenderPreference.Any)}
              className={`px-4 py-2 text-sm rounded-md ${
                genderPreference === GenderPreference.Any
                  ? 'bg-primary text-white'
                  : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
              }`}
            >
              Anyone
            </button>
          </div>
        </div>
      </div>
      
      <div className="mt-4 text-sm text-gray-500">
        Gender preference helps you connect with the types of people you want to chat with.
      </div>
    </div>
  );
}
