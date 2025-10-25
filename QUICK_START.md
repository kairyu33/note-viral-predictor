# Quick Start Guide - Note Viral Predictor API

## 3-Step Setup

### 1. Install & Configure (2 minutes)

```bash
# Install dependencies
npm install

# Set up environment variables
cp .env.local.example .env.local

# Add your OpenAI API key to .env.local
# OPENAI_API_KEY=sk-your-key-here
```

Get your API key: https://platform.openai.com/api-keys

### 2. Start Server (30 seconds)

```bash
npm run dev
```

Server runs at http://localhost:3000

### 3. Test API (1 minute)

```bash
# In a new terminal
npm run test:api
```

## Quick Test with cURL

```bash
curl -X POST http://localhost:3000/api/analyze \
  -H "Content-Type: application/json" \
  -d '{
    "title": "3ヶ月で月収30万円を達成した副業の始め方",
    "content": "副業を始めて3ヶ月で月収30万円を達成しました。この記事では、私が実践した具体的な方法をすべて公開します。"
  }'
```

## Expected Response

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
  "estimatedViews": { "min": 1000, "max": 10000 },
  "analyzedAt": "2025-10-24T10:30:00.000Z"
}
```

## Integration Example

```typescript
const response = await fetch('/api/analyze', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    title: 'Your article title',
    content: 'Your article content...'
  })
});

const result = await response.json();
console.log(`Score: ${result.viralScore}/100`);
```

## Key Files

- `app/api/analyze/route.ts` - Main API endpoint
- `app/api/analyze/README.md` - Full API documentation
- `types/index.ts` - Type definitions
- `scripts/test-api.ts` - Test suite
- `.env.local` - Your API key (create this!)

## Common Issues

**"OPENAI_API_KEY is not configured"**
→ Create `.env.local` and add your API key

**"Failed to connect to API"**
→ Make sure `npm run dev` is running

**"Rate limit exceeded"**
→ Wait a few minutes or upgrade OpenAI plan

## Next Steps

1. ✅ API is working
2. Create frontend form component
3. Add result visualization
4. Implement user dashboard

See `SETUP.md` for complete documentation.

## Cost Estimate

- ~$0.03-0.06 per analysis
- 100 analyses = ~$3-6
- Consider caching for production to reduce costs

## Support

- Full documentation: `app/api/analyze/README.md`
- Setup guide: `SETUP.md`
- Implementation details: `API_IMPLEMENTATION_SUMMARY.md`
