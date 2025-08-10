// Environment variable configuration
// This ensures environment variables are only available server-side

export const env = {
  OPENAI_API_KEY: process.env.OPENAI_API_KEY,
  NODE_ENV: process.env.NODE_ENV,
  // Add other environment variables as needed
} as const;

// Validate required environment variables
export function validateEnv() {
  if (!env.OPENAI_API_KEY) {
    throw new Error("OPENAI_API_KEY is required");
  }
}

// Only validate on server-side
if (typeof window === "undefined") {
  validateEnv();
}
