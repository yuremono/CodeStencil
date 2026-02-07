import { Code2, Sparkles, Zap } from "lucide-react";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      {/* Header */}
      <header className="border-b bg-white/50 dark:bg-gray-900/50 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Code2 className="h-8 w-8 text-primary" />
              <span className="text-2xl font-bold">CodeStencil</span>
            </div>
            <nav className="flex items-center space-x-6">
              <a href="/templates" className="text-sm font-medium hover:text-primary">
                テンプレート
              </a>
              <a href="/docs" className="text-sm font-medium hover:text-primary">
                ドキュメント
              </a>
            </nav>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main className="container mx-auto px-4 py-16">
        <div className="mx-auto max-w-4xl text-center">
          <div className="mb-6 flex justify-center">
            <div className="flex items-center space-x-2 rounded-full bg-primary/10 px-4 py-2 text-sm font-medium text-primary">
              <Sparkles className="h-4 w-4" />
              <span>AI駆動のインテリジェントコードテンプレートプラットフォーム</span>
            </div>
          </div>

          <h1 className="mb-6 text-5xl font-bold tracking-tight sm:text-6xl">
            コードテンプレートの
            <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              次世代
            </span>
          </h1>

          <p className="mb-8 text-xl text-muted-foreground">
            プロジェクトのコンテキストを理解し、動的にテンプレートを生成・カスタマイズ。
            AST解析とAIを組み合わせた、これまでにないコードスニペット体験。
          </p>

          <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
            <button className="flex items-center space-x-2 rounded-lg bg-primary px-6 py-3 font-medium text-primary-foreground transition-colors hover:bg-primary/90">
              <Zap className="h-5 w-5" />
              <span>始める</span>
            </button>
            <button className="rounded-lg border px-6 py-3 font-medium transition-colors hover:bg-accent">
              ドキュメントを見る
            </button>
          </div>
        </div>

        {/* Features Grid */}
        <div className="mt-20 grid gap-8 md:grid-cols-3">
          <div className="rounded-lg border bg-card p-6 shadow-sm">
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
              <Code2 className="h-6 w-6 text-primary" />
            </div>
            <h3 className="mb-2 text-lg font-semibold">AST解析</h3>
            <p className="text-muted-foreground">
              Tree-sitterによる高度なコード構造解析。プロジェクトの文脈を正確に理解します。
            </p>
          </div>

          <div className="rounded-lg border bg-card p-6 shadow-sm">
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
              <Sparkles className="h-6 w-6 text-primary" />
            </div>
            <h3 className="mb-2 text-lg font-semibold">AI生成</h3>
            <p className="text-muted-foreground">
              LLMを活用した動的テンプレート生成。コーディングスタイルに適応したコードを出力。
            </p>
          </div>

          <div className="rounded-lg border bg-card p-6 shadow-sm">
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
              <Zap className="h-6 w-6 text-primary" />
            </div>
            <h3 className="mb-2 text-lg font-semibold">インスタントプレビュー</h3>
            <p className="text-muted-foreground">
              WebContainerによるブラウザ内での即時プレビュー。手間なくコードを試せます。
            </p>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="mt-20 border-t py-8">
        <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
          <p>&copy; 2026 CodeStencil. MIT License.</p>
        </div>
      </footer>
    </div>
  );
}
