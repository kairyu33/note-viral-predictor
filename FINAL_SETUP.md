# 🚀 最終セットアップガイド

## ✅ 完成した機能

### コア機能
- ✅ **記事入力フォーム**: タイトル・本文の入力とバリデーション
- ✅ **AI分析エンジン**: OpenAI GPT-4による8項目評価
- ✅ **スコアリング**: 0-100点のバイラル度総合スコア
- ✅ **改善提案**: 優先度付きの具体的アドバイス
- ✅ **PV予測**: 記事の予測閲覧数範囲
- ✅ **使用回数制限**: フリーミアムモデル（3回/月無料）

### UI/UX
- ✅ **レスポンシブデザイン**: スマホ・タブレット・PC対応
- ✅ **美しいグラフ**: 円グラフ、レーダーチャート、バーチャート
- ✅ **アニメーション**: スムーズなローディングと表示
- ✅ **アクセシビリティ**: WCAG 2.1 AA準拠
- ✅ **ダークモード対応**: システム設定に自動追従

### 技術スタック
- ✅ Next.js 16 (App Router)
- ✅ React 19
- ✅ TypeScript
- ✅ Tailwind CSS v4
- ✅ OpenAI GPT-4 Turbo
- ✅ Recharts（グラフライブラリ）
- ✅ Lucide React（アイコン）

## 🎬 今すぐ始める - 3ステップ

### ステップ 1: 環境変数の設定

```bash
# .env.local ファイルを作成
cp .env.local.example .env.local

# エディタで開く（Windows）
notepad .env.local

# または VSCode
code .env.local
```

`.env.local` にOpenAI APIキーを貼り付け：

```env
OPENAI_API_KEY=sk-proj-xxxxxxxxxxxxxxxxx
```

> 💡 OpenAI APIキーの取得方法:
> 1. https://platform.openai.com/api-keys にアクセス
> 2. "Create new secret key" をクリック
> 3. キーをコピーして保存

### ステップ 2: 開発サーバーの起動

```bash
npm run dev
```

ターミナルに表示されるURLをクリック:
```
✓ Ready in 2.3s
○ Local:   http://localhost:3000
```

### ステップ 3: アプリを試す

1. ブラウザで http://localhost:3000 を開く
2. サンプル記事を入力:
   - タイトル: `副業で月10万円稼ぐための3つの戦略`
   - 本文: 適当な記事本文（300文字以上推奨）
3. "AIで分析する" ボタンをクリック
4. 2-5秒後に分析結果が表示される！

## 📊 分析結果の見方

### 総合スコア
- **0-40点**: Low（改善余地大）
- **41-69点**: Medium（平均的）
- **70-84点**: High（良質）
- **85-100点**: Viral（バズる可能性大）

### 8項目の詳細
1. **タイトルスコア** (20%): タイトルの魅力度
2. **フックスコア** (20%): 冒頭の引き込み力
3. **構成スコア** (10%): 記事の論理構成
4. **読みやすさスコア** (10%): 文章の分かりやすさ
5. **感情スコア** (15%): 感情への訴求力
6. **トレンドスコア** (15%): トレンド性・話題性
7. **文字数スコア** (5%): 最適な文字数
8. **視覚スコア** (5%): 視覚的な表現力

### 改善提案
- 🔴 **High**: 最優先で改善すべきポイント
- 🟡 **Medium**: 改善すると効果的なポイント
- 🔵 **Low**: 余裕があれば改善するポイント

## 🚢 Vercelへデプロイ

### 前提条件
- GitHubアカウント
- Vercelアカウント（無料）

### デプロイ手順

```bash
# 1. Gitリポジトリの初期化
git init
git add .
git commit -m "feat: note viral predictor - initial release"

# 2. GitHubにプッシュ（GitHub CLI使用）
gh repo create note-viral-predictor --public --source=. --remote=origin --push

# または手動で:
# - GitHubでリポジトリを作成
# - git remote add origin https://github.com/YOUR_USERNAME/note-viral-predictor.git
# - git push -u origin main
```

### Vercelでの設定

1. **Vercelにログイン**: https://vercel.com
2. **"New Project" → GitHubリポジトリを選択**
3. **環境変数を設定**:
   ```
   OPENAI_API_KEY = sk-your-key-here
   ```
