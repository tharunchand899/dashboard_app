const BASE_URL = 'https://restcountries.com/v3.1';

/**
 * Service to handle requests to the REST Countries API.
 */
export const countryService = {
  /**
   * Fetch all countries with specific fields.
   * Fields: name, flags, cca3, region, population, capital, area
   * @returns {Promise<Array>}
   */
  getAllCountries: async () => {
    try {
      const response = await fetch(
        `${BASE_URL}/all?fields=name,flags,cca3,region,population,capital,area`
      );

      if (!response.ok) {
        throw new Error('Failed to fetch countries data.');
      }

      const data = await response.json();
      return data;
    } catch (error) {
      if (error.message === 'Failed to fetch') {
        throw new Error('Network error. Unable to connect to countries API.');
      }
      throw error;
    }
  },

  /**
   * Fetch a single country by its 3-letter code (cca3) with detail fields.
   * Fields: name, flags, cca3, region, population, capital, area, languages, currencies, timezones, borders
   * @param {string} code
   * @returns {Promise<Object>}
   */
  getCountryByCode: async (code) => {
    try {
      const response = await fetch(
        `${BASE_URL}/alpha/${code}?fields=name,flags,cca3,region,population,capital,area,languages,currencies,timezones,borders`
      );

      if (!response.ok) {
        if (response.status === 404) {
          throw new Error(`Country with code "${code}" not found.`);
        }
        throw new Error('Failed to fetch country details.');
      }

      const data = await response.json();
      return data;
    } catch (error) {
      if (error.message === 'Failed to fetch') {
        throw new Error('Network error. Unable to connect to countries API.');
      }
      throw error;
    }
  },
};
