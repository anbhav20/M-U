import axios from "axios";

/**
 * Get country information from IP address
 * @param {string} ipAddress - The IP address to lookup
 * @returns {Promise<{country: string, countryCode: string, region?: string, city?: string}>}
 */
export async function getCountryFromIP(ipAddress) {
  try {
    // Remove port if present and handle local IPs
    const cleanIp = ipAddress.replace(/::ffff:/, '').split(':')[0];
    
    // Use localhost as US for testing local development
    if (['127.0.0.1', 'localhost', '::1'].includes(cleanIp)) {
      return {
        country: 'United States',
        countryCode: 'US',
        region: 'CA',
        city: 'Los Angeles'
      };
    }
    
    // Use ipapi.co API (no key required for basic usage)
    const response = await axios.get(`https://ipapi.co/${cleanIp}/json/`);
    
    if (response.data && response.data.country_name) {
      return {
        country: response.data.country_name,
        countryCode: response.data.country_code,
        region: response.data.region,
        city: response.data.city
      };
    }
    
    // Fallback if primary API fails - ip-api.com
    const fallbackResponse = await axios.get(`http://ip-api.com/json/${cleanIp}`);
    
    if (fallbackResponse.data && fallbackResponse.data.country) {
      return {
        country: fallbackResponse.data.country,
        countryCode: fallbackResponse.data.countryCode,
        region: fallbackResponse.data.regionName,
        city: fallbackResponse.data.city
      };
    }
    
    // If both APIs fail, return default data
    return {
      country: 'Unknown',
      countryCode: 'XX'
    };
  } catch (error) {
    console.error('Error fetching geo data:', error);
    // Return default values on error
    return {
      country: 'Unknown',
      countryCode: 'XX'
    };
  }
}