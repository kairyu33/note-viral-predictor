# note バイラル度予測AI

noteの記事がバズる可能性をAIが分析。タイトル、構成、読みやすさなど8つの観点から総合スコアを算出し、具体的な改善提案を提供します。

## 🎯 主な機能

- **8項目分析**: タイトル、フック、構成、読みやすさ、感情訴求、トレンド、文字数、視覚要素
- **総合スコア**: 0-100点のバイラル度スコア
- **改善提案**: 優先度付きの具体的な改善アドバイス
- **PV予測**: 記事の予測閲覧数範囲
- **フリーミアムモデル**: 月3回無料、プレミアムで無制限

## 🚀 クイックスタート

### 1. 依存関係のインストール

```bash
npm install
```

### 2. 環境変数の設定

`.env.local.example` をコピーして `.env.local` を作成：

```bash
cp .env.local.example .env.local
```

`.env.local` にOpenAI APIキーを設定：

```env
OPENAI_API_KEY=sk-your-actual-api-key-here
```

> OpenAI APIキーは https://platform.openai.com/api-keys で取得できます

### 3. 開発サーバーの起動

```bash
npm run dev
```

ブラウザで http://localhost:3000 を開いてアプリを確認

## 📁 プロジェクト構造

```
note-viral-predictor/
├── app/
│   ├── api/
│   │   └── analyze/          # AI分析APIエンドポイント
│   │       └── route.ts
│   ├── layout.tsx            # ルートレイアウト
│   └── page.tsx              # メインページ
├── components/
│   ├── ArticleForm.tsx       # 記事入力フォーム
│   ├── AnalysisResult.tsx    # 分析結果表示
│   └── index.ts
├── types/
│   └── index.ts              # TypeScript型定義
├── .env.local.example        # 環境変数テンプレート
├── .env.local                # 環境変数（gitignore済み）
└── README.md
```

## 🔧 技術スタック

- **Frontend**: Next.js 15, React 19, TypeScript
- **Styling**: Tailwind CSS v4
- **Charts**: Recharts
- **Icons**: Lucide React
- **AI**: OpenAI GPT-4
- **Deployment**: Vercel

## 📊 API仕様

### POST /api/analyze

記事を分析してバイラル度スコアを返します。

**リクエスト**:
```json
{
  "title": "記事タイトル",
  "content": "記事本文..."
}
```

**レスポンス**:
```json
{
  "viralScore": 75,
  "rating": "high",
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
      "suggestion": "...",
      "impact": "...",
      "example": "..."
    }
  ],
  "strengths": ["..."],
  "estimatedViews": {
    "min": 1000,
    "max": 10000
  },
  "analyzedAt": "2025-10-24T10:30:00.000Z"
}
```

## 🚢 Vercelへのデプロイ

### 1. GitHubリポジトリの作成

```bash
git init
git add .
git commit -m "Initial commit: note viral predictor"
git branch -M main
git remote add origin https://github.com/yourusername/note-viral-predictor.git
git push -u origin main
```

### 2. Vercelにデプロイ

1. [Vercel](https://vercel.com) にログイン
2. "New Project" をクリック
3. GitHubリポジトリをインポート
4. 環境変数を設定:
   - `OPENAI_API_KEY`: あなたのOpenAI APIキー
5. "Deploy" をクリック

### 3. 環境変数の設定（Vercel Dashboard）

Settings → Environment Variables で以下を追加：

- `OPENAI_API_KEY`: `sk-your-api-key-here`

## 💡 使い方

1. **記事タイトルを入力**: noteに投稿予定の記事タイトルを入力
2. **記事本文を入力**: 記事の本文を入力（最低100文字推奨）
3. **AIで分析**: ボタンをクリックして分析開始
4. **結果を確認**: 
   - 総合バイラル度スコア（0-100）
   - 8項目の詳細スコア
   - 優先度付き改善提案
   - 記事の強み
   - 予測PV範囲
5. **改善**: 提案に基づいて記事を修正し、再分析

## 🎨 カスタマイズ

### スコアリングの重みを変更

`app/api/analyze/route.ts` の重み設定を編集：

```typescript
const weights = {
  titleScore: 0.20,      // タイトル 20%
  hookScore: 0.20,       // フック 20%
  structureScore: 0.10,  // 構成 10%
  // ... その他
};
```

### AI分析の温度調整

より創造的な分析: `.env.local` で `OPENAI_TEMPERATURE=0.9`
より一貫した分析: `.env.local` で `OPENAI_TEMPERATURE=0.5`

## 📈 料金プラン（予定）

- **無料プラン**: 月3回まで分析可能
- **プレミアムプラン**: $15.99/月
  - 無制限の分析
  - 詳細な分析レポート
  - 競合記事との比較機能
  - 過去の分析履歴保存

## 🔐 セキュリティ

- 環境変数は `.env.local` で管理（Gitに含めない）
- APIキーはサーバーサイドのみで使用
- CORS設定によるAPIアクセス制限

## 📝 ライセンス

MIT License

## 🤝 コントリビューション

プルリクエストを歓迎します！

1. このリポジトリをフォーク
2. 機能ブランチを作成 (`git checkout -b feature/amazing-feature`)
3. 変更をコミット (`git commit -m 'Add amazing feature'`)
4. ブランチにプッシュ (`git push origin feature/amazing-feature`)
5. プルリクエストを作成

## 📧 サポート

問題が発生した場合は、GitHubのIssuesで報告してください。

---

Made with ❤️ using Next.js, OpenAI, and Tailwind CSS
