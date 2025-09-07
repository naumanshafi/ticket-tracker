// Configuration constants
export const config = {
  // Google OAuth Configuration
  GOOGLE_CLIENT_ID: process.env.REACT_APP_GOOGLE_CLIENT_ID || '549557403268-707u7eagk8bbknhdg95p9kaukak74voq.apps.googleusercontent.com',
  GOOGLE_CLIENT_SECRET: process.env.REACT_APP_GOOGLE_CLIENT_SECRET || '',
  
  // API Configuration
  API_URL: process.env.REACT_APP_API_URL || 'http://localhost:5000',
  
  // Application Configuration
  APP_NAME: 'Jira Clone',
  DEFAULT_AVATAR_URL: 'https://i.pravatar.cc/150',
};

// Log configuration status (remove in production)
if (!config.GOOGLE_CLIENT_ID) {
  console.warn('Warning: REACT_APP_GOOGLE_CLIENT_ID is not set in environment variables');
}

export default config;
