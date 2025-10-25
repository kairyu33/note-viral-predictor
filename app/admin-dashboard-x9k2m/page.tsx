'use client';

import { useEffect, useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

interface UsageRecord {
  timestamp: string;
  inputTokens: number;
  outputTokens: number;
  inputCost: number;
  outputCost: number;
  totalCost: number;
  model: string;
}

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
  period: string;
}

export default function UsagePage() {
  const [stats, setStats] = useState<UsageStats | null>(null);
  const [period, setPeriod] = useState<'all' | 'today' | 'week' | 'month'>('all');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchUsageStats = async (selectedPeriod: string) => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`/api/usage?period=${selectedPeriod}`);
      if (!response.ok) {
        throw new Error('Failed to fetch usage stats');
      }
      const data = await response.json();
      setStats(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsageStats(period);
    const interval = setInterval(() => fetchUsageStats(period), 10000);
    return () => clearInterval(interval);
  }, [period]);

  const chartData = stats?.records.slice(-20).map((record, index) => ({
    name: `${index + 1}`,
    timestamp: new Date(record.timestamp).toLocaleTimeString('ja-JP', {
      hour: '2-digit',
      minute: '2-digit'
    }),
    cost: parseFloat((record.totalCost * 100).toFixed(4)), // Convert to cents for better visualization
    inputTokens: record.inputTokens,
    outputTokens: record.outputTokens,
  })) || [];

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            📊 API使用状況ダッシュボード
          </h1>
          <p className="text-gray-600">
            Anthropic Claude APIの使用状況とコストをリアルタイムで確認できます
          </p>
        </div>

        {/* Period Selector */}
        <div className="mb-6 flex gap-2">
          {(['all', 'today', 'week', 'month'] as const).map((p) => (
            <button
              key={p}
              onClick={() => setPeriod(p)}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                period === p
                  ? 'bg-blue-600 text-white'
                  : 'bg-white text-gray-700 hover:bg-gray-100'
              }`}
            >
              {p === 'all' && '全期間'}
              {p === 'today' && '今日'}
              {p === 'week' && '過去7日'}
              {p === 'month' && '過去30日'}
            </button>
          ))}
        </div>

        {loading && !stats ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">読み込み中...</p>
          </div>
        ) : error ? (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-700">
            エラー: {error}
          </div>
        ) : stats ? (
          <>
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
              {/* Total Requests */}
              <div className="bg-white rounded-xl shadow-lg p-6">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-sm font-medium text-gray-600">総リクエスト数</h3>
                  <span className="text-2xl">🔄</span>
                </div>
                <p className="text-3xl font-bold text-gray-900">{stats.totalRequests}</p>
                <p className="text-xs text-gray-500 mt-1">回</p>
              </div>

              {/* Total Tokens */}
              <div className="bg-white rounded-xl shadow-lg p-6">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-sm font-medium text-gray-600">総トークン数</h3>
                  <span className="text-2xl">🎯</span>
                </div>
                <p className="text-3xl font-bold text-gray-900">
                  {stats.totalTokens.toLocaleString()}
                </p>
                <div className="text-xs text-gray-500 mt-1">
                  <span className="text-green-600">入力: {stats.totalInputTokens.toLocaleString()}</span>
                  {' / '}
                  <span className="text-blue-600">出力: {stats.totalOutputTokens.toLocaleString()}</span>
                </div>
              </div>

              {/* Total Cost */}
              <div className="bg-white rounded-xl shadow-lg p-6">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-sm font-medium text-gray-600">総コスト</h3>
                  <span className="text-2xl">💰</span>
                </div>
                <p className="text-3xl font-bold text-gray-900">
                  ${stats.totalCost.toFixed(4)}
                </p>
                <p className="text-xs text-gray-500 mt-1">USD</p>
              </div>

              {/* Average Cost per Request */}
              <div className="bg-white rounded-xl shadow-lg p-6">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-sm font-medium text-gray-600">平均コスト/リクエスト</h3>
                  <span className="text-2xl">📈</span>
                </div>
                <p className="text-3xl font-bold text-gray-900">
                  ${stats.totalRequests > 0
                    ? (stats.totalCost / stats.totalRequests).toFixed(4)
                    : '0.0000'}
                </p>
                <p className="text-xs text-gray-500 mt-1">USD</p>
              </div>

              {/* Cache Hit Rate */}
              <div className="bg-white rounded-xl shadow-lg p-6">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-sm font-medium text-gray-600">キャッシュヒット率</h3>
                  <span className="text-2xl">⚡</span>
                </div>
                <p className="text-3xl font-bold text-green-600">
                  {stats.cacheHitRate.toFixed(1)}%
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  節約: ${stats.totalSavings.toFixed(4)}
                </p>
              </div>
            </div>

            {/* Cost Chart */}
            {chartData.length > 0 && (
              <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
                <h3 className="text-lg font-bold text-gray-900 mb-4">
                  コスト推移（最新20件）
                </h3>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis
                      dataKey="timestamp"
                      tick={{ fontSize: 12 }}
                    />
                    <YAxis
                      label={{ value: 'コスト (¢)', angle: -90, position: 'insideLeft' }}
                      tick={{ fontSize: 12 }}
                    />
                    <Tooltip
                      formatter={(value: number) => [`$${(value / 100).toFixed(4)}`, 'コスト']}
                    />
                    <Legend />
                    <Line
                      type="monotone"
                      dataKey="cost"
                      stroke="#8b5cf6"
                      strokeWidth={2}
                      name="リクエストコスト"
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            )}

            {/* Token Usage Chart */}
            {chartData.length > 0 && (
              <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
                <h3 className="text-lg font-bold text-gray-900 mb-4">
                  トークン使用量推移（最新20件）
                </h3>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis
                      dataKey="timestamp"
                      tick={{ fontSize: 12 }}
                    />
                    <YAxis
                      label={{ value: 'トークン数', angle: -90, position: 'insideLeft' }}
                      tick={{ fontSize: 12 }}
                    />
                    <Tooltip />
                    <Legend />
                    <Line
                      type="monotone"
                      dataKey="inputTokens"
                      stroke="#10b981"
                      strokeWidth={2}
                      name="入力トークン"
                    />
                    <Line
                      type="monotone"
                      dataKey="outputTokens"
                      stroke="#3b82f6"
                      strokeWidth={2}
                      name="出力トークン"
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            )}

            {/* Recent Records Table */}
            <div className="bg-white rounded-xl shadow-lg overflow-hidden">
              <div className="p-6 border-b border-gray-200">
                <h3 className="text-lg font-bold text-gray-900">最近のリクエスト履歴</h3>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        日時
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        入力トークン
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        出力トークン
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        総トークン
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        コスト
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        モデル
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {stats.records.length === 0 ? (
                      <tr>
                        <td colSpan={6} className="px-6 py-8 text-center text-gray-500">
                          まだリクエストがありません
                        </td>
                      </tr>
                    ) : (
                      stats.records.slice().reverse().slice(0, 10).map((record, index) => (
                        <tr key={index} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {new Date(record.timestamp).toLocaleString('ja-JP')}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-green-600">
                            {record.inputTokens.toLocaleString()}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-blue-600">
                            {record.outputTokens.toLocaleString()}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {(record.inputTokens + record.outputTokens).toLocaleString()}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                            ${record.totalCost.toFixed(6)}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-xs text-gray-500">
                            {record.model.replace('claude-', '')}
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Pricing Info */}
            <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-6">
              <h3 className="text-lg font-bold text-blue-900 mb-3">💡 料金情報</h3>
              <div className="space-y-3 text-sm text-blue-800">
                <div>
                  <p className="font-semibold mb-1">Claude Sonnet 4.5:</p>
                  <ul className="ml-4 space-y-1 text-xs">
                    <li>• 入力: $3.00/1M tokens</li>
                    <li>• 出力: $15.00/1M tokens</li>
                    <li className="text-green-700 font-medium">• キャッシュ読み取り: $0.30/1M tokens (90% 削減!) ⚡</li>
                    <li className="text-orange-700">• キャッシュ作成: $3.75/1M tokens (25% プレミアム)</li>
                  </ul>
                </div>
                <div>
                  <p className="font-semibold mb-1">Claude 3.5 Sonnet:</p>
                  <ul className="ml-4 space-y-1 text-xs">
                    <li>• 入力: $3.00/1M tokens, 出力: $15.00/1M tokens</li>
                    <li className="text-green-700">• キャッシュ読み取り: $0.30/1M tokens</li>
                  </ul>
                </div>
                <div>
                  <p className="font-semibold mb-1">Claude 3 Opus:</p>
                  <ul className="ml-4 space-y-1 text-xs">
                    <li>• 入力: $15.00/1M tokens, 出力: $75.00/1M tokens</li>
                    <li className="text-green-700">• キャッシュ読み取り: $1.50/1M tokens</li>
                  </ul>
                </div>
                <p className="text-xs text-blue-600 mt-3 pt-3 border-t border-blue-200">
                  ⚡ プロンプトキャッシング有効: 固定プロンプトを自動的にキャッシュして、2回目以降のリクエストで90%のコスト削減<br/>
                  ※ 10秒ごとに自動更新されます
                </p>
              </div>
            </div>
          </>
        ) : null}
      </div>
    </div>
  );
}
