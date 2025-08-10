// Environment variable configuration
// This ensures environment variables are only available server-side

export const env = {
  NODE_ENV: process.env.NODE_ENV,
  // Add other environment variables as needed
} as const;

// No longer validating OpenAI API key as it's provided by users
// The API key validation now happens on the frontend before making requests
