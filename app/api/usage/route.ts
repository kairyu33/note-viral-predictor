/**
 * API Usage Tracking Endpoint
 *
 * @description Tracks API usage statistics including token consumption and costs
 * @route GET /api/usage - Get usage statistics
 * @route POST /api/usage - Record new usage
 */

import { NextRequest, NextResponse } from 'next/server';
import { readFile, writeFile, mkdir } from 'fs/promises';
import { join } from 'path';
import { existsSync } from 'fs';

/**
 * Usage record structure
 */
interface UsageRecord {
  timestamp: string;
  inputTokens: number;
  outputTokens: number;
  cacheCreationTokens?: number;
  cacheReadTokens?: number;
  inputCost: number;
  outputCost: number;
  cacheCreationCost?: number;
  cacheReadCost?: number;
  totalCost: number;
  model: string;
}

/**
 * Usage statistics
 */
interface UsageStats {
  totalRequests: number;
  totalInputTokens: number;
  totalOutputTokens: number;
  totalTokens: number;
  totalCacheCreationTokens: number;
  totalCacheReadTokens: number;
  totalCost: number;
  totalSavings: number;
  cacheHitRate: number;
  records: UsageRecord[];
}

/**
 * Pricing for Claude models (USD per 1M tokens)
 */
const PRICING = {
  'claude-sonnet-4-5-20250929': {
    input: 3.00,
    output: 15.00,
    cacheWrite: 3.75,  // Cache creation: 25% premium
    cacheRead: 0.30,   // Cache read: 90% discount
  },
  'claude-3-5-sonnet-20241022': {
    input: 3.00,
    output: 15.00,
    cacheWrite: 3.75,
    cacheRead: 0.30,
  },
  'claude-3-opus-20240229': {
    input: 15.00,
    output: 75.00,
    cacheWrite: 18.75,
    cacheRead: 1.50,
  },
  'claude-3-sonnet-20240229': {
    input: 3.00,
    output: 15.00,
    cacheWrite: 3.75,
    cacheRead: 0.30,
  },
};

/**
 * Get data directory path
 */
const getDataDir = (): string => {
  return join(process.cwd(), 'data');
};

/**
 * Get usage file path
 */
const getUsageFilePath = (): string => {
  return join(getDataDir(), 'usage.json');
};

/**
 * Ensure data directory exists
 */
const ensureDataDir = async (): Promise<void> => {
  const dataDir = getDataDir();
  if (!existsSync(dataDir)) {
    await mkdir(dataDir, { recursive: true });
  }
};

/**
 * Load usage data from file
 */
const loadUsageData = async (): Promise<UsageStats> => {
  try {
    await ensureDataDir();
    const filePath = getUsageFilePath();

    if (!existsSync(filePath)) {
      return {
        totalRequests: 0,
        totalInputTokens: 0,
        totalOutputTokens: 0,
        totalTokens: 0,
        totalCacheCreationTokens: 0,
        totalCacheReadTokens: 0,
        totalCost: 0,
        totalSavings: 0,
        cacheHitRate: 0,
        records: [],
      };
    }

    const data = await readFile(filePath, 'utf-8');
    const parsed = JSON.parse(data);

    // Ensure all fields exist (backward compatibility)
    return {
      totalRequests: parsed.totalRequests || 0,
      totalInputTokens: parsed.totalInputTokens || 0,
      totalOutputTokens: parsed.totalOutputTokens || 0,
      totalTokens: parsed.totalTokens || 0,
      totalCacheCreationTokens: parsed.totalCacheCreationTokens || 0,
      totalCacheReadTokens: parsed.totalCacheReadTokens || 0,
      totalCost: parsed.totalCost || 0,
      totalSavings: parsed.totalSavings || 0,
      cacheHitRate: parsed.cacheHitRate || 0,
      records: parsed.records || [],
    };
  } catch (error) {
    console.error('Error loading usage data:', error);
    return {
      totalRequests: 0,
      totalInputTokens: 0,
      totalOutputTokens: 0,
      totalTokens: 0,
      totalCacheCreationTokens: 0,
      totalCacheReadTokens: 0,
      totalCost: 0,
      totalSavings: 0,
      cacheHitRate: 0,
      records: [],
    };
  }
};

/**
 * Save usage data to file
 */
const saveUsageData = async (data: UsageStats): Promise<void> => {
  try {
    await ensureDataDir();
    const filePath = getUsageFilePath();
    await writeFile(filePath, JSON.stringify(data, null, 2), 'utf-8');
  } catch (error) {
    console.error('Error saving usage data:', error);
    throw error;
  }
};

/**
 * Calculate cost based on token usage including cache
 */
