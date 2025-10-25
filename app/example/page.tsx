'use client';

import { useState } from 'react';
import { ArticleForm, AnalysisResult } from '@/components';
import type { AnalysisResult as AnalysisResultType } from '@/types';
import { Sparkles } from 'lucide-react';

/**
 * Example Page - Components Demo
 *
 * @description
 * ArticleForm と AnalysisResult コンポーネントの使用例を示すデモページ。
 * 実際のAPI実装前のUIテストや開発時のリファレンスとして使用できます。
 *
 * @example
 * アクセス: http://localhost:3000/example
 */
export default function ExamplePage() {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState<AnalysisResultType | null>(null);

  /**
   * 分析実行ハンドラー（実際のAPIを呼び出す）
   *
   * @param title - 記事タイトル
   * @param content - 記事本文
   */
  const handleAnalyze = async (title: string, content: string) => {
    setIsAnalyzing(true);
    setResult(null);

    try {
      // 実際のAPI呼び出し
      const response = await fetch('/api/analyze', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ title, content }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'API呼び出しに失敗しました');
      }

      const analysisResult: AnalysisResultType = await response.json();
      setResult(analysisResult);
    } catch (error) {
      console.error('分析エラー:', error);
      alert(
        error instanceof Error
          ? `エラー: ${error.message}`
          : '分析中にエラーが発生しました。もう一度お試しください。'
      );
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-purple-50 dark:from-gray-900 dark:via-gray-900 dark:to-gray-900">
      {/* ヘッダー */}
      <header className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-b border-gray-200 dark:border-gray-700 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                <Sparkles className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                  note バイラル度予測AI
                </h1>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  デモページ - コンポーネント使用例
                </p>
              </div>
            </div>
            <div className="px-4 py-2 bg-blue-100 dark:bg-blue-900 rounded-lg">
              <span className="text-sm font-semibold text-blue-800 dark:text-blue-200">
                サンプルデータ使用中
              </span>
            </div>
          </div>
        </div>
      </header>

      {/* メインコンテンツ */}
      <main className="py-12 px-4">
        <div className="max-w-7xl mx-auto space-y-12">
          {/* 説明セクション */}
          <div className="max-w-4xl mx-auto">
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8 border border-gray-200 dark:border-gray-700">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                使い方
              </h2>
              <ol className="list-decimal list-inside space-y-2 text-gray-700 dark:text-gray-300">
                <li>下のフォームに記事のタイトルと本文を入力してください</li>
                <li>「バイラル度を分析」ボタンをクリックします</li>
                <li>Claude Sonnet 4.5によるAI分析結果が表示されます（10-20秒）</li>
                <li>8項目の詳細スコア、改善提案、強みなどを確認できます</li>
              </ol>
              <div className="mt-4 p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
                <p className="text-sm text-green-800 dark:text-green-200">
                  <strong>✓ AI分析有効:</strong> Claude Sonnet 4.5を使用した実際のAI分析を行います。
                  プロンプトキャッシング機能により、2回目以降のリクエストで90%のコスト削減を実現しています。
                </p>
              </div>
            </div>
          </div>

          {/* フォーム */}
          <div>
            <ArticleForm
              onAnalyze={handleAnalyze}
              isAnalyzing={isAnalyzing}
              disabled={false}
            />
          </div>

          {/* 分析結果 */}
          {result && (
            <div className="animate-fadeIn">
              <AnalysisResult result={result} />
            </div>
          )}

          {/* フッター情報 */}
          {!result && (
            <div className="max-w-4xl mx-auto">
              <div className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-2xl p-8 border border-blue-200 dark:border-blue-800">
                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">
                  コンポーネントの特徴
                </h3>
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-semibold text-gray-800 dark:text-gray-200 mb-2">
                      ArticleForm
                    </h4>
                    <ul className="text-sm text-gray-700 dark:text-gray-300 space-y-1">
                      <li>✓ リアルタイムバリデーション</li>
                      <li>✓ 文字数カウント表示</li>
                      <li>✓ アクセシビリティ対応</li>
                      <li>✓ ローディング状態表示</li>
                      <li>✓ ダークモード対応</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-800 dark:text-gray-200 mb-2">
                      AnalysisResult
                    </h4>
                    <ul className="text-sm text-gray-700 dark:text-gray-300 space-y-1">
                      <li>✓ 円形スコアグラフ</li>
                      <li>✓ レーダーチャート</li>
                      <li>✓ バーチャート</li>
                      <li>✓ 優先度別改善提案</li>
                      <li>✓ スムーズなアニメーション</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>

      {/* アニメーション用CSS */}
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
