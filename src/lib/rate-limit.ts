// Simple in-memory rate limiting
// In production, consider using Redis or a similar persistent store

interface RateLimitEntry {
  count: number;
  resetTime: number;
}

const rateLimitStore = new Map<string, RateLimitEntry>();

// Rate limit configuration
const WINDOW_SIZE = 60 * 1000; // 1 minute
const MAX_REQUESTS = 10; // Max 10 requests per minute per IP

export async function rateLimit(
  identifier: string
): Promise<{ success: boolean; remaining: number; resetTime: number }> {
  const now = Date.now();
  const entry = rateLimitStore.get(identifier);

  if (!entry || now > entry.resetTime) {
    // First request or window expired
    rateLimitStore.set(identifier, {
      count: 1,
      resetTime: now + WINDOW_SIZE,
    });
    return {
      success: true,
      remaining: MAX_REQUESTS - 1,
      resetTime: now + WINDOW_SIZE,
    };
  }

  if (entry.count >= MAX_REQUESTS) {
    // Rate limit exceeded
    return { success: false, remaining: 0, resetTime: entry.resetTime };
  }

  // Increment count
  entry.count++;
  rateLimitStore.set(identifier, entry);

  return {
    success: true,
    remaining: MAX_REQUESTS - entry.count,
    resetTime: entry.resetTime,
  };
}

// Clean up expired entries periodically
setInterval(() => {
  const now = Date.now();
  for (const [key, entry] of rateLimitStore.entries()) {
    if (now > entry.resetTime) {
      rateLimitStore.delete(key);
    }
  }
}, WINDOW_SIZE);
