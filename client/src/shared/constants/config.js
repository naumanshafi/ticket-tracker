// Configuration constants
export const config = {
  // Google OAuth Configuration
  GOOGLE_CLIENT_ID: process.env.REACT_APP_GOOGLE_CLIENT_ID || '549557403268-707u7eagk8bbknhdg95p9kaukak74voq.apps.googleusercontent.com',
  GOOGLE_CLIENT_SECRET: process.env.REACT_APP_GOOGLE_CLIENT_SECRET || '',
  
  // API Configuration
  API_URL: process.env.REACT_APP_API_URL || 'https://ticket-tracker.turing.com/api',
  
  // Application Configuration
  APP_NAME: 'Ticket Tracker',
};

// Log configuration status (remove in production)
if (!config.GOOGLE_CLIENT_ID) {
  console.warn('Warning: REACT_APP_GOOGLE_CLIENT_ID is not set in environment variables');
}

export default config;
