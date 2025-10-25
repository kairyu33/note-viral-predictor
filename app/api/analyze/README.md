# Note Viral Predictor API Documentation

## Overview

The `/api/analyze` endpoint provides AI-powered analysis of note articles to predict viral potential and generate actionable improvement suggestions.

## Endpoint

```
POST /api/analyze
```

## Authentication

Currently no authentication required (consider adding rate limiting for production).

## Request Format

### Headers
```
Content-Type: application/json
```

### Body Parameters

| Parameter | Type   | Required | Description                          | Max Length |
|-----------|--------|----------|--------------------------------------|------------|
| title     | string | Yes      | Article title                        | 200 chars  |
| content   | string | Yes      | Article content/body text            | 50,000 chars |
| category  | string | No       | Article category (future use)        | -          |

### Example Request

```typescript
const response = await fetch('/api/analyze', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    title: '月収30万円を達成した副業の始め方',
    content: '副業を始めて3ヶ月で月収30万円を達成しました...',
  }),
});

const result = await response.json();
```

```bash
# cURL example
curl -X POST http://localhost:3000/api/analyze \
  -H "Content-Type: application/json" \
  -d '{
    "title": "効果的なタイトル",
    "content": "記事の本文がここに入ります..."
  }'
```

## Response Format

### Success Response (200 OK)

```typescript
{
  "viralScore": 75,          // Overall viral potential score (0-100)
  "rating": "high",          // Rating: "low" | "medium" | "high" | "viral"
  "scores": {
    "titleScore": 80,        // Title attractiveness (0-100)
    "hookScore": 75,         // Opening hook strength (0-100)
    "structureScore": 70,    // Article structure quality (0-100)
    "readabilityScore": 85,  // Readability score (0-100)
    "emotionalScore": 65,    // Emotional appeal (0-100)
    "trendScore": 60,        // Trend relevance (0-100)
    "lengthScore": 75,       // Length optimization (0-100)
    "visualScore": 55        // Visual element effectiveness (0-100)
  },
  "improvements": [
    {
      "category": "タイトル",
      "priority": "high",
      "suggestion": "数字を使って具体性を高めましょう",
      "impact": "クリック率が20-30%向上する可能性があります",
      "example": "「副業の始め方」→「3ヶ月で月収30万円を達成した副業の始め方」"
    }
  ],
  "strengths": [
    "具体的な数字を使用している",
    "読者の悩みに共感している",
    "実体験に基づいた内容"
  ],
  "estimatedViews": {
    "min": 1000,
    "max": 10000
  },
  "analyzedAt": "2025-10-24T10:30:00.000Z"
}
```

### Error Responses

#### 400 Bad Request - Invalid Input

```json
{
  "error": "Validation failed",
  "details": "Title is required and must be a non-empty string"
}
```

Possible validation errors:
- `Request body must be a JSON object`
- `Title is required and must be a non-empty string`
- `Content is required and must be a non-empty string`
- `Title must be 200 characters or less`
- `Content must be 50,000 characters or less`

#### 500 Internal Server Error - Configuration Error

```json
{
  "error": "OpenAI API configuration error",
  "details": "OPENAI_API_KEY is not configured in environment variables"
}
```

#### 500 Internal Server Error - API Error

```json
{
  "error": "OpenAI API request failed",
  "details": "Rate limit exceeded"
}
```

## Score Breakdown

### 1. Title Score (20% weight)
- Click-worthiness (numbers, questions, intrigue)
- Specificity and clarity
- Emotional trigger words
- Alignment with popular note title patterns

### 2. Hook Score (20% weight)
- First 3 paragraphs engagement
- Empathy or surprise in opening
- Clear problem statement
- Compelling continuation

### 3. Structure Score (10% weight)
- Appropriate heading usage
- Logical flow
- Clear narrative arc (introduction, development, conclusion)
- Proper paragraph breaks

### 4. Readability Score (10% weight)
- Sentence length (not too long)
- Technical term explanations
- Appropriate use of line breaks and whitespace
- Rhythmic sentence structure

### 5. Emotional Score (15% weight)
- Relatable storytelling
- Specific anecdotes
- Emotionally moving expressions
- Human, authentic voice

### 6. Trend Score (15% weight)
- Timely topics
- Social media shareability
- Alignment with current social interests
- Viral-worthy subject matter

### 7. Length Score (5% weight)
- Optimal length for note (1500-3000 characters ideal)
- Content density
- No unnecessary verbosity
- Appropriate length for topic

### 8. Visual Score (5% weight)
- Image usage (inferred from content)
- Bullet points and quotes
- Layout considerations
- Visual readability

## Rating System

