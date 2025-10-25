/**
 * Note Viral Predictor API - Article Analysis Endpoint (Claude版)
 *
 * @description This endpoint analyzes note articles using Anthropic Claude to predict
 * viral potential and provide actionable improvement suggestions.
 *
 * @route POST /api/analyze
 */

import { NextRequest, NextResponse } from 'next/server';
import Anthropic from '@anthropic-ai/sdk';
import type { AnalysisResult, ArticleInput } from '@/types';
import { checkRateLimit, getClientIp } from '@/lib/rateLimit';

/**
 * Anthropic Claude client instance
 */
const getClaudeClient = (): Anthropic => {
  const apiKey = process.env.ANTHROPIC_API_KEY;

  if (!apiKey) {
    throw new Error('ANTHROPIC_API_KEY is not configured in environment variables');
  }

  return new Anthropic({
    apiKey,
  });
};

/**
 * Validates article input data
 */
const validateInput = (data: unknown): { valid: true; data: ArticleInput } | { valid: false; error: string } => {
  if (!data || typeof data !== 'object') {
    return { valid: false, error: 'Request body must be a JSON object' };
  }

  const { title, content } = data as Partial<ArticleInput>;

  if (!title || typeof title !== 'string' || title.trim().length === 0) {
    return { valid: false, error: 'Title is required and must be a non-empty string' };
  }

  if (!content || typeof content !== 'string' || content.trim().length === 0) {
    return { valid: false, error: 'Content is required and must be a non-empty string' };
  }

  if (title.length > 200) {
    return { valid: false, error: 'Title must be 200 characters or less' };
  }

  if (content.length > 50000) {
    return { valid: false, error: 'Content must be 50,000 characters or less' };
  }

  return {
    valid: true,
    data: {
      title: title.trim(),
      content: content.trim(),
    },
  };
};

/**
 * System prompt for analysis (cached)
 */
const SYSTEM_PROMPT = `あなたはnote記事のバイラル度を予測する専門家AIです。記事を分析し、JSON形式で結果を返してください。

# 分析項目（各項目を0-100点で評価）

1. **titleScore** - タイトルの魅力度（キャッチーさ、具体性、数字活用）
2. **hookScore** - 冒頭の引き込み力（最初の3行、問題提起の明確さ）
3. **structureScore** - 記事構成の質（論理的な流れ、見出しの効果）
4. **readabilityScore** - 読みやすさ（文章の平易さ、リズム感）
5. **emotionalScore** - 感情への訴求力（ストーリー性、共感ポイント）
6. **trendScore** - トレンド性（時事性、話題のキーワード、バズ要素）
7. **lengthScore** - 文字数の適切さ（内容に対する長さ、情報密度）
8. **visualScore** - 視覚的表現力（見出しの工夫、箇条書き活用）

# 出力形式

必ず以下のJSON形式のみを返してください（説明文は不要）:

{
  "scores": {
    "titleScore": 85,
    "hookScore": 75,
    "structureScore": 80,
    "readabilityScore": 82,
    "emotionalScore": 70,
    "trendScore": 88,
    "lengthScore": 65,
    "visualScore": 73
  },
  "improvements": [
    {
      "category": "タイトル",
      "priority": "high",
      "suggestion": "具体的な数字を追加すると、より説得力が増します",
      "impact": "クリック率が20-30%向上する可能性があります",
      "example": "「月10万円」のような具体的な数値を含める"
    }
  ],
  "strengths": [
    "タイトルに具体的な数字が含まれており、説得力があります",
    "記事構成が整理されており、読みやすい流れです"
  ]
}

重要: improvementsは優先度が高い順に3-5個、strengthsは2-4個提案してください。priorityは"high", "medium", "low"のいずれかを使用。`;

/**
 * Constructs the user prompt for article analysis
 */
const buildUserPrompt = (article: ArticleInput): string => {
  return `# 分析対象記事

タイトル: ${article.title}

本文:
${article.content}`;
};

/**
 * Calculates overall viral score from individual scores
 */
const calculateViralScore = (scores: {
  titleScore: number;
  hookScore: number;
  structureScore: number;
  readabilityScore: number;
  emotionalScore: number;
  trendScore: number;
  lengthScore: number;
  visualScore: number;
}): number => {
  const weights = {
    titleScore: 0.20,
    hookScore: 0.20,
    structureScore: 0.10,
    readabilityScore: 0.10,
    emotionalScore: 0.15,
    trendScore: 0.15,
    lengthScore: 0.05,
    visualScore: 0.05,
  };

  const weightedScore = Object.entries(scores).reduce((total, [key, value]) => {
    const weight = weights[key as keyof typeof weights] || 0;
    return total + value * weight;
  }, 0);

  return Math.round(weightedScore);
};

/**
 * Determines rating based on viral score
 */
const getRating = (score: number): 'low' | 'medium' | 'high' | 'viral' => {
  if (score >= 85) return 'viral';
  if (score >= 70) return 'high';
  if (score >= 50) return 'medium';
  return 'low';
};

/**
 * Estimates page views based on viral score
 */
