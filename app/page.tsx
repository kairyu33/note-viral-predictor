import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50">
      <main className="container mx-auto px-4 py-16 max-w-4xl">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-gray-900 mb-4">
            📝 noteバイラル度予測AI
          </h1>
          <p className="text-xl text-gray-600">
            AIがあなたのnote記事のバイラル度を分析し、改善提案を提供します
          </p>
        </div>

        {/* Main Cards */}
        <div className="grid md:grid-cols-2 gap-6 mb-8">
          {/* API Documentation Card */}
          <Link href="/example" className="block">
            <div className="bg-white rounded-xl shadow-lg p-8 hover:shadow-xl transition-shadow cursor-pointer h-full">
              <div className="text-4xl mb-4">🚀</div>
              <h2 className="text-2xl font-bold text-gray-900 mb-3">
                記事を分析
              </h2>
              <p className="text-gray-600 mb-4">
                タイトルと本文を入力して、AIによるバイラル度分析を受けましょう。
              </p>
              <div className="flex items-center text-blue-600 font-medium">
                分析を開始 →
              </div>
            </div>
          </Link>

          {/* Usage Dashboard Card */}
          <Link href="/usage" className="block">
            <div className="bg-white rounded-xl shadow-lg p-8 hover:shadow-xl transition-shadow cursor-pointer h-full">
              <div className="text-4xl mb-4">📊</div>
              <h2 className="text-2xl font-bold text-gray-900 mb-3">
                API使用状況
              </h2>
              <p className="text-gray-600 mb-4">
                API使用量、トークン消費、コストをリアルタイムで確認できます。
              </p>
              <div className="flex items-center text-blue-600 font-medium">
                ダッシュボードを見る →
              </div>
            </div>
          </Link>
        </div>

        {/* Features */}
        <div className="bg-white rounded-xl shadow-lg p-8 mb-8">
          <h3 className="text-2xl font-bold text-gray-900 mb-6">✨ 主な機能</h3>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-semibold text-gray-900 mb-2">🎯 8項目の詳細分析</h4>
              <p className="text-gray-600 text-sm">
                タイトル、冒頭、構成、読みやすさ、感情訴求、トレンド性、文字数、視覚表現を評価
              </p>
            </div>
            <div>
              <h4 className="font-semibold text-gray-900 mb-2">💡 具体的な改善提案</h4>
              <p className="text-gray-600 text-sm">
                優先度付きの改善案と、実装例を提供
              </p>
            </div>
            <div>
              <h4 className="font-semibold text-gray-900 mb-2">📈 PV数予測</h4>
              <p className="text-gray-600 text-sm">
                バイラル度スコアに基づいた閲覧数の予測範囲を表示
              </p>
            </div>
            <div>
              <h4 className="font-semibold text-gray-900 mb-2">💰 コスト管理</h4>
              <p className="text-gray-600 text-sm">
                API使用状況とコストを詳細に追跡・可視化
              </p>
            </div>
          </div>
        </div>

        {/* API Info */}
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
          <h3 className="text-lg font-bold text-blue-900 mb-3">🔧 APIエンドポイント</h3>
          <div className="space-y-2 text-sm text-blue-800">
            <div className="font-mono bg-blue-100 p-2 rounded">
              <strong>POST</strong> /api/analyze - 記事を分析
            </div>
            <div className="font-mono bg-blue-100 p-2 rounded">
              <strong>GET</strong> /api/usage - 使用状況を取得
            </div>
            <p className="text-xs text-blue-600 mt-3">
              詳細なAPI仕様は <Link href="/example" className="underline">記事分析ページ</Link> をご確認ください
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
