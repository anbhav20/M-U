import { useState, useEffect } from 'react';
import axios from 'axios';

export default function useGeoLocation() {
  const [country, setCountry] = useState<string | null>(null);
  const [countryCode, setCountryCode] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchGeoData = async () => {
      try {
        setIsLoading(true);
        // Try to get country from our backend first
        const backendRes = await axios.get('/api/geo');
        
        if (backendRes.data && backendRes.data.country) {
          setCountry(backendRes.data.country);
          setCountryCode(backendRes.data.countryCode);
        } else {
          // Fall back to public IP API if backend fails
          const res = await axios.get('https://ipapi.co/json/');
          setCountry(res.data.country_name);
          setCountryCode(res.data.country_code);
        }
      } catch (err) {
        console.error('Error fetching geo data:', err);
        setError('Failed to detect your location');
        // Set fallback values
        setCountry('Unknown');
        setCountryCode('XX');
      } finally {
        setIsLoading(false);
      }
    };

    fetchGeoData();
  }, []);

  return { country, countryCode, isLoading, error };
}