4. **"Deploy" をクリック**
5. **完了！**: 2-3分でデプロイ完了

デプロイURL: `https://note-viral-predictor.vercel.app`

## 💰 コスト見積もり

### 無料枠（開発・テスト）
- **Vercel Hobby**: 完全無料
  - 月100GB帯域幅
  - 無制限のプレビュー環境
- **OpenAI**: $5のクレジット（初回登録時）
  - 約100-150回分析可能

### 本番運用
- **Vercel**: 無料（Hobbyプラン）または $20/月（Proプラン）
- **OpenAI**: 従量課金
  - 1回の分析: $0.03-0.06
  - 100回/月: $3-6
  - 1000回/月: $30-60

## 🔧 カスタマイズ

### 無料利用回数の変更

`app/page.tsx` の3行目付近:

```typescript
const MAX_FREE_USAGE = 3; // ← ここを変更（例: 5, 10）
```

### AIモデルの変更

`.env.local`:

```env
OPENAI_MODEL=gpt-4-turbo  # または gpt-4, gpt-3.5-turbo
```

### スコアリング重みの調整

`app/api/analyze/route.ts` の重み設定:

```typescript
const weights = {
  titleScore: 0.25,      // タイトル重視に変更
  hookScore: 0.15,       // フック重視度を下げる
  // ... その他
};
```

## 🐛 トラブルシューティング

### ビルドエラー

```bash
# 依存関係を再インストール
rm -rf node_modules package-lock.json
npm install
npm run build
```

### API エラー: "OPENAI_API_KEY is not defined"

1. `.env.local` ファイルが存在するか確認
2. `OPENAI_API_KEY=sk-...` が正しく設定されているか確認
3. 開発サーバーを再起動: `Ctrl+C` → `npm run dev`

### API エラー: "429 Too Many Requests"

OpenAIのレート制限に達しています:
- 少し待ってから再試行
- OpenAI Dashboardで使用量を確認
- 必要に応じてTierをアップグレード

### 分析が遅い

- 通常2-10秒程度かかります
- インターネット接続を確認
- OpenAI APIのステータスを確認: https://status.openai.com

## 📚 ドキュメント一覧

プロジェクト内の詳細ドキュメント:

- `README.md` - プロジェクト概要
- `DEPLOYMENT.md` - デプロイメント詳細ガイド
- `SETUP.md` - セットアップ詳細手順
- `QUICK_START.md` - クイックスタート
- `app/api/analyze/README.md` - API仕様
- `components/README.md` - コンポーネント仕様

## 🎯 次のステップ

### 機能拡張アイデア

1. **ユーザー認証** (Firebase Auth / NextAuth.js)
   - アカウント作成・ログイン
   - 分析履歴の保存
   - プレミアムプランの実装

2. **データベース統合** (Supabase / Vercel Postgres)
   - 分析結果の永続化
   - 使用回数の管理
   - 過去記事との比較

3. **支払い機能** (Stripe)
   - プレミアムプラン($15.99/月)
   - サブスクリプション管理
   - 請求書発行

4. **高度な分析機能**
   - 競合記事との比較
   - トレンドワード提案
   - 最適な公開時間の提案
   - SEOスコアリング

5. **SNS連携**
   - Twitter/X でシェア
   - note直接投稿
   - 分析結果の画像生成

6. **通知機能**
   - メール通知
   - Slack連携
   - Webhook対応

## 🎉 おめでとうございます！

note バイラル度予測AIの開発が完了しました！

### 実装された機能まとめ
- ✅ 完全なUI/UXデザイン
- ✅ AI分析エンジン（GPT-4）
- ✅ 8項目評価システム
- ✅ 改善提案生成
- ✅ PV予測
- ✅ フリーミアムモデル
- ✅ レスポンシブデザイン
- ✅ TypeScript完全対応
- ✅ 本番環境対応
- ✅ デプロイ準備完了

### 今すぐできること
1. ローカルで動作確認
2. Vercelにデプロイ
3. 実際のnote記事で試す
4. フィードバックを元に改善
5. SNSでシェア！

---

**質問・サポート**: GitHubのIssuesで受け付けています
**貢献**: プルリクエスト大歓迎！

Happy Coding! 🚀
