# Supabase接続設定ガイド

> **作成日**: 2026-02-07
> **担当**: @member3

---

## Supabase接続情報の取得と設定方法

---

## 1. Supabaseダッシュボードへのアクセス

1. [Supabase Dashboard](https://supabase.com/dashboard) にアクセス
2. GitHubアカウントでログイン
3. 該当するプロジェクトを選択（または新規作成）

---

## 2. プロジェクト情報の確認

### 2.1 プロジェクトURLの確認

**手順**:
1. 左サイドバーから「Settings」 → 「API」を選択
2. 「Project URL」をコピー

**例**:
```
https://xxxxxxxx.supabase.co
```

### 2.2 プロジェクト参照IDの確認

**手順**:
1. プロジェクトURLから `xxxxxxxx` の部分を確認
2. または「Settings」 → 「General」で「Reference ID」を確認

**例**:
```
xxxxxxxx
```

### 2.3 データベースパスワードの確認

**注意**: プロジェクト作成時に設定したパスワードのみ有効です。忘れた場合、リセットが必要です。

**リセット手順**:
1. 「Settings」 → 「Database」を選択
2. 「Database Password」セクションで「Reset Database Password」をクリック

---

## 3. APIキーの取得

### 3.1 anon publicキー

**用途**: クライアントサイドからのアクセス（RLS有効時）

**取得手順**:
1. 「Settings」 → 「API」を選択
2.「Project API keys」セクションの「anon public」をコピー

### 3.2 service_roleキー

**用途**: サーバーサイドからのアクセス（RLSバイパス）

**取得手順**:
1. 同じセクションの「service_role」をコピー
2. **重要**: このキーは秘密にしてください

---

## 4. DATABASE_URLの構築

### 4.1 基本形式

```
postgresql://postgres.[PROJECT_REF]:[PASSWORD]@aws-0-[REGION].pooler.supabase.com:6543/postgres
```

### 4.2 各パーツの説明

| パーツ | 説明 | 例 |
|--------|------|------|
| `postgres.[PROJECT_REF]` | プロジェクト参照ID | `postgres.xxxxxxxx` |
| `[PASSWORD]` | データベースパスワード | プロジェクト作成時に設定 |
| `[REGION]` | リージョン | `ap-northeast-1` (東京) |
| `6543` | ポート番号 | `6543` (pooler) または `5432` (direct) |

### 4.3 実際の例

```
postgresql://postgres.xxxxxxxx:your_password@aws-0-ap-northeast-1.pooler.supabase.com:6543/postgres
```

---

## 5. .envファイルの設定

### 5.1 Supabase用の設定

```bash
# Supabase Database (PostgreSQL + pgvector)
DATABASE_URL="postgresql://postgres.xxxxxxxx:[PASSWORD]@aws-0-ap-northeast-1.pooler.supabase.com:6543/postgres"

# Supabase API (NextAuth等で使用)
NEXT_PUBLIC_SUPABASE_URL="https://xxxxxxxx.supabase.co"
NEXT_PUBLIC_SUPABASE_ANON_KEY="[ANON-KEY]"
SUPABASE_SERVICE_ROLE_KEY="[SERVICE-ROLE-KEY]"
```

### 5.2 各環境変数の説明

| 変数名 | 用途 | 必須 |
|--------|------|------|
| `DATABASE_URL` | Prisma/データベース接続 | ✅ |
| `NEXT_PUBLIC_SUPABASE_URL` | クライアントからのAPI呼び出し | ⚠️ |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | クライアント認証 | ⚠️ |
| `SUPABASE_SERVICE_ROLE_KEY` | サーバー側のフルアクセス | ⚠️ |

---

## 6. 接続テスト

### 6.1 Prisma経由の接続確認

```bash
# Prisma Client生成
pnpm db:generate

# データベース接続確認
pnpm db:studio
```

ブラウザで `http://localhost:5555` にアクセスし、Prisma Studioが開けば成功です。

### 6.2 psql経由の接続確認

```bash
psql "$DATABASE_URL"
```

プロンプトが表示されれば接続成功です。

---

## 7. セキュリティのベストプラクティス

### 7.1 キーの管理

| キー | 公開 | 用途 |
|------|------|------|
| `anon public` | ✅ 可 | クライアントサイド |
| `service_role` | ❌ 不可 | サーバーサイドのみ |

### 7.2 .envファイルの取り扱い

- `.gitignore` に `.env` を含める
- `.env.example` にはデフォルト値や説明のみ記載
- 本番環境では環境変数管理サービスを使用

---

## 8. 接続文字列の例

### 8.1 開発環境（ローカルDocker）

```bash
DATABASE_URL="postgresql://codestencil:codestencil_dev_password@localhost:5432/codestencil?schema=public"
```

### 8.2 Supabase（本番・ステージング）

```bash
DATABASE_URL="postgresql://postgres.xxxxxxxx:[PASSWORD]@aws-0-ap-northeast-1.pooler.supabase.com:6543/postgres"
```

### 8.3 Direct Connection（プーリングなし）

```bash
DATABASE_URL="postgresql://postgres.[PROJECT_REF]:[PASSWORD]@db.[PROJECT-REF].supabase.co:5432/postgres"
```

---

## 9. トラブルシューティング

### 9.1 接続エラーの主な原因

| エラー | 原因 | 解決策 |
|--------|------|--------|
| `password authentication failed` | パスワードが間違っている | パスワードを確認・リセット |
| `connection refused` | ホスト名が間違っている | PROJECT_REFを確認 |
| `timeout` | ネットワーク問題 | リージョンを確認 |
| `extension "vector" does not exist` | pgvector未有効化 | SQL Editorで拡張を有効化 |

### 9.2 接続の診断

```bash
# pingで到達確認
ping db.xxxxxxxx.supabase.co

# telnetでポート確認
telnet db.xxxxxxxx.supabase.co 5432

# Prismaで接続確認
npx prisma db push --print
```

---

## 10. 次のステップ

1. [ ] Supabaseプロジェクトを作成
2. [ ] pgvector拡張を有効化
3. [ ] 接続情報を.envに設定
4. [ ] Prismaスキーマを適用
5. [ ] 接続テストを実行

---

**参考**: [Supabase Connection String Format](https://supabase.com/docs/guides/database/connecting-to-postgres#connection-string-format)
