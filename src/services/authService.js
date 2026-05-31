const API_URL = 'https://reqres.in/api';

/**
 * Service to handle authentication requests using Reqres API.
 * Integrates a mock fallback if Reqres API keys are missing or requests fail.
 */
export const authService = {
  /**
   * Log in a user.
   * @param {string} email
   * @param {string} password
   * @param {string} apiKey
   * @returns {Promise<{token: string, isMock?: boolean}>}
   */
  login: async (email, password, apiKey = '') => {
    // Retrieve key from parameter or fallback to localStorage
    const key = apiKey || localStorage.getItem('wanderlog_reqres_api_key') || '';

    try {
      const headers = {
        'Content-Type': 'application/json',
      };
      if (key) {
        headers['x-api-key'] = key;
      }

      const response = await fetch(`${API_URL}/login`, {
        method: 'POST',
        headers,
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        // If API key is missing or unauthorized, and we are using the demo account, fallback
        const isApiKeyError = data.error === 'missing_api_key' || response.status === 401;
        if (isApiKeyError && email === 'eve.holt@reqres.in') {
          console.warn('Reqres API key missing or unauthorized. Using local mock fallback for demo account.');
          return { token: 'mock_token_eve_holt', isMock: true };
        }
        throw new Error(data.error || 'Login failed. Please check your credentials.');
      }

      return data;
    } catch (error) {
      // If there is any network error, fallback for demo credentials
      if (email === 'eve.holt@reqres.in') {
        console.warn('Network or API key error. Using local mock fallback:', error.message);
        return { token: 'mock_token_eve_holt', isMock: true };
      }
      throw error;
    }
  },

  /**
   * Register a new user.
   * @param {string} email
   * @param {string} password
   * @param {string} apiKey
   * @returns {Promise<{id: number, token: string, isMock?: boolean}>}
   */
  register: async (email, password, apiKey = '') => {
    const key = apiKey || localStorage.getItem('wanderlog_reqres_api_key') || '';

    try {
      const headers = {
        'Content-Type': 'application/json',
      };
      if (key) {
        headers['x-api-key'] = key;
      }

      const response = await fetch(`${API_URL}/register`, {
        method: 'POST',
        headers,
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        const isApiKeyError = data.error === 'missing_api_key' || response.status === 401;
        if (isApiKeyError && email === 'eve.holt@reqres.in') {
          return { id: 4, token: 'mock_token_eve_holt', isMock: true };
        }
        throw new Error(data.error || 'Registration failed. Please check your details.');
      }

      return data;
    } catch (error) {
      if (email === 'eve.holt@reqres.in') {
        return { id: 4, token: 'mock_token_eve_holt', isMock: true };
      }
      throw error;
    }
  },
};
