---
name: Add New Model
about: モデル追加のためのテンプレート
title: "新しいモデルの追加"
labels: enhancement
assignees: ""
---

# ✅ 新規モデル追加手順テンプレート

## 1. スキーマ定義のドキュメント化

- [ ] `docs/db-schema.md` に新しいモデルの構造を追記します。
  - フィールド名、型、必須性、リレーション等を記述。

---

## 2. `/shared` で スキーマ定義

- [ ] `shared/schemas/` に新しいスキーマファイル（例: `Country.schema.ts`）を作成。
  - zod のスキーマとしてフィールドを定義。

---

## 3. `/shared` で モデル操作設定

- [ ] `shared/models-config/` に新しい設定ファイル（例: `country.ts`）を作成。
  - zod のスキーマ, crud 処理関連などまとめる。

---

## 2. サーバーサイドのモデル定義

- [ ] `server/models/` に新しいスキーマファイル（例: `Country.js`）を作成。
  - Mongoose のスキーマとしてフィールドとバリデーションを定義。

---

## 3. バックエンド API 作成

### 3-1. API ルートのドキュメント作成

- [ ] `docs/README.md` にルート概要を追加。
- [ ] `docs/api/` に詳細な API 仕様 (`POST`, `GET`, `PUT`, `DELETE` など) を記述。

### 3-2. コントローラー作成

- [ ] `server/controllers/models/` にモデル処理ロジックを記述。
  - CRUD 操作 (`create`, `getAll`, `get`, `update`, `delete`)

### 3-3. ルート定義追加

- [ ] `server/routes/` に新しいルートファイルを追加。
- `server/app.ts` にインポート。

---

### 3-4. サーバーテスト

- [ ] `server/__test__/modelAPI.test.ts` でテスト

---

## 4. フロントエンド定義追加

### 4-1. 型定義

- [ ] `client/src/types/models/` にモデルの TypeScript 型定義を追加。
- [ ] `client/src/lib/appRoutes.ts`に client のルート定義
- [ ] `client/src/lib/apiRoutes.ts`に server のルート定義
- [ ] `client/src/types/models/index.ts` にまとめてエクスポート。

### 4-2. データ変換処理

- [ ] `client/src/lib/convert/CreateLabel`
- [ ] `client/src/lib/convert/DBtoGetted`
- [ ] `client/src/lib/convert/GettedtoForm`

### 4-3. モデルフィールド定義

- [ ] `client/src/lib/model-fields/` に以下を定義:
  - フィルター
  - ソート
  - 詳細画面表示

---

## 5. 状態管理, crud 処理追加

- [ ] `client/src/context/models/`に新しいモデルを管理する context を作成。
- [ ] `client/src/context/models/model-wrapper`に追加。

---

## 6. 一覧ページ作成

- [ ] `docs/route/index.md`にルートまとめ
- [ ] `client/src/pages/ModelTable/` に新しいモデル用の一覧ページを作成。

---

## 7. 詳細ページ作成

- [ ] `client/src/pages/ModelDetail/` にモデルの詳細表示ページを作成。
- [ ] `client/src/pages/Models`にまとめる

---

## 8. 登録用フォーム作成

- [ ] `client/src/lib/form-steps/` に登録用のフォームステップ（ステップフォーム）を作成。
  - 入力項目のバリデーション・ステップ分割を定義, `index.ts`にも追加
- [ ] `client/src/lib/default-formData`でデフォルト値設定
- [ ] `client/src/context/form-context`内で`modelContextMap`内追加

---

## 9. モデルまとめページ

- [ ] `client/src/lib/AdminDashboard/` にモデルへのリンクまとめ。

---
