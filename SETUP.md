# Note Viral Predictor - Setup Guide

## Quick Start

### 1. Install Dependencies

```bash
npm install
```

### 2. Configure OpenAI API Key

Create a `.env.local` file in the project root:

```bash
# Copy the example file
cp .env.local.example .env.local
```

Edit `.env.local` and add your OpenAI API key:

```bash
OPENAI_API_KEY=sk-your-actual-api-key-here
```

Get your API key from: https://platform.openai.com/api-keys

### 3. Start Development Server

```bash
npm run dev
```

The application will be available at http://localhost:3000

### 4. Test the API

In a new terminal, run:

```bash
npm run test:api
```

This will run automated tests against the analysis API.

## Project Structure

```
note-viral-predictor/
├── app/
│   ├── api/
│   │   └── analyze/
│   │       ├── route.ts          # Main API endpoint
│   │       └── README.md         # API documentation
│   ├── layout.tsx
│   └── page.tsx
├── types/
│   └── index.ts                  # TypeScript type definitions
├── scripts/
│   └── test-api.ts              # API test script
├── .env.local.example           # Environment variables template
└── package.json
```

## API Endpoint

### POST /api/analyze

Analyzes article content and returns viral prediction scores.

**Request:**
```json
{
  "title": "Your article title",
  "content": "Your article content..."
}
```

**Response:**
```json
{
  "viralScore": 75,
  "rating": "high",
  "scores": {
    "titleScore": 80,
    "hookScore": 75,
    "structureScore": 70,
    "readabilityScore": 85,
    "emotionalScore": 65,
    "trendScore": 60,
    "lengthScore": 75,
    "visualScore": 55
  },
  "improvements": [...],
  "strengths": [...],
  "estimatedViews": {
    "min": 1000,
    "max": 10000
  },
  "analyzedAt": "2025-10-24T10:30:00.000Z"
}
```

See `app/api/analyze/README.md` for complete API documentation.

## Development

### Type Checking

```bash
npm run type-check
```

### Linting

```bash
npm run lint
```

### Building for Production

```bash
npm run build
npm run start
```

## Testing the API

### Using the Test Script

```bash
# Make sure dev server is running
npm run dev

# In another terminal
npm run test:api
```

### Using cURL

```bash
curl -X POST http://localhost:3000/api/analyze \
  -H "Content-Type: application/json" \
  -d '{
    "title": "テスト記事のタイトル",
    "content": "テスト記事の本文がここに入ります..."
  }'
```

### Using Browser Developer Tools

```javascript
// In browser console at http://localhost:3000
const response = await fetch('/api/analyze', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    title: 'テスト記事',
    content: 'これはテスト記事の本文です。'
  })
});
const result = await response.json();
console.log(result);
```

## Environment Variables

| Variable        | Required | Description                          |
|-----------------|----------|--------------------------------------|
| OPENAI_API_KEY  | Yes      | Your OpenAI API key                  |

## Troubleshooting

### "OPENAI_API_KEY is not configured"

**Solution:** Make sure you have created `.env.local` and added your API key.

```bash
# Check if file exists
cat .env.local

# If it doesn't exist, create it
echo "OPENAI_API_KEY=sk-your-key-here" > .env.local
```

### "Failed to connect to API"

**Solution:** Make sure the development server is running:

```bash
npm run dev
```

### "Rate limit exceeded"

**Solution:** You've hit OpenAI API rate limits. Wait a few minutes or upgrade your OpenAI plan.

### Build Errors

**Solution:** Clear Next.js cache and rebuild:

```bash
rm -rf .next
npm run build
```

## OpenAI API Usage & Costs

Each analysis request costs approximately:
- GPT-4-turbo: ~$0.03-0.06 per analysis
- Average tokens: 1,500-2,500 per request

### Cost Optimization Tips

1. **Cache results**: Store analysis results to avoid re-analyzing identical content
2. **Rate limiting**: Implement user-based rate limits
3. **Use GPT-3.5**: For non-critical analyses, switch to `gpt-3.5-turbo` (cheaper)
4. **Batch processing**: Analyze multiple articles in queues during off-peak hours

## Next Steps

### Frontend Integration

Create a form component to submit articles for analysis:

```typescript
// app/components/AnalyzeForm.tsx
'use client';

import { useState } from 'react';
import type { AnalysisResult } from '@/types';

export function AnalyzeForm() {
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    const response = await fetch('/api/analyze', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        title: formData.get('title'),
        content: formData.get('content'),
      }),
    });

    const data = await response.json();
    setResult(data);
    setLoading(false);
  };

  return (
    <form onSubmit={handleSubmit}>
      {/* Form fields */}
    </form>
  );
}
```

### Add Features

- [ ] User authentication
- [ ] Analysis history storage
- [ ] Comparative analysis (before/after improvements)
- [ ] Export results as PDF
- [ ] Real-time preview scoring
- [ ] Integration with note API
- [ ] Batch analysis for multiple articles
- [ ] Custom scoring weights

## Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [OpenAI API Reference](https://platform.openai.com/docs/api-reference)
- [API Documentation](./app/api/analyze/README.md)
- [Type Definitions](./types/index.ts)

## Support

For issues or questions:
1. Check this setup guide
2. Review the API documentation
3. Check OpenAI API status: https://status.openai.com/
4. Verify environment variables are properly set
