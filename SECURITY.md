# Security Architecture

## Overview

This application has been designed with security best practices to protect sensitive API keys and prevent abuse.

## Architecture Changes

### 1. Server-Side OpenAI Integration

- **Before**: OpenAI API calls were made directly from the client-side, exposing API keys
- **After**: All OpenAI API calls are now handled server-side through secure API routes
- **Benefit**: API keys are never exposed to the client

### 2. Environment Variable Security

- **Before**: Environment variables were exposed to the client through Next.js config
- **After**: Environment variables are only accessible server-side
- **Benefit**: Sensitive configuration remains secure

### 3. Rate Limiting

- **Implementation**: In-memory rate limiting (10 requests per minute per IP)
- **Benefit**: Prevents API abuse and reduces costs
- **Note**: For production, consider using Redis or similar persistent store

## API Routes

### `/api/validate-bingo`

- Validates bingo patterns using OpenAI
- Rate limited and secure
- Falls back to local validation if API fails

### `/api/consolidate-insights`

- Consolidates wishes and worries using OpenAI
- Rate limited and secure
- Falls back to simple consolidation if API fails

## Environment Setup

1. Copy `env.example` to `.env.local`
2. Add your OpenAI API key: `OPENAI_API_KEY=your_key_here`
3. Restart your development server

## Production Considerations

1. **Rate Limiting**: Replace in-memory store with Redis or similar
2. **API Key Rotation**: Implement regular API key rotation
3. **Monitoring**: Add logging and monitoring for API usage
4. **Caching**: Implement response caching to reduce API calls

## Security Benefits

✅ API keys are never exposed to clients  
✅ Rate limiting prevents abuse  
✅ Server-side validation of all inputs  
✅ Graceful fallbacks when API fails  
✅ No client-side OpenAI dependencies
