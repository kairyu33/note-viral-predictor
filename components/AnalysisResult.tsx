'use client';

import React, { useMemo } from 'react';
import {
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  ResponsiveContainer,
  Cell,
  PieChart,
  Pie,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from 'recharts';
import {
  TrendingUp,
  Target,
  Lightbulb,
  Award,
  Eye,
  ArrowUp,
  ArrowRight,
  ArrowDown,
  Sparkles,
} from 'lucide-react';
import type { AnalysisResult as AnalysisResultType, Improvement } from '@/types';

/**
 * AnalysisResult コンポーネントのプロパティ定義
 *
 * @interface AnalysisResultProps
 */
interface AnalysisResultProps {
  /**
   * AI分析結果データ
   * AnalysisResult型の詳細は /types/index.ts を参照
   */
  result: AnalysisResultType;
}

/**
 * レーダーチャート用のデータ型
 */
interface RadarDataPoint {
  subject: string;
  value: number;
  fullMark: number;
}

/**
 * レーティングごとの表示設定
 */
interface RatingConfig {
  label: string;
  color: string;
  bgColor: string;
  borderColor: string;
  icon: React.ReactElement;
  description: string;
}

/**
 * 優先度ごとの表示設定
 */
interface PriorityConfig {
  icon: React.ReactElement;
  color: string;
  bgColor: string;
  borderColor: string;
  label: string;
}

/**
 * AnalysisResult - バイラル度分析結果の表示コンポーネント
 *
 * @description
 * AI分析の結果を視覚的に表示するコンポーネント。
 * スコア、レーティング、詳細分析、改善提案などを包括的に提示します。
 *
 * @component
 * @example
 * ```tsx
 * <AnalysisResult
 *   result={{
 *     viralScore: 78,
 *     rating: 'high',
 *     scores: {
 *       titleScore: 85,
 *       hookScore: 72,
 *       structureScore: 80,
 *       readabilityScore: 76,
 *       emotionalScore: 68,
 *       trendScore: 90,
 *       lengthScore: 75,
 *       visualScore: 70,
 *     },
 *     improvements: [...],
 *     strengths: [...],
 *     estimatedViews: { min: 5000, max: 15000 },
 *     analyzedAt: '2025-10-24T12:00:00Z',
 *   }}
 * />
 * ```
 *
 * @param {AnalysisResultProps} props - コンポーネントのプロパティ
 * @returns {React.ReactElement} AnalysisResultコンポーネント
 *
 * @remarks
 * 表示内容:
 * - バイラル度スコア（0-100、円形グラフ）
 * - レーティング（low/medium/high/viral）
 * - 8項目の詳細スコア（レーダーチャート + バーチャート）
 * - 改善提案リスト（優先度別に色分け）
 * - 強みリスト
 * - 予測PV範囲
 *
 * アニメーション:
 * - フェードイン
 * - スライドイン
 * - スケールアニメーション
 */
export default function AnalysisResult({ result }: AnalysisResultProps): React.ReactElement {
  /**
   * レーティングごとの表示設定を取得
   *
   * @param rating - 分析結果のレーティング
   * @returns レーティングの表示設定
   */
  const getRatingConfig = (
    rating: AnalysisResultType['rating']
  ): RatingConfig => {
    const configs: Record<AnalysisResultType['rating'], RatingConfig> = {
      low: {
        label: '改善の余地あり',
        color: 'text-gray-900 dark:text-gray-100',
        bgColor: 'bg-gray-100 dark:bg-gray-800',
        borderColor: 'border-gray-400 dark:border-gray-600',
        icon: <ArrowDown className="w-6 h-6" />,
        description: 'いくつかの改善でバイラル度を高められます',
      },
      medium: {
        label: '良好',
        color: 'text-blue-900 dark:text-blue-100',
        bgColor: 'bg-blue-100 dark:bg-blue-900/30',
        borderColor: 'border-blue-400 dark:border-blue-600',
        icon: <ArrowRight className="w-6 h-6" />,
        description: '基本は押さえています。さらなる改善で注目度アップ',
      },
      high: {
        label: '優秀',
        color: 'text-green-900 dark:text-green-100',
        bgColor: 'bg-green-100 dark:bg-green-900/30',
        borderColor: 'border-green-400 dark:border-green-600',
        icon: <ArrowUp className="w-6 h-6" />,
        description: '高いバイラル性を持つ記事です',
      },
      viral: {
        label: 'バイラル確実',
        color: 'text-purple-900 dark:text-purple-100',
        bgColor: 'bg-gradient-to-r from-purple-100 to-pink-100 dark:from-purple-900/30 dark:to-pink-900/30',
        borderColor: 'border-purple-400 dark:border-purple-600',
        icon: <Sparkles className="w-6 h-6" />,
        description: '大きな注目を集める可能性が非常に高い記事です',
      },
    };
    return configs[rating];
  };

  /**
   * 優先度ごとの表示設定を取得
   *
   * @param priority - 改善提案の優先度
   * @returns 優先度の表示設定
   */
  const getPriorityConfig = (priority: Improvement['priority']): PriorityConfig => {
    const configs: Record<Improvement['priority'], PriorityConfig> = {
      high: {
        icon: <ArrowUp className="w-4 h-4" />,
        color: 'text-red-700 dark:text-red-400',
        bgColor: 'bg-red-50 dark:bg-red-900/20',
        borderColor: 'border-red-300 dark:border-red-700',
        label: '重要',
      },
      medium: {
        icon: <ArrowRight className="w-4 h-4" />,
        color: 'text-orange-700 dark:text-orange-400',
        bgColor: 'bg-orange-50 dark:bg-orange-900/20',
        borderColor: 'border-orange-300 dark:border-orange-700',
        label: '推奨',
      },
      low: {
        icon: <ArrowDown className="w-4 h-4" />,
        color: 'text-blue-700 dark:text-blue-400',
        bgColor: 'bg-blue-50 dark:bg-blue-900/20',
        borderColor: 'border-blue-300 dark:border-blue-700',
        label: '任意',
      },
    };
    return configs[priority];
  };

  /**
   * レーダーチャート用のデータを生成
   */
  const radarData = useMemo<RadarDataPoint[]>(() => {
    const scoreLabels: Record<keyof AnalysisResultType['scores'], string> = {
      titleScore: 'タイトル',
      hookScore: 'フック',
      structureScore: '構成',
      readabilityScore: '読みやすさ',
      emotionalScore: '感情訴求',
      trendScore: 'トレンド',
      lengthScore: '文量',
      visualScore: 'ビジュアル',
    };

    return Object.entries(result.scores).map(([key, value]) => ({
      subject: scoreLabels[key as keyof AnalysisResultType['scores']],
      value,
      fullMark: 100,
    }));
  }, [result.scores]);

  /**
   * バーチャート用のデータを生成
   */
  const barData = useMemo(() => {
    return radarData.map((item) => ({
      name: item.subject,
      スコア: item.value,
    }));
  }, [radarData]);

  /**
   * 円形グラフ用のデータを生成
   */
  const pieData = useMemo(() => {
    return [
      { name: 'スコア', value: result.viralScore },
      { name: '残り', value: 100 - result.viralScore },
    ];
  }, [result.viralScore]);

  /**
   * スコアに応じた色を取得
   */
  const getScoreColor = (score: number): string => {
    if (score >= 80) return '#8b5cf6'; // purple
    if (score >= 60) return '#10b981'; // green
    if (score >= 40) return '#3b82f6'; // blue
    if (score >= 20) return '#f59e0b'; // yellow
    return '#6b7280'; // gray
  };

  const ratingConfig = getRatingConfig(result.rating);
  const scoreColor = getScoreColor(result.viralScore);

  /**
   * 改善提案を優先度順にソート
   */
  const sortedImprovements = useMemo(() => {
    const priorityOrder = { high: 0, medium: 1, low: 2 };
    return [...result.improvements].sort(
      (a, b) => priorityOrder[a.priority] - priorityOrder[b.priority]
    );
  }, [result.improvements]);

  return (
    <div className="w-full max-w-6xl mx-auto space-y-8 animate-fadeIn">
      {/* ヘッダーセクション: バイラル度スコアとレーティング */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 border-2 border-gray-100 dark:border-gray-700">
        <div className="grid md:grid-cols-2 gap-8 items-center">
          {/* 円形スコアグラフ */}
          <div className="flex flex-col items-center space-y-4">
            <h2 className="text-2xl font-bold text-gray-800 dark:text-white flex items-center gap-2">
              <Target className="w-7 h-7" />
              バイラル度スコア
            </h2>

            <div className="relative w-64 h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    startAngle={90}
                    endAngle={-270}
                    innerRadius={70}
                    outerRadius={100}
                    dataKey="value"
                    animationDuration={1000}
                    animationBegin={0}
                  >
                    <Cell fill={scoreColor} />
                    <Cell fill="#e5e7eb" />
                  </Pie>
                </PieChart>
              </ResponsiveContainer>

              {/* 中央のスコア表示 */}
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-6xl font-bold" style={{ color: scoreColor }}>
                  {result.viralScore}
                </span>
                <span className="text-lg text-gray-500 dark:text-gray-400">/ 100</span>
              </div>
            </div>
          </div>

          {/* レーティングと予測PV */}
          <div className="space-y-6">
            {/* レーティング */}
            <div
              className={`
                p-6 rounded-xl border-2
                ${ratingConfig.bgColor} ${ratingConfig.borderColor}
                transform transition-all duration-300 hover:scale-105
              `}
            >
              <div className={`flex items-center gap-3 mb-3 ${ratingConfig.color}`}>
                {ratingConfig.icon}
                <h3 className="text-2xl font-bold">{ratingConfig.label}</h3>
              </div>
              <p className="text-sm font-medium text-gray-800 dark:text-gray-200">
                {ratingConfig.description}
              </p>
            </div>

            {/* 予測PV */}
            <div className="bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 p-6 rounded-xl border-2 border-blue-200 dark:border-blue-800">
              <div className="flex items-center gap-2 mb-3 text-blue-700 dark:text-blue-300">
                <Eye className="w-6 h-6" />
                <h3 className="text-xl font-bold">予測PV</h3>
              </div>
              <p className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">
                {result.estimatedViews.min.toLocaleString()} 〜{' '}
                {result.estimatedViews.max.toLocaleString()}
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
                推定ページビュー範囲
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* 詳細スコアセクション */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 border-2 border-gray-100 dark:border-gray-700">
        <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-6 flex items-center gap-2">
          <TrendingUp className="w-7 h-7" />
          詳細分析
        </h2>

        {/* スコア詳細テーブル */}
        <div className="mb-8 grid grid-cols-2 md:grid-cols-4 gap-4">
          {radarData.map((item, index) => (
            <div
              key={index}
              className="bg-gradient-to-br from-purple-50 to-blue-50 dark:from-purple-900/20 dark:to-blue-900/20 p-4 rounded-lg border-2 border-purple-200 dark:border-purple-800"
            >
              <div className="text-sm font-semibold text-gray-800 dark:text-gray-200 mb-1">
                {item.subject}
              </div>
              <div className="flex items-baseline gap-1">
                <span
                  className="text-3xl font-bold"
                  style={{ color: getScoreColor(item.value) }}
                >
                  {item.value}
                </span>
                <span className="text-sm font-medium text-gray-600 dark:text-gray-400">/ 100</span>
              </div>
            </div>
          ))}
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* レーダーチャート */}
          <div className="flex flex-col items-center">
            <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-300 mb-4">
              総合バランス
            </h3>
            <div className="bg-gradient-to-br from-purple-50 to-blue-50 dark:from-purple-900/20 dark:to-blue-900/20 p-4 rounded-xl border-2 border-purple-200 dark:border-purple-800 w-full">
              <ResponsiveContainer width="100%" height={300}>
                <RadarChart data={radarData}>
                  <PolarGrid stroke="#d1d5db" />
                  <PolarAngleAxis
                    dataKey="subject"
                    tick={{ fill: '#ffffff', fontSize: 13, fontWeight: 600 }}
                  />
                  <PolarRadiusAxis
                    angle={90}
                    domain={[0, 100]}
                    tick={{ fill: '#ffffff', fontSize: 12, fontWeight: 600 }}
                  />
                  <Radar
                    name="スコア"
                    dataKey="value"
                    stroke="#8b5cf6"
                    fill="#8b5cf6"
                    fillOpacity={0.6}
                    animationDuration={1000}
                  />
                </RadarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* バーチャート */}
          <div className="flex flex-col">
            <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-300 mb-4">
              項目別スコア
            </h3>
            <div className="bg-gradient-to-br from-purple-50 to-blue-50 dark:from-purple-900/20 dark:to-blue-900/20 p-4 rounded-xl border-2 border-purple-200 dark:border-purple-800 w-full">
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={barData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#d1d5db" />
                  <XAxis
                    dataKey="name"
                    tick={{ fill: '#ffffff', fontSize: 12, fontWeight: 600 }}
                    angle={-45}
                    textAnchor="end"
                    height={80}
                  />
                  <YAxis
                    domain={[0, 100]}
                    tick={{ fill: '#ffffff', fontSize: 12, fontWeight: 600 }}
                    label={{
                      value: 'スコア',
                      angle: -90,
                      position: 'insideLeft',
                      style: { fill: '#ffffff', fontWeight: 600, fontSize: 14 }
                    }}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#fff',
                      border: '2px solid #e5e7eb',
                      borderRadius: '8px',
                    }}
                  />
                  <Bar dataKey="スコア" radius={[8, 8, 0, 0]} animationDuration={1000}>
                    {barData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={getScoreColor(entry.スコア)} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>

      {/* 改善提案セクション */}
      {sortedImprovements.length > 0 && (
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 border-2 border-gray-100 dark:border-gray-700">
          <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-6 flex items-center gap-2">
            <Lightbulb className="w-7 h-7 text-yellow-500" />
            改善提案
          </h2>

          <div className="space-y-4">
            {sortedImprovements.map((improvement, index) => {
              const priorityConfig = getPriorityConfig(improvement.priority);
              return (
                <div
                  key={index}
                  className={`
                    p-5 rounded-xl border-2
                    ${priorityConfig.bgColor} ${priorityConfig.borderColor}
                    transform transition-all duration-300 hover:scale-[1.02] hover:shadow-md
                  `}
                  style={{
                    animationDelay: `${index * 100}ms`,
                  }}
                >
                  {/* ヘッダー */}
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <span className={priorityConfig.color}>
                        {priorityConfig.icon}
                      </span>
                      <h3 className="font-bold text-gray-900 dark:text-white">
                        {improvement.category}
                      </h3>
                    </div>
                    <span
                      className={`
                        px-3 py-1 rounded-full text-xs font-semibold
                        ${priorityConfig.color} bg-white dark:bg-gray-800 border-2 ${priorityConfig.borderColor}
                      `}
                    >
                      {priorityConfig.label}
                    </span>
                  </div>

                  {/* 提案内容 */}
                  <p className="text-gray-900 dark:text-gray-100 mb-3 font-medium">
                    {improvement.suggestion}
                  </p>

                  {/* 期待効果 */}
                  <div className="flex items-start gap-2 text-sm text-gray-800 dark:text-gray-200 mb-2">
                    <TrendingUp className="w-4 h-4 mt-0.5 flex-shrink-0 text-green-600" />
                    <span>
                      <strong className="text-gray-900 dark:text-white">期待効果:</strong> {improvement.impact}
                    </span>
                  </div>

                  {/* 具体例 */}
                  {improvement.example && (
                    <div className="mt-3 p-3 bg-white dark:bg-gray-800 rounded-lg border-2 border-gray-300 dark:border-gray-600">
                      <p className="text-sm text-gray-900 dark:text-gray-100">
                        <strong className="text-gray-900 dark:text-white">例:</strong> {improvement.example}
                      </p>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* 強みセクション */}
      {result.strengths.length > 0 && (
        <div className="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-2xl shadow-xl p-8 border-2 border-green-200 dark:border-green-800">
          <h2 className="text-2xl font-bold text-green-800 dark:text-green-300 mb-6 flex items-center gap-2">
            <Award className="w-7 h-7" />
            記事の強み
          </h2>

          <div className="grid md:grid-cols-2 gap-4">
            {result.strengths.map((strength, index) => (
              <div
                key={index}
                className="flex items-start gap-3 p-4 bg-white/70 dark:bg-gray-800/70 rounded-lg border border-green-200 dark:border-green-700 transform transition-all duration-300 hover:scale-105"
                style={{
                  animationDelay: `${index * 100}ms`,
                }}
              >
                <div className="flex-shrink-0 w-6 h-6 rounded-full bg-green-500 flex items-center justify-center">
                  <span className="text-white text-sm font-bold">✓</span>
                </div>
                <p className="text-gray-700 dark:text-gray-300 flex-1">{strength}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* フッター: 分析日時 */}
      <div className="text-center text-sm text-gray-500 dark:text-gray-400">
        分析日時: {new Date(result.analyzedAt).toLocaleString('ja-JP')}
      </div>

      {/* アニメーション用のCSS */}
      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-fadeIn {
          animation: fadeIn 0.6s ease-out;
        }
      `}</style>
    </div>
  );
}
