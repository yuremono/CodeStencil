# プロジェクト構造

## ディレクトリ構成

```
CodeStencil/
├── src/
│   ├── parser/       # Parser Agent (AST解析)
│   ├── style/        # Style Agent (コーディングスタイル学習)
│   ├── generator/    # Generator Agent (テンプレート生成)
│   ├── validator/    # Validator Agent (静的解析)
│   └── shared/       # 共通ユーティリティ・型定義
├── docs/             # ドキュメント
├── tests/            # テストコード
├── scripts/          # ビルド・開発スクリプト
├── .gitignore        # Git除外設定
└── README.md         # プロジェクト概要
```

## 各ディレクトリの詳細

### src/parser/
Parser Agent の実装。
- Tree-sitter を使用した AST 解析
- ソースコードの構造抽出
- 言語別パーサーの管理

### src/style/
Style Agent の実装。
- コーディングスタイルの学習
- インデント、命名規則の検出
- プロジェクト固有のスタイル適用

### src/generator/
Generator Agent の実装。
- LLM を使用したテンプレート生成
- RAG による類似パターン検索
- コンテキストに応じたカスタマイズ

### src/validator/
Validator Agent の実装。
- 生成コードの静的解析
- シンタックスチェック
- セキュリティスキャン

### src/shared/
共通モジュール。
- 型定義
- ユーティリティ関数
- 設定ファイル

### docs/
プロジェクトドキュメント。
- 技術仕様
- APIドキュメント
- 開発ガイド

### tests/
テストコード。
- ユニットテスト
- 結合テスト
- E2Eテスト

### scripts/
ビルド・開発スクリプト。
- セットアップスクリプト
- ビルドスクリプト
- デプロイスクリプト
