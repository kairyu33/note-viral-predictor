# Vercel デプロイガイド

## 🚀 デプロイ手順

### 方法1: Vercelダッシュボード（推奨・簡単）

1. **Vercelにアクセス**
   - https://vercel.com にアクセス
   - GitHubアカウントでサインアップ/ログイン

2. **新規プロジェクトを作成**
   - "Add New..." → "Project" をクリック
   - "Import Git Repository" で `note-viral-predictor` を検索
   - https://github.com/kairyu33/note-viral-predictor を選択

3. **環境変数を設定**
   - "Environment Variables" セクションで以下を追加:

   ```
   名前: ANTHROPIC_API_KEY
   値: [.env.localファイルからコピー]

   名前: ANTHROPIC_MODEL
   値: claude-sonnet-4-5-20250929

   名前: ANTHROPIC_TEMPERATURE
   値: 0.7
   ```

   **重要**: `ANTHROPIC_API_KEY` の値は、ローカルの `.env.local` ファイルから取得してください。

4. **デプロイ**
   - "Deploy" ボタンをクリック
   - 約2-3分でデプロイ完了
   - デプロイURL（例: `https://note-viral-predictor.vercel.app`）が表示されます

### 方法2: Vercel CLI（コマンドライン）

1. **Vercelにログイン**
   ```bash
   cd note-viral-predictor
   npx vercel login
   ```
   - ブラウザが開くのでログイン

2. **デプロイ**
   ```bash
   npx vercel --prod
   ```
   - 環境変数の入力を求められたら上記の値を入力

## 🔒 セキュリティ機能

デプロイ済みのセキュリティ対策:

### ✅ レート制限
- **制限**: 1時間あたり10リクエスト（IPアドレスベース）
- **目的**: API不正使用とコスト超過を防止
- **実装**: `/lib/rateLimit.ts`

制限超過時のレスポンス:
```json
{
  "error": "レート制限を超えました。しばらくしてから再度お試しください。",
  "retryAfter": "2025-10-25T12:00:00.000Z"
}
```

### ✅ 環境変数の保護
- APIキーは環境変数として設定（`.env*`は`.gitignore`済み）
- Vercelダッシュボードで暗号化して保存

### ✅ 入力バリデーション
- タイトル: 最大200文字
- 本文: 最大50,000文字
- 不正なリクエストは400エラーで拒否

## 📊 デプロイ後の確認

### 1. アプリケーションの動作確認
- `https://[your-app].vercel.app/example` にアクセス
- 記事タイトルと本文を入力して分析を実行
- 結果が正しく表示されるか確認

### 2. API使用状況の確認
- `https://[your-app].vercel.app/usage` にアクセス
- トークン使用量とコストが記録されているか確認

### 3. レート制限のテスト
- 1時間に11回以上リクエストを送信
- 429エラーが返されることを確認

## 💰 コスト管理

### プロンプトキャッシング効果
- **初回リクエスト**: キャッシュ作成（25%プレミアム）
- **2回目以降**: キャッシュ読み取り（90%削減）
  - 通常: $3.00/1M tokens
  - キャッシュ: $0.30/1M tokens（$2.70節約）

### 推定コスト（10リクエスト/時間の場合）
- 1リクエスト: 約$0.005-0.01（約0.7-1.4円）
- 1日（240リクエスト）: 約$1.2-2.4（約168-336円）
- 1ヶ月（7,200リクエスト）: 約$36-72（約5,040-10,080円）

※ レート制限により、最大でも240リクエスト/日

### コスト削減のヒント
1. **レート制限の調整**: `/lib/rateLimit.ts` で制限を変更
2. **キャッシュの活用**: システムプロンプトは自動でキャッシュ
3. **使用状況モニタリング**: `/usage` ページで定期確認

## 🔧 トラブルシューティング

### デプロイエラー
- **ビルド失敗**: `package.json` の依存関係を確認
- **環境変数エラー**: Vercelダッシュボードで正しく設定されているか確認

### API エラー
- **429 Too Many Requests**: レート制限超過（1時間待機）
- **500 Internal Server Error**: Anthropic APIキーを確認

### パフォーマンス
- **初回実行が遅い**: コールドスタート（Vercelの仕様）
- **2回目以降も遅い**: Claude API応答時間（10-20秒は正常）

## 📝 カスタマイズ

### レート制限の変更
`/lib/rateLimit.ts` を編集:
```typescript
const RATE_LIMIT_CONFIG = {
  windowMs: 60 * 60 * 1000, // 時間枠（ミリ秒）
  maxRequests: 10,          // 最大リクエスト数
};
```

変更後、再デプロイ:
```bash
git add .
git commit -m "Update rate limit"
git push
```

Vercelが自動で再デプロイします。

## 🎉 完了！

デプロイが完了しました！

- **アプリURL**: https://[your-app].vercel.app
- **GitHubリポジトリ**: https://github.com/kairyu33/note-viral-predictor
- **使用状況ダッシュボード**: https://[your-app].vercel.app/usage

Vercelダッシュボードで以下も確認できます:
- デプロイ履歴
- アクセス解析
- エラーログ
- パフォーマンス指標