| Rating  | Score Range | Estimated Views | Description                          |
|---------|-------------|-----------------|--------------------------------------|
| viral   | 80-100      | 5,000-50,000    | Exceptional viral potential          |
| high    | 60-79       | 1,000-10,000    | Strong potential for good reach      |
| medium  | 40-59       | 500-3,000       | Moderate potential with improvements |
| low     | 0-39        | 100-1,000       | Needs significant improvements       |

## Environment Setup

### Required Environment Variables

Create a `.env.local` file in the project root:

```bash
# OpenAI API Key (required)
# Get your key from: https://platform.openai.com/api-keys
OPENAI_API_KEY=sk-your-api-key-here
```

### Development Setup

```bash
# 1. Copy the example environment file
cp .env.local.example .env.local

# 2. Edit .env.local and add your OpenAI API key
# 3. Start the development server
npm run dev

# 4. Test the API
curl -X POST http://localhost:3000/api/analyze \
  -H "Content-Type: application/json" \
  -d '{"title":"Test","content":"Test content"}'
```

## Health Check

```
GET /api/analyze
```

Returns API status and configuration info:

```json
{
  "status": "ok",
  "version": "1.0.0",
  "openaiConfigured": true,
  "supportedMethods": ["POST"]
}
```

## Usage Examples

### React Component Example

```typescript
'use client';

import { useState } from 'react';
import type { AnalysisResult } from '@/types';

export function AnalyzeForm() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const formData = new FormData(e.currentTarget);
    const title = formData.get('title') as string;
    const content = formData.get('content') as string;

    try {
      const response = await fetch('/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, content }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.details || errorData.error);
      }

      const data: AnalysisResult = await response.json();
      setResult(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Analysis failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input name="title" required placeholder="タイトル" />
      <textarea name="content" required placeholder="本文" />
      <button type="submit" disabled={loading}>
        {loading ? '分析中...' : '分析する'}
      </button>
      {error && <div className="error">{error}</div>}
      {result && (
        <div>
          <h2>バイラル度: {result.viralScore}点</h2>
          <p>評価: {result.rating}</p>
        </div>
      )}
    </form>
  );
}
```

### Server-Side Example

```typescript
// app/actions/analyze.ts
'use server';

import type { AnalysisResult } from '@/types';

export async function analyzeArticle(
  title: string,
  content: string
): Promise<AnalysisResult> {
  const response = await fetch(`${process.env.NEXT_PUBLIC_URL}/api/analyze`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ title, content }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.details || 'Analysis failed');
  }

  return response.json();
}
```

## Performance Considerations

### Response Times
- Average: 3-8 seconds (GPT-4 processing time)
- Timeout: 30 seconds maximum

### Rate Limits
- Depends on your OpenAI API tier
- Implement caching for identical requests
- Consider adding request queuing for high traffic

### Cost Optimization
- GPT-4 usage: ~$0.03-0.06 per analysis
- Consider caching results for identical content
- Implement usage limits per user
- Use GPT-3.5-turbo for lower-priority analyses

## Error Handling Best Practices

```typescript
try {
  const response = await fetch('/api/analyze', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ title, content }),
    signal: AbortSignal.timeout(30000), // 30 second timeout
  });

  if (!response.ok) {
    const errorData = await response.json();

    switch (response.status) {
      case 400:
        // Show validation error to user
        console.error('Validation error:', errorData.details);
        break;
      case 500:
        // Show generic error, log details
        console.error('Server error:', errorData);
        break;
      default:
        console.error('Unexpected error:', errorData);
    }

    throw new Error(errorData.details || 'Analysis failed');
  }

  const result: AnalysisResult = await response.json();
  return result;

} catch (error) {
  if (error instanceof DOMException && error.name === 'TimeoutError') {
    console.error('Request timeout - analysis took too long');
  } else {
    console.error('Network or parsing error:', error);
  }
  throw error;
}
```

## Future Enhancements

- [ ] Add authentication and user-specific rate limiting
- [ ] Implement result caching with Redis
- [ ] Add batch analysis endpoint
- [ ] Support image analysis for visual score
- [ ] Historical analysis comparison
- [ ] A/B testing suggestions
- [ ] Category-specific analysis models
- [ ] Real-time collaborative analysis

## Troubleshooting

### Common Issues

**"OPENAI_API_KEY is not configured"**
- Solution: Add your OpenAI API key to `.env.local`

**"Rate limit exceeded"**
- Solution: Check your OpenAI API usage and upgrade plan if needed

**"Request timeout"**
- Solution: Content may be too long; try splitting into multiple analyses

**"Invalid JSON in request body"**
- Solution: Ensure Content-Type header is set and body is valid JSON

## Support

For issues or questions:
1. Check this documentation
2. Review the [OpenAI API status](https://status.openai.com/)
3. Check environment variables are properly set
4. Review server logs for detailed error messages
