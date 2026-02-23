/**
 * API Configuration
 * Reads the backend URL from environment variables
 */

// Get the API base URL from environment variable or fallback to localhost
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

// API endpoints
export const API_ENDPOINTS = {
  CHECK_FA_TYPE: `${API_BASE_URL}/api/check-fa-type`,
  GENERATE_AUTOMATON_IMAGE: `${API_BASE_URL}/api/generate-automaton-image`,
  TEST_INPUT_STRING: `${API_BASE_URL}/api/test-input-string`,
  MINIMIZE_DFA: `${API_BASE_URL}/api/minimize-dfa`,
  CONVERT_NFA_TO_DFA: `${API_BASE_URL}/api/convert-nfa-to-dfa`
};

export default API_BASE_URL;