const estimateViews = (score: number): { min: number; max: number } => {
  if (score >= 85) return { min: 10000, max: 100000 };
  if (score >= 70) return { min: 1000, max: 10000 };
  if (score >= 50) return { min: 100, max: 1000 };
  return { min: 10, max: 100 };
};

/**
 * Analyzes article using Claude API with prompt caching
 */
const analyzeWithClaude = async (article: ArticleInput): Promise<AnalysisResult> => {
  const client = getClaudeClient();
  const userPrompt = buildUserPrompt(article);

  try {
    const model = process.env.ANTHROPIC_MODEL || 'claude-sonnet-4-5-20250929';
    const response = await client.messages.create({
      model,
      max_tokens: 4096,
      temperature: parseFloat(process.env.ANTHROPIC_TEMPERATURE || '0.7'),
      system: [
        {
          type: 'text',
          text: SYSTEM_PROMPT,
          cache_control: { type: 'ephemeral' },
        },
      ],
      messages: [
        {
          role: 'user',
          content: userPrompt,
        },
      ],
    });

    // Record usage statistics including cache metrics
    const inputTokens = response.usage.input_tokens;
    const outputTokens = response.usage.output_tokens;
    const cacheCreationTokens = (response.usage as any).cache_creation_input_tokens || 0;
    const cacheReadTokens = (response.usage as any).cache_read_input_tokens || 0;

    // Send usage data to tracking endpoint (fire and forget)
    // Use relative URL to work in any environment (localhost, Vercel, etc.)
    const baseUrl = process.env.VERCEL_URL
      ? `https://${process.env.VERCEL_URL}`
      : process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';

    fetch(`${baseUrl}/api/usage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        inputTokens,
        outputTokens,
        model,
        cacheCreationTokens,
        cacheReadTokens,
      }),
    }).catch(err => console.error('Failed to record usage:', err));

    const content = response.content[0];
    if (content.type !== 'text') {
      throw new Error('Unexpected response type from Claude');
    }

    const text = content.text;

    // Extract JSON from markdown code blocks if present
    const jsonMatch = text.match(/```json\s*([\s\S]*?)\s*```/) || text.match(/```\s*([\s\S]*?)\s*```/) || text.match(/\{[\s\S]*\}/);
    const jsonText = jsonMatch ? (jsonMatch[1] || jsonMatch[0]) : text;

    const analysis = JSON.parse(jsonText);

    // Calculate overall score
    const viralScore = calculateViralScore(analysis.scores);
    const rating = getRating(viralScore);
    const estimatedViews = estimateViews(viralScore);

    return {
      viralScore,
      rating,
      scores: analysis.scores,
      improvements: analysis.improvements,
      strengths: analysis.strengths,
      estimatedViews,
      analyzedAt: new Date().toISOString(),
    };
  } catch (error) {
    console.error('Claude API Error:', error);
    throw new Error('Failed to analyze article with Claude API');
  }
};

/**
 * POST /api/analyze
 */
export async function POST(request: NextRequest) {
  try {
    // レート制限チェック
    const clientIp = getClientIp(request);
    const rateLimitResult = checkRateLimit(clientIp);

    if (!rateLimitResult.allowed) {
      const resetDate = new Date(rateLimitResult.resetTime);
      return NextResponse.json(
        {
          error: 'レート制限を超えました。しばらくしてから再度お試しください。',
          retryAfter: resetDate.toISOString(),
        },
        {
          status: 429,
          headers: {
            'X-RateLimit-Limit': '10',
            'X-RateLimit-Remaining': '0',
            'X-RateLimit-Reset': resetDate.toISOString(),
            'Retry-After': Math.ceil((rateLimitResult.resetTime - Date.now()) / 1000).toString(),
          },
        }
      );
    }

    const body = await request.json();

    const validation = validateInput(body);
    if (!validation.valid) {
      return NextResponse.json(
        { error: validation.error },
        { status: 400 }
      );
    }

    const result = await analyzeWithClaude(validation.data);

    // レート制限情報をヘッダーに追加
    return NextResponse.json(result, {
      status: 200,
      headers: {
        'X-RateLimit-Limit': '10',
        'X-RateLimit-Remaining': rateLimitResult.remaining.toString(),
        'X-RateLimit-Reset': new Date(rateLimitResult.resetTime).toISOString(),
      },
    });
  } catch (error) {
    console.error('API Error:', error);

    if (error instanceof Error) {
      if (error.message.includes('ANTHROPIC_API_KEY')) {
        return NextResponse.json(
          { error: 'API key not configured. Please set ANTHROPIC_API_KEY environment variable.' },
          { status: 500 }
        );
      }

      if (error.message.includes('Failed to analyze')) {
        return NextResponse.json(
          { error: 'Failed to analyze article. Please try again.' },
          { status: 500 }
        );
      }
    }

    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

/**
 * GET /api/analyze - Health check
 */
export async function GET() {
  return NextResponse.json({
    status: 'ok',
    version: '3.0.0-claude',
    model: 'claude-sonnet-4.5',
    provider: 'anthropic',
    timestamp: new Date().toISOString(),
  });
}
