# デプロイメントガイド

## Vercel デプロイ手順（推奨）

### 前提条件

- GitHubアカウント
- Vercelアカウント（無料）
- OpenAI APIキー

### ステップ 1: GitHubリポジトリの準備

```bash
# プロジェクトディレクトリに移動
cd note-viral-predictor

# Gitリポジトリの初期化
git init

# 全ファイルをステージング
git add .

# 初回コミット
git commit -m "feat: initial commit - note viral predictor AI"

# メインブランチの設定
git branch -M main

# GitHubリポジトリを作成（GitHub CLIを使用する場合）
gh repo create note-viral-predictor --public --source=. --remote=origin --push

# または、GitHubのWebサイトでリポジトリを作成してから：
# git remote add origin https://github.com/YOUR_USERNAME/note-viral-predictor.git
# git push -u origin main
```

### ステップ 2: Vercelでプロジェクトをインポート

1. **Vercelにログイン**
   - https://vercel.com にアクセス
   - GitHubアカウントで認証

2. **新規プロジェクトの作成**
   - "Add New..." → "Project" をクリック
   - GitHubリポジトリから `note-viral-predictor` を選択
   - "Import" をクリック

3. **プロジェクト設定**
   - Framework Preset: `Next.js` （自動検出されます）
   - Root Directory: `./` （デフォルト）
   - Build Command: `next build` （デフォルト）
   - Output Directory: `.next` （デフォルト）

### ステップ 3: 環境変数の設定

**重要**: デプロイ前に環境変数を設定してください。

1. **Environment Variables セクションで追加**:
   ```
   Name: OPENAI_API_KEY
   Value: sk-your-actual-openai-api-key
   ```

2. **オプション設定**:
   ```
   Name: OPENAI_MODEL
   Value: gpt-4-turbo
   
   Name: OPENAI_TEMPERATURE
   Value: 0.7
   ```

3. **全環境へ適用**:
   - ✅ Production
   - ✅ Preview
   - ✅ Development

### ステップ 4: デプロイ

1. **"Deploy" ボタンをクリック**
   - ビルドプロセスが開始されます（約2-3分）
   - 進捗状況がリアルタイムで表示されます

2. **デプロイ完了の確認**
   - ✅ ビルド成功
   - ✅ デプロイURL生成（例: `https://note-viral-predictor.vercel.app`）

3. **動作確認**
   - デプロイされたURLにアクセス
   - テスト記事で分析を実行

### ステップ 5: カスタムドメインの設定（オプション）

1. **Vercel Project Settings → Domains**
2. "Add Domain" をクリック
3. ドメイン名を入力（例: `note-viral.com`）
4. DNS設定の指示に従う
5. SSL証明書が自動発行されます

## 継続的デプロイメント

Vercelは自動的にCI/CDを設定します：

- **Production**: `main` ブランチへのプッシュで自動デプロイ
- **Preview**: プルリクエストごとにプレビュー環境を自動生成

## 環境変数の更新

1. Vercel Dashboard → Project → Settings → Environment Variables
2. 変更する変数を編集
3. "Save" をクリック
4. **重要**: 変更を反映するには再デプロイが必要
   - Deployments → 最新のデプロイ → "Redeploy" をクリック

## トラブルシューティング

### ビルドエラー: "Module not found"

**原因**: 依存関係がインストールされていない

**解決策**:
```bash
# ローカルで確認
npm install
npm run build

# package.json と package-lock.json をコミット
git add package*.json
git commit -m "fix: update dependencies"
git push
```

### ランタイムエラー: "OPENAI_API_KEY is not defined"

**原因**: 環境変数が設定されていない

**解決策**:
1. Vercel Dashboard → Settings → Environment Variables
2. `OPENAI_API_KEY` を追加
3. プロジェクトを再デプロイ

### API エラー: "429 Too Many Requests"

**原因**: OpenAI APIのレート制限超過

**解決策**:
- OpenAI Dashboard で使用量を確認
- レート制限を増加させるか、Tier を上げる
- アプリ側でレート制限を実装（将来の改善項目）

### TypeScript ビルドエラー

**原因**: 型エラー

**解決策**:
```bash
# ローカルで型チェック
npm run type-check

# エラーを修正してコミット
git add .
git commit -m "fix: resolve type errors"
git push
```

## パフォーマンス最適化

### 1. Edge Functions（推奨）

`app/api/analyze/route.ts` の先頭に追加：

```typescript
export const runtime = 'edge';
```

### 2. キャッシング

```typescript
export const revalidate = 3600; // 1時間キャッシュ
```

### 3. 画像最適化

Next.js の Image コンポーネントを使用（既に実装済み）

## モニタリング

### Vercel Analytics（推奨）

1. Project Settings → Analytics
2. "Enable Analytics" をクリック
3. リアルタイムトラフィックを確認

### OpenAI Usage Monitoring

1. https://platform.openai.com/usage にアクセス
2. 日次・月次の使用量を確認
3. コスト予測を確認

## セキュリティのベストプラクティス

1. **環境変数の保護**
   - `.env.local` をGitにコミットしない（.gitignore設定済み）
   - APIキーを公開しない

2. **CORS設定**
   - 必要に応じて特定ドメインのみ許可

3. **レート制限**
   - API呼び出しに制限を実装（将来の改善項目）

4. **認証**
   - プレミアムプランには認証を実装（将来の改善項目）

## コスト見積もり

### Vercel（Hobby プラン - 無料）
- 無料枠: 月100GB帯域幅
- 十分な個人プロジェクト向け

### OpenAI API（GPT-4 Turbo）
- 入力: $10.00 / 1M tokens
- 出力: $30.00 / 1M tokens
- **1回の分析**: 約$0.03-0.06
- **100回/月**: 約$3-6
- **1000回/月**: 約$30-60

## スケーリング計画

ユーザーが増加した場合：

1. **Vercel Pro プラン**（$20/月）
   - より多くの帯域幅
   - 優先サポート

2. **データベース追加**
   - ユーザー認証
   - 分析履歴保存
   - 使用回数管理

3. **キャッシング戦略**
   - Redis によるAPIレスポンスキャッシュ
   - OpenAI コスト削減

4. **バックグラウンドジョブ**
   - 長時間分析の非同期処理
   - メール通知

---

デプロイに関する質問は、GitHubのIssuesで受け付けています。
