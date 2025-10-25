# note バイラル度予測AI（Claude版）

noteの記事がバズる可能性をAnthropic Claudeが分析。タイトル、構成、読みやすさなど8つの観点から総合スコアを算出し、具体的な改善提案を提供します。

## 🎯 主な機能

- **8項目分析**: タイトル、フック、構成、読みやすさ、感情訴求、トレンド、文字数、視覚要素
- **総合スコア**: 0-100点のバイラル度スコア
- **改善提案**: 優先度付きの具体的な改善アドバイス
- **PV予測**: 記事の予測閲覧数範囲
- **フリーミアムモデル**: 月3回無料、プレミアムで無制限

## 🆕 Claude版の特徴

### OpenAI版との違い

| 項目 | Claude版 | OpenAI版（従来） |
|------|----------|------------------|
| **AIモデル** | Claude 3.5 Sonnet | GPT-4 Turbo |
| **API提供元** | Anthropic | OpenAI |
| **コスト** | 入力$3/MTok, 出力$15/MTok | 入力$10/MTok, 出力$30/MTok |
| **1回の分析** | 約$0.01-0.03 | 約$0.03-0.06 |
| **応答品質** | 高精度・詳細 | 高精度 |
| **日本語対応** | 非常に優秀 | 優秀 |
| **コンテキスト** | 200K tokens | 128K tokens |

### Claude版のメリット

1. **コストが約50-70%安い**
   - 1回の分析: $0.01-0.03（OpenAI: $0.03-0.06）
   - 1000回/月: $10-30（OpenAI: $30-60）

2. **日本語の理解が優秀**
   - note特有の日本語表現を正確に理解
   - 細かいニュアンスを捉えた改善提案

3. **安全性・信頼性**
   - Anthropic Constitutional AIによる安全設計
   - より倫理的で公平な評価

4. **長文対応**
   - 200Kトークンまで対応（OpenAIの1.5倍以上）
   - 長い記事でも問題なく分析可能

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

`.env.local` にAnthropic APIキーを設定：

```env
ANTHROPIC_API_KEY=sk-ant-your-actual-api-key-here
```

> **Anthropic APIキーの取得方法:**
> 1. https://console.anthropic.com にアクセス
> 2. アカウントを作成（GitHubでサインアップ可能）
> 3. Settings → API Keys で "Create Key" をクリック
> 4. キーをコピーして保存

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
│   │   └── analyze/
│   │       ├── route.ts              # Claude AI分析API
│   │       └── route.openai.ts.bak   # OpenAI版（バックアップ）
│   ├── layout.tsx
│   └── page.tsx
├── components/
│   ├── ArticleForm.tsx
│   ├── AnalysisResult.tsx
│   └── index.ts
├── types/
│   └── index.ts
├── .env.local.example
└── README_CLAUDE.md (このファイル)
```

## 🔧 技術スタック

- **Frontend**: Next.js 15, React 19, TypeScript
- **Styling**: Tailwind CSS v4
- **Charts**: Recharts
- **Icons**: Lucide React
- **AI**: **Anthropic Claude 3.5 Sonnet** ⭐NEW
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
git commit -m "feat: note viral predictor with Claude AI"
git branch -M main
git remote add origin https://github.com/yourusername/note-viral-predictor.git
git push -u origin main
```

### 2. Vercelにデプロイ

1. [Vercel](https://vercel.com) にログイン
2. "New Project" をクリック
3. GitHubリポジトリをインポート
4. 環境変数を設定:
   - `ANTHROPIC_API_KEY`: `sk-ant-your-api-key-here`
5. "Deploy" をクリック

### 3. 環境変数の設定（Vercel Dashboard）

Settings → Environment Variables で以下を追加：

- `ANTHROPIC_API_KEY`: `sk-ant-your-api-key-here`
- `ANTHROPIC_MODEL`: `claude-3-5-sonnet-20241022` (オプション)
- `ANTHROPIC_TEMPERATURE`: `0.7` (オプション)

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

## 💰 料金比較

### Claude版（推奨）

#### 開発・テスト
- **Anthropic**: 初回$5のクレジット
  - 約300-500回分析可能
  - OpenAIの2-3倍の無料枠

#### 本番運用（1000回/月分析）
- **Vercel**: $0（Hobbyプラン）
- **Anthropic API**: $10-30
- **合計**: $10-30/月

### OpenAI版（従来）

#### 本番運用（1000回/月分析）
- **Vercel**: $0
- **OpenAI API**: $30-60
- **合計**: $30-60/月

**コスト削減**: Claude版で約50-70%削減！

## 🎨 Claude専用の最適化

### 1. プロンプトエンジニアリング
- Claude特有の指示形式に最適化
- JSON出力の信頼性向上
- より詳細で具体的な改善提案

### 2. 日本語処理
- note特有の表現を正確に理解
- 日本語の微妙なニュアンスを捉える
- 自然な日本語での改善提案

### 3. 安全性
- Constitutional AIによる倫理的な評価
- 偏見の少ない公平な分析
- 有害なコンテンツの適切な検出

## 🔐 セキュリティ

- 環境変数は `.env.local` で管理（Gitに含めない）
- APIキーはサーバーサイドのみで使用
- CORS設定によるAPIアクセス制限

## 📈 料金プラン（予定）

- **無料プラン**: 月3回まで分析可能
- **プレミアムプラン**: $9.99/月（OpenAI版より安価）
  - 無制限の分析
  - 詳細な分析レポート
  - 競合記事との比較機能
  - 過去の分析履歴保存

## 🆚 OpenAI版に戻すには

OpenAI版を使いたい場合：

```bash
# Claudeバックアップ
mv app/api/analyze/route.ts app/api/analyze/route.claude.ts

# OpenAI復元
mv app/api/analyze/route.openai.ts.bak app/api/analyze/route.ts

# 依存関係
npm install openai

# 環境変数
# OPENAI_API_KEY=sk-your-openai-key
```

## 📝 ライセンス

MIT License

## 🤝 コントリビューション

プルリクエストを歓迎します！

---

**Claude 3.5 Sonnet** で構築 - より安く、より高品質な分析を実現
