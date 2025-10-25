/**
 * バイラル度予測AIの型定義
 */

/**
 * 分析結果の型定義
 */
export interface AnalysisResult {
  /** 総合バイラル度スコア (0-100) */
  viralScore: number;
  /** スコアのレーティング */
  rating: 'low' | 'medium' | 'high' | 'viral';
  /** 各項目の詳細スコア */
  scores: {
    titleScore: number;
    hookScore: number;
    structureScore: number;
    readabilityScore: number;
    emotionalScore: number;
    trendScore: number;
    lengthScore: number;
    visualScore: number;
  };
  /** 改善提案 */
  improvements: Improvement[];
  /** 強み */
  strengths: string[];
  /** 予測PV範囲 */
  estimatedViews: {
    min: number;
    max: number;
  };
  /** 分析実行日時 */
  analyzedAt: string;
}

/**
 * 改善提案の型定義
 */
export interface Improvement {
  /** 改善カテゴリ */
  category: string;
  /** 優先度 */
  priority: 'high' | 'medium' | 'low';
  /** 改善提案の説明 */
  suggestion: string;
  /** 期待される効果 */
  impact: string;
  /** 具体的な例 */
  example?: string;
}

/**
 * 記事入力の型定義
 */
export interface ArticleInput {
  /** 記事タイトル */
  title: string;
  /** 記事本文 */
  content: string;
  /** カテゴリ（オプション） */
  category?: string;
}

/**
 * 使用制限の型定義
 */
export interface UsageLimit {
  /** 使用回数 */
  count: number;
  /** 月間上限 */
  limit: number;
  /** リセット日 */
  resetDate: string;
  /** プレミアムユーザーか */
  isPremium: boolean;
}
