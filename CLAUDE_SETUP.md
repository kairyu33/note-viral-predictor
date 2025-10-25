# 🚀 Claude版 クイックスタートガイド

## 📋 目次

1. [Anthropic APIキーの取得](#1-anthropic-apiキーの取得)
2. [プロジェクトのセットアップ](#2-プロジェクトのセットアップ)
3. [開発サーバーの起動](#3-開発サーバーの起動)
4. [動作確認](#4-動作確認)

---

## 1. Anthropic APIキーの取得

### ステップ 1: Anthropicアカウントの作成

1. https://console.anthropic.com にアクセス
2. "Sign Up" をクリック
3. 以下のいずれかでサインアップ:
   - GitHubアカウント（推奨）
   - Googleアカウント
   - メールアドレス

### ステップ 2: APIキーの作成

1. ダッシュボードで Settings → API Keys に移動
2. "Create Key" ボタンをクリック
3. キー名を入力（例: note-viral-predictor）
4. APIキーが表示される: `sk-ant-api03-xxxxx...`
5. **重要**: このキーをコピーして安全に保存
   - 再表示できません
   - 紛失した場合は新しいキーを作成

### ステップ 3: クレジットの確認

1. Settings → Billing に移動
2. 初回登録時は $5 のクレジットが付与されます
3. クレジットで約 300-500回 の分析が可能

### 料金について

- **入力**: $3 / 1M tokens（約333,000文字）
- **出力**: $15 / 1M tokens（約333,000文字）
- **1回の分析**: 約 $0.01-0.03
- **初回$5クレジット**: 約 300-500回分析可能

---

## 2. プロジェクトのセットアップ

### ステップ 1: 環境変数ファイルの作成

```bash
# プロジェクトディレクトリに移動
cd note-viral-predictor

# テンプレートをコピー
cp .env.local.example .env.local
```

### ステップ 2: APIキーを設定

`.env.local` をエディタで開く：

```bash
# Windows
notepad .env.local

# macOS/Linux
nano .env.local
```

以下のように設定：

```env
# あなたのAnthropic APIキーを貼り付け
ANTHROPIC_API_KEY=sk-ant-api03-xxxxxxxxxxxxxxxxxxxxx

# オプション: モデルを指定（デフォルト: claude-3-5-sonnet-20241022）
ANTHROPIC_MODEL=claude-3-5-sonnet-20241022

# オプション: 温度を調整（0.0-1.0、デフォルト: 0.7）
ANTHROPIC_TEMPERATURE=0.7
```

**重要**: `sk-ant-api03-xxxxx...` の部分をあなたのAPIキーに置き換えてください。

### ステップ 3: 依存関係の確認

```bash
# 依存関係がインストールされているか確認
npm list @anthropic-ai/sdk

# インストールされていない場合
npm install
```

---

## 3. 開発サーバーの起動

```bash
npm run dev
```

以下のようなメッセージが表示されます：

```
  ▲ Next.js 16.0.0
  - Local:   http://localhost:3000
  - Network: http://192.168.x.x:3000

✓ Ready in 2.3s
```

---

## 4. 動作確認

### ステップ 1: ブラウザでアクセス

http://localhost:3000 をブラウザで開く

### ステップ 2: テスト記事で分析

以下のサンプルを使って動作確認：

**タイトル**:
```
副業で月10万円稼ぐための3つの戦略
```

**本文**:
```
多くの人が副業に興味を持っていますが、実際に月10万円を稼げる人は少数です。

今回は、私が実践して成功した3つの戦略を紹介します。

## 1. スキルの棚卸し

まず自分のスキルを整理しましょう。あなたが当たり前にできることが、
他の人にとっては価値があるかもしれません。

私の場合、プログラミング経験がありました。最初は「誰でもできる」と
思っていましたが、実際には需要が高いスキルでした。

## 2. 小さく始める

いきなり大きな案件を狙うのではなく、小さな実績を積み重ねることが
重要です。クラウドソーシングで5,000円の案件から始めました。

最初の3ヶ月は月2-3万円程度でしたが、評価が貯まるにつれて
単価が上がっていきました。

## 3. 継続的な学習

市場のニーズは常に変化します。週に5時間は新しいスキルの学習に
充てることで、単価を維持・向上できました。

## まとめ

副業で月10万円を達成するには、スキルの棚卸し、小さく始めること、
継続的な学習が重要です。焦らず、着実に進めていきましょう。
```

### ステップ 3: 分析実行

1. フォームに入力
2. 「AIで分析する」ボタンをクリック
3. 2-5秒待つ
4. 分析結果が表示される！

### 期待される結果

- **総合スコア**: 70-80点（High評価）
- **詳細スコア**: 8項目それぞれのスコア
- **改善提案**: 3-5個の具体的な提案
- **強み**: 2-4個の良い点
- **予測PV**: 1,000-10,000

---

## ✅ 動作確認チェックリスト

- [ ] ブラウザでページが表示される
- [ ] タイトル・本文を入力できる
- [ ] 「AIで分析する」ボタンをクリックできる
- [ ] ローディングアニメーションが表示される
- [ ] 2-5秒で結果が表示される
- [ ] 総合スコアが表示される
- [ ] 8項目の詳細スコアが表示される
- [ ] 改善提案が表示される
- [ ] 強みが表示される
- [ ] 予測PVが表示される

---

## 🐛 トラブルシューティング

### エラー: "ANTHROPIC_API_KEY is not configured"

**原因**: 環境変数が設定されていない

**解決策**:
1. `.env.local` ファイルが存在するか確認
2. `ANTHROPIC_API_KEY=sk-ant-...` が正しく設定されているか確認
3. 開発サーバーを再起動: `Ctrl+C` → `npm run dev`

### エラー: "Failed to analyze article"

**原因**: APIキーが無効、またはクレジット不足

**解決策**:
1. Anthropic Console で APIキーを確認
2. Billing でクレジット残高を確認
3. 必要に応じて新しいキーを作成

### 分析が遅い・タイムアウト

**原因**: ネットワーク問題、またはAPI混雑

**解決策**:
1. インターネット接続を確認
2. 少し待ってから再試行
3. Anthropic ステータスページを確認: https://status.anthropic.com

### ビルドエラー

```bash
# 依存関係を再インストール
rm -rf node_modules package-lock.json
npm install
npm run build
```

---

## 📊 コスト管理

### 使用量の確認

1. https://console.anthropic.com にログイン
2. Settings → Usage に移動
3. 日次・月次の使用量を確認

### コスト最適化のヒント

1. **開発時はモックデータを使用**
   - `/example` ページでUI確認
   - API呼び出しを減らす

2. **キャッシングを実装**（今後の改善）
   - 同じ記事の再分析を避ける
   - Redis などでキャッシュ

3. **温度を下げる**
   - `ANTHROPIC_TEMPERATURE=0.5` で一貫性向上
   - API呼び出し回数削減

---

## 🎯 次のステップ

1. ✅ ローカルで動作確認完了
2. 📝 実際のnote記事で試す
3. 🚀 Vercelにデプロイ（次のセクション）
4. 🎨 カスタマイズ・機能追加

---

## 🚀 Vercelデプロイ

動作確認が完了したら、次は本番環境へのデプロイです。

詳細は `DEPLOYMENT.md` を参照してください。

**簡易手順**:

```bash
# 1. GitHubにプッシュ
git init
git add .
git commit -m "feat: note viral predictor with Claude"
gh repo create note-viral-predictor --public --source=. --push

# 2. Vercelでデプロイ
# https://vercel.com でGitHubリポジトリをインポート
# 環境変数 ANTHROPIC_API_KEY を設定
# Deploy をクリック
```

---

## 💡 よくある質問

### Q1: OpenAI版とClaude版、どちらを使うべき？

**A**: Claude版を推奨します。理由：
- コストが50-70%安い
- 日本語の理解が優秀
- 長文対応（200K tokens）
- 初回$5クレジット付き

### Q2: Claude 3.5 Sonnetって何？

**A**: Anthropicの最新AIモデルです。
- 高精度な分析
- 優れた日本語理解
- コストパフォーマンスが良い

### Q3: 他のClaudeモデルを使える？

**A**: はい、`.env.local` で変更できます：

```env
# Opus（最高品質、高コスト）
ANTHROPIC_MODEL=claude-3-opus-20240229

# Sonnet（バランス型、推奨）
ANTHROPIC_MODEL=claude-3-5-sonnet-20241022

# Haiku（高速、低コスト）
ANTHROPIC_MODEL=claude-3-haiku-20240307
```

### Q4: APIキーを間違えて公開してしまった

**A**: すぐに対処してください：
1. Anthropic Console で該当キーを削除
2. 新しいキーを作成
3. `.env.local` を更新
4. GitHubに公開してしまった場合：
   - リポジトリの Settings → Secrets で管理
   - コミット履歴から削除（git filter-branch）

---

## 🎉 セットアップ完了！

おめでとうございます！Claude版のnoteバイラル度予測AIのセットアップが完了しました。

### 今すぐできること

- ✅ ローカルで分析を試す
- ✅ 実際のnote記事を分析
- ✅ UIをカスタマイズ
- ✅ Vercelにデプロイ

### サポート

質問や問題が発生した場合：
- `README_CLAUDE.md` を参照
- GitHubのIssuesで質問
- Anthropic Docsを確認: https://docs.anthropic.com

---

**Happy Coding with Claude! 🚀**
