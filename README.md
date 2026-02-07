# CodeStencil

> AI駆動のインテリジェントコードテンプレートプラットフォーム

## 概要

CodeStencilは、プロジェクトのコンテキストを理解し、動的にテンプレートを生成・カスタマイズする次世代のコードスニペットプラットフォームです。既存の静的なスニペットツールとは異なり、AST解析とRAGを組み合わせることで、プロジェクトの構造とコーディングスタイルに適応したコードを生成します。

## ユースケース

- フルスタックエンジニアの生産性向上
- スタートアップ創業の迅速なプロトタイピング
- コード教育・メンタリングの効率化

## 技術スタック

| カテゴリ | 技術 | 用途 |
|---------|------|------|
| AST解析 | Tree-sitter | ソースコードの構造解析 |
| ベクトル検索 | RAG (Retrieval-Augmented Generation) | 類似パターンの検索 |
| 実行環境 | WebContainer | ブラウザ内でのコード実行 |
| API通信 | tRPC | 型安全なクライアント-サーバー通信 |
| ビルドシステム | Turborepo | 高速なMonorepoビルド |
| パッケージマネージャー | pnpm | 効率的な依存関係管理 |

## アーキテクチャ

```
┌─────────────┐     ┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│   Parser    │ →   │   Style     │ →   │  Generator  │ →   │  Validator  │
│   Agent     │     │   Agent     │     │   Agent     │     │   Agent     │
└─────────────┘     └─────────────┘     └─────────────┘     └─────────────┘
      ↓                   ↓                   ↓                   ↓
  AST解析           コーディング          テンプレート          静的解析
                   スタイル学習            生成
```

### 各エージェントの役割

| エージェント | 役割 |
|-------------|------|
| **Parser Agent** | ソースコードを解析し、AST（抽象構文木）を生成 |
| **Style Agent** | プロジェクトのコーディングスタイルを学習・適用 |
| **Generator Agent** | LLMを用いてテンプレートを動的に生成 |
| **Validator Agent** | 生成コードの静的解析と品質検証 |

## Monorepo構造

```
CodeStencil/
├── apps/
│   ├── web/          # Next.js Webアプリケーション
│   └── cli/          # CLIツール
├── packages/
│   ├── parser/       # Parser Agent (AST解析)
│   ├── style/        # Style Agent (コーディングスタイル学習)
│   ├── generator/    # Generator Agent (テンプレート生成)
│   ├── validator/    # Validator Agent (静的解析)
│   ├── shared/       # 共通ユーティリティ・型定義
│   └── config/       # 共通設定 (ESLint, TypeScript)
├── docs/             # ドキュメント
├── turbo.json        # Turborepo設定
├── pnpm-workspace.yaml  # pnpm workspace設定
└── package.json      # ルートpackage.json
```

## 開発手順

### セットアップ

```bash
# リポジトリのクローン
git clone https://github.com/yuremono/CodeStencil.git
cd CodeStencil

# pnpmのインストール（未インストールの場合）
npm install -g pnpm

# 依存関係のインストール
pnpm install
```

### 開発

```bash
# 開発サーバーの起動
pnpm dev

# テストの実行
pnpm test

# ビルド
pnpm build

# リント
pnpm lint
```

### パッケージ個別の実行

```bash
# Webアプリの開発
pnpm --filter @codestencil/web dev

# CLIのビルド
pnpm --filter @codestencil/cli build

# Parserのテスト
pnpm --filter @codestencil/parser test
```

## ロードマップ

### Phase 1: 基盤整備 ✅
- [x] Turborepo + pnpm workspaceの設定
- [x] パッケージ構造の実装
- [x] TypeScript/ESLint共有設定
- [x] Parser Agentの実装
  - [x] TypeScript/JavaScript対応
  - [x] Python/Go対応
  - [x] 命名規則の自動検出
  - [x] インポート/エクスポート解析

### Phase 2: コア機能実装 🔄
- [ ] Style Agentの実装
- [ ] Generator Agentの実装
- [ ] Validator Agentの実装
- [ ] データベース設定 (PostgreSQL + pgvector)

### Phase 3: UI/UX実装
- [ ] Next.js Webアプリケーション
- [ ] CLIツール
- [ ] Language Server プロトコル対応

### Phase 4: 本番対応
- [ ] パフォーマンス最適化
- [ ] セキュリティ対策
- [ ] デプロイメント

## ライセンス

MIT License

---

**作成日**: 2026-02-07
**ステータス**: 開発中
**リポジトリ**: https://github.com/yuremono/CodeStencil
