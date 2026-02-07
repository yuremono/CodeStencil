import { Plus, Search, Code2 } from "lucide-react";
import { Button } from "@/components/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/card";

// ダミーデータ
const dummyTemplates = [
  {
    id: "1",
    name: "React FC テンプレート",
    description: "関数コンポーネントの基本テンプレート",
    language: "typescript",
    tags: ["react", "component", "typescript"],
  },
  {
    id: "2",
    name: "Express API ルート",
    description: "Express.jsのAPIルートテンプレート",
    language: "typescript",
    tags: ["express", "api", "typescript"],
  },
  {
    id: "3",
    name: "Python FastAPI エンドポイント",
    description: "FastAPIのエンドポイントテンプレート",
    language: "python",
    tags: ["python", "fastapi", "api"],
  },
];

export default function TemplatesPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Code2 className="h-8 w-8 text-primary" />
              <span className="text-2xl font-bold">CodeStencil</span>
            </div>
            <nav className="flex items-center space-x-6">
              <a href="/" className="text-sm font-medium hover:text-primary">
                ホーム
              </a>
              <a href="/templates" className="text-sm font-medium text-primary">
                テンプレート
              </a>
            </nav>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="mb-2 text-3xl font-bold">テンプレート管理</h1>
          <p className="text-muted-foreground">
            コードテンプレートを検索・管理・生成できます
          </p>
        </div>

        {/* Search Bar */}
        <div className="mb-6 flex gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <input
              type="text"
              placeholder="テンプレートを検索..."
              className="w-full rounded-md border border-input bg-background pl-10 pr-4 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            />
          </div>
          <Button className="flex items-center space-x-2">
            <Plus className="h-4 w-4" />
            <span>新規作成</span>
          </Button>
        </div>

        {/* Templates Grid */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {dummyTemplates.map((template) => (
            <Card key={template.id} className="hover:shadow-md transition-shadow">
              <CardHeader>
                <CardTitle className="text-lg">{template.name}</CardTitle>
                <CardDescription>{template.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {template.tags.map((tag) => (
                    <span
                      key={tag}
                      className="rounded-full bg-secondary px-2 py-1 text-xs font-medium text-secondary-foreground"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </CardContent>
              <CardFooter className="flex justify-between">
                <span className="text-xs text-muted-foreground">
                  言語: {template.language}
                </span>
                <Button variant="outline" size="sm">
                  詳細
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </main>
    </div>
  );
}
