# Security Architecture

## Overview

This application has been designed with security best practices to protect sensitive API keys and prevent abuse.

## Architecture Changes

### 1. User-Provided API Keys

- **Before**: OpenAI API calls were made using server-side environment variables
- **After**: Users provide their own OpenAI API keys on the frontend
- **Benefit**: No server-side API key storage, users control their own keys

### 2. Client-Side API Key Management

- **Implementation**: API keys are stored locally in the user's browser
- **Security**: Keys are never sent to our servers, only used for API calls
- **Validation**: API keys are tested before being accepted

### 3. Server-Side OpenAI Integration

- **Before**: OpenAI API calls were made directly from the client-side, exposing API keys
- **After**: All OpenAI API calls are now handled server-side through secure API routes
- **Benefit**: API keys are never exposed to the client

### 4. Rate Limiting

- **Implementation**: In-memory rate limiting (10 requests per minute per IP)
- **Benefit**: Prevents API abuse and reduces costs
- **Note**: For production, consider using Redis or similar persistent store

## API Routes

### `/api/validate-bingo`

- Validates bingo patterns using OpenAI
- Rate limited and secure
- Falls back to local validation if API fails
- Requires user-provided API key

### `/api/consolidate-insights`

- Consolidates wishes and worries using OpenAI
- Rate limited and secure
- Falls back to simple consolidation if API fails
- Requires user-provided API key

### `/api/test-api-key`

- Tests the validity of user-provided API keys
- Simple validation request to OpenAI
- No sensitive data processed

## User Experience

### API Key Requirements

1. **Games Page**: Users must set API key before accessing any games
2. **Bingo Game**: Host must have API key to start the game
3. **Wish-Worry Board**: Host must have API key to use consolidation features
4. **Persistent Storage**: API keys are stored locally in the browser

### Security Benefits

✅ No server-side API key storage  
✅ Users control their own API keys  
✅ Rate limiting prevents abuse  
✅ Server-side validation of all inputs  
✅ Graceful fallbacks when API fails  
✅ No client-side OpenAI dependencies

## Environment Setup

1. No environment variables required
2. Users provide their own OpenAI API keys
3. Application works immediately without configuration

## Production Considerations

1. **Rate Limiting**: Replace in-memory store with Redis or similar
2. **API Key Validation**: Consider additional validation for production use
3. **Monitoring**: Add logging and monitoring for API usage
4. **Caching**: Implement response caching to reduce API calls

## Security Benefits

✅ No server-side API key storage  
✅ Users control their own API keys  
✅ Rate limiting prevents abuse  
✅ Server-side validation of all inputs  
✅ Graceful fallbacks when API fails  
✅ No client-side OpenAI dependencies
