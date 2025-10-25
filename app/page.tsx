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

        {/* Main Card */}
        <div className="mb-8">
          {/* Analysis Card */}
          <Link href="/example" className="block">
            <div className="bg-white rounded-xl shadow-lg p-8 hover:shadow-xl transition-shadow cursor-pointer">
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
              <h4 className="font-semibold text-gray-900 mb-2">⚡ レート制限</h4>
              <p className="text-gray-600 text-sm">
                1時間に10回までの分析が可能（不正使用を防止）
              </p>
            </div>
          </div>
        </div>

        {/* Tech Stack */}
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
          <h3 className="text-lg font-bold text-blue-900 mb-3">🔧 技術スタック</h3>
          <div className="space-y-2 text-sm text-blue-800">
            <div className="flex items-center gap-2">
              <span className="font-semibold">AI Model:</span>
              <span>Claude Sonnet 4.5 (Anthropic)</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="font-semibold">Framework:</span>
              <span>Next.js 16.0 + TypeScript</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="font-semibold">機能:</span>
              <span>プロンプトキャッシング（90%コスト削減）</span>
            </div>
            <p className="text-xs text-blue-600 mt-3">
              <Link href="/example" className="underline">記事分析を開始する →</Link>
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