const calculateCost = (
  inputTokens: number,
  outputTokens: number,
  model: string,
  cacheCreationTokens: number = 0,
  cacheReadTokens: number = 0
): {
  inputCost: number;
  outputCost: number;
  cacheCreationCost: number;
  cacheReadCost: number;
  totalCost: number;
  savings: number;
} => {
  const pricing = PRICING[model as keyof typeof PRICING] || PRICING['claude-sonnet-4-5-20250929'];

  const inputCost = (inputTokens / 1000000) * pricing.input;
  const outputCost = (outputTokens / 1000000) * pricing.output;
  const cacheCreationCost = (cacheCreationTokens / 1000000) * pricing.cacheWrite;
  const cacheReadCost = (cacheReadTokens / 1000000) * pricing.cacheRead;

  // Calculate what it would have cost without caching
  const costWithoutCache = ((inputTokens + cacheReadTokens) / 1000000) * pricing.input;
  const actualInputCost = inputCost + cacheReadCost;
  const savings = costWithoutCache - actualInputCost;

  const totalCost = inputCost + outputCost + cacheCreationCost + cacheReadCost;

  return {
    inputCost: parseFloat(inputCost.toFixed(6)),
    outputCost: parseFloat(outputCost.toFixed(6)),
    cacheCreationCost: parseFloat(cacheCreationCost.toFixed(6)),
    cacheReadCost: parseFloat(cacheReadCost.toFixed(6)),
    totalCost: parseFloat(totalCost.toFixed(6)),
    savings: parseFloat(savings.toFixed(6)),
  };
};

/**
 * GET /api/usage - Get usage statistics
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const period = searchParams.get('period') || 'all'; // all, today, week, month

    const data = await loadUsageData();

    // Filter by period
    let filteredRecords = data.records;
    const now = new Date();

    if (period === 'today') {
      const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      filteredRecords = data.records.filter(r => new Date(r.timestamp) >= today);
    } else if (period === 'week') {
      const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
      filteredRecords = data.records.filter(r => new Date(r.timestamp) >= weekAgo);
    } else if (period === 'month') {
      const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
      filteredRecords = data.records.filter(r => new Date(r.timestamp) >= monthAgo);
    }

    // Calculate filtered stats
    const totalCacheCreationTokens = filteredRecords.reduce((sum, r) => sum + (r.cacheCreationTokens || 0), 0);
    const totalCacheReadTokens = filteredRecords.reduce((sum, r) => sum + (r.cacheReadTokens || 0), 0);
    const totalSavings = filteredRecords.reduce((sum, r) => {
      const cacheReadCost = (r.cacheReadCost || 0);
      const cacheReadTokens = (r.cacheReadTokens || 0);
      // Calculate what it would have cost at full price
      const savings = (cacheReadTokens / 1000000) * 3.00 - cacheReadCost;
      return sum + savings;
    }, 0);
    const cacheHitRate = totalCacheCreationTokens + totalCacheReadTokens > 0
      ? (totalCacheReadTokens / (totalCacheCreationTokens + totalCacheReadTokens)) * 100
      : 0;

    const stats = {
      totalRequests: filteredRecords.length,
      totalInputTokens: filteredRecords.reduce((sum, r) => sum + r.inputTokens, 0),
      totalOutputTokens: filteredRecords.reduce((sum, r) => sum + r.outputTokens, 0),
      totalTokens: filteredRecords.reduce((sum, r) => sum + r.inputTokens + r.outputTokens, 0),
      totalCacheCreationTokens,
      totalCacheReadTokens,
      totalCost: filteredRecords.reduce((sum, r) => sum + r.totalCost, 0),
      totalSavings: parseFloat(totalSavings.toFixed(6)),
      cacheHitRate: parseFloat(cacheHitRate.toFixed(2)),
      records: filteredRecords,
      period,
    };

    return NextResponse.json(stats, { status: 200 });
  } catch (error) {
    console.error('GET /api/usage error:', error);
    return NextResponse.json(
      { error: 'Failed to retrieve usage data' },
      { status: 500 }
    );
  }
}

/**
 * POST /api/usage - Record new usage
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      inputTokens,
      outputTokens,
      model,
      cacheCreationTokens = 0,
      cacheReadTokens = 0,
    } = body;

    if (typeof inputTokens !== 'number' || typeof outputTokens !== 'number') {
      return NextResponse.json(
        { error: 'Invalid token counts' },
        { status: 400 }
      );
    }

    const costs = calculateCost(
      inputTokens,
      outputTokens,
      model || 'claude-sonnet-4-5-20250929',
      cacheCreationTokens,
      cacheReadTokens
    );

    const record: UsageRecord = {
      timestamp: new Date().toISOString(),
      inputTokens,
      outputTokens,
      cacheCreationTokens: cacheCreationTokens || undefined,
      cacheReadTokens: cacheReadTokens || undefined,
      inputCost: costs.inputCost,
      outputCost: costs.outputCost,
      cacheCreationCost: costs.cacheCreationCost || undefined,
      cacheReadCost: costs.cacheReadCost || undefined,
      totalCost: costs.totalCost,
      model: model || 'claude-sonnet-4-5-20250929',
    };

    const data = await loadUsageData();
    data.records.push(record);
    data.totalRequests += 1;
    data.totalInputTokens += inputTokens;
    data.totalOutputTokens += outputTokens;
    data.totalTokens += inputTokens + outputTokens;
    data.totalCacheCreationTokens += cacheCreationTokens;
    data.totalCacheReadTokens += cacheReadTokens;
    data.totalCost += costs.totalCost;
    data.totalSavings += costs.savings;

    // Update cache hit rate
    const totalCacheTokens = data.totalCacheCreationTokens + data.totalCacheReadTokens;
    data.cacheHitRate = totalCacheTokens > 0
      ? (data.totalCacheReadTokens / totalCacheTokens) * 100
      : 0;

    await saveUsageData(data);

    return NextResponse.json({ success: true, record }, { status: 200 });
  } catch (error) {
    console.error('POST /api/usage error:', error);
    return NextResponse.json(
      { error: 'Failed to record usage' },
      { status: 500 }
    );
  }
}
