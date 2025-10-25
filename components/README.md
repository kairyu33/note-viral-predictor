# Note Viral Predictor Components

このディレクトリには、note記事のバイラル度予測機能を実装するためのReactコンポーネントが含まれています。

## コンポーネント一覧

### 1. ArticleForm
記事のタイトルと本文を入力するフォームコンポーネント。

**機能:**
- リアルタイムバリデーション
- 文字数カウント（視覚的なフィードバック付き）
- アクセシビリティ対応（ARIA属性、スクリーンリーダー対応）
- ローディング状態の表示
- 美しいアニメーション

**Props:**
- `onAnalyze: (title: string, content: string) => void` - 分析実行時のコールバック
- `isAnalyzing: boolean` - 分析中の状態フラグ
- `disabled?: boolean` - フォーム全体の無効化フラグ

**バリデーション:**
- タイトル: 1-100文字
- 本文: 100-50,000文字

### 2. AnalysisResult
AI分析結果を視覚的に表示するコンポーネント。

**機能:**
- バイラル度スコアの円形グラフ表示
- レーティング表示（low/medium/high/viral）
- 8項目の詳細スコア（レーダーチャート + バーチャート）
- 改善提案リスト（優先度別に色分け）
- 強みリスト
- 予測PV範囲の表示
- スムーズなアニメーション

**Props:**
- `result: AnalysisResult` - AI分析結果データ（`/types/index.ts` で定義）

## 使用例

### 基本的な使用方法

```tsx
'use client';

import { useState } from 'react';
import { ArticleForm, AnalysisResult } from '@/components';
import type { AnalysisResult as AnalysisResultType } from '@/types';

export default function AnalyzerPage() {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState<AnalysisResultType | null>(null);

  const handleAnalyze = async (title: string, content: string) => {
    setIsAnalyzing(true);
    setResult(null);

    try {
      // API呼び出し
      const response = await fetch('/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, content }),
      });

      if (!response.ok) {
        throw new Error('Analysis failed');
      }

      const data = await response.json();
      setResult(data);
    } catch (error) {
      console.error('Analysis error:', error);
      alert('分析に失敗しました。もう一度お試しください。');
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12 px-4">
      <div className="max-w-7xl mx-auto space-y-12">
        <header className="text-center">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            note バイラル度予測AI
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-400">
            記事のバイラル性を分析し、改善提案を提供します
          </p>
        </header>

        {/* フォーム */}
        <ArticleForm
          onAnalyze={handleAnalyze}
          isAnalyzing={isAnalyzing}
          disabled={false}
        />

        {/* 分析結果 */}
        {result && (
          <div className="mt-12">
            <AnalysisResult result={result} />
          </div>
        )}
      </div>
    </div>
  );
}
```

### より高度な例（エラーハンドリング付き）

```tsx
'use client';

import { useState } from 'react';
import { ArticleForm, AnalysisResult } from '@/components';
import type { AnalysisResult as AnalysisResultType } from '@/types';

export default function AdvancedAnalyzerPage() {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState<AnalysisResultType | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [usage, setUsage] = useState({ count: 0, limit: 10 });

  const handleAnalyze = async (title: string, content: string) => {
    // 使用制限チェック
    if (usage.count >= usage.limit) {
      alert('月間の分析回数上限に達しました。');
      return;
    }

    setIsAnalyzing(true);
    setResult(null);
    setError(null);

    try {
      const response = await fetch('/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, content }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Analysis failed');
      }

      const data = await response.json();
      setResult(data.result);
      setUsage((prev) => ({ ...prev, count: prev.count + 1 }));
    } catch (error) {
      const message = error instanceof Error ? error.message : '不明なエラー';
      setError(message);
      console.error('Analysis error:', error);
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12 px-4">
      <div className="max-w-7xl mx-auto space-y-12">
        {/* ヘッダー */}
        <header className="text-center">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            note バイラル度予測AI
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-400 mb-4">
            記事のバイラル性を分析し、改善提案を提供します
          </p>
          {/* 使用回数表示 */}
          <div className="inline-block px-4 py-2 bg-blue-100 dark:bg-blue-900 rounded-lg">
            <span className="text-sm text-blue-800 dark:text-blue-200">
              今月の分析回数: {usage.count} / {usage.limit}
            </span>
          </div>
        </header>

        {/* エラーメッセージ */}
        {error && (
          <div
            className="max-w-4xl mx-auto p-4 bg-red-50 dark:bg-red-900/20 border-2 border-red-200 dark:border-red-800 rounded-lg"
            role="alert"
          >
            <p className="text-red-800 dark:text-red-200">
              <strong>エラー:</strong> {error}
            </p>
          </div>
        )}

        {/* フォーム */}
        <ArticleForm
          onAnalyze={handleAnalyze}
          isAnalyzing={isAnalyzing}
          disabled={usage.count >= usage.limit}
        />

        {/* 分析結果 */}
        {result && (
          <div className="mt-12">
            <AnalysisResult result={result} />
          </div>
        )}
      </div>
    </div>
  );
}
```

## スタイリング

両コンポーネントは **Tailwind CSS** を使用してスタイリングされています。

### 主要なデザイン要素:
- レスポンシブデザイン（モバイル、タブレット、デスクトップ対応）
- ダークモード対応
- スムーズなアニメーション
- アクセシビリティ対応
- 視覚的フィードバック（ホバー、フォーカス、ローディング）

### カスタマイズ

Tailwind CSSのクラスを変更することで、簡単にカスタマイズできます:

```tsx
// 例: ボタンの色を変更
<ArticleForm
  onAnalyze={handleAnalyze}
  isAnalyzing={false}
  // ArticleForm.tsxの送信ボタンのクラスを編集
/>
```

## 依存ライブラリ

- **lucide-react**: アイコンライブラリ
- **recharts**: グラフ描画ライブラリ
- **react**: Reactフレームワーク
- **tailwindcss**: ユーティリティファーストCSSフレームワーク

## パフォーマンス最適化

### ArticleForm
- `useCallback` でイベントハンドラーをメモ化
- 不要な再レンダリングを防止
- リアルタイムバリデーションは必要時のみ実行

### AnalysisResult
- `useMemo` でグラフデータをメモ化
- 重いデータ変換は1回のみ実行
- アニメーションはGPUアクセラレーション対応

## アクセシビリティ

両コンポーネントは WCAG 2.1 AA 基準に準拠:

- セマンティックHTML使用
- ARIA属性の適切な設定
- キーボードナビゲーション対応
- スクリーンリーダー対応
- 十分なカラーコントラスト
- フォーカスインジケーター

## トラブルシューティング

### TypeScriptエラー: 型が見つからない
```bash
# types/index.ts が正しくインポートされているか確認
import type { AnalysisResult } from '@/types';
```

### スタイルが適用されない
```bash
# Tailwind CSSの設定を確認
# tailwind.config.js が正しく設定されているか確認
```

### グラフが表示されない
```bash
# rechartsがインストールされているか確認
npm install recharts
```

## 今後の改善案

1. **プログレッシブエンハンスメント**
   - JavaScriptなしでも基本機能が動作するようにする

2. **オフライン対応**
   - Service Workerでキャッシュ機能を追加

3. **リアルタイムプレビュー**
   - 入力中にスコアをリアルタイムで表示

4. **A/Bテスト機能**
   - 複数のタイトル案を比較分析

5. **履歴機能**
   - 過去の分析結果を保存・比較

## ライセンス

このコンポーネントは note-viral-predictor プロジェクトの一部です。
