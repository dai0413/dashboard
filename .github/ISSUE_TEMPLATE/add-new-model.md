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

## 2. サーバーサイドのモデル定義

- [ ] `server/models/` に新しいスキーマファイル（例: `Country.js`）を作成。
  - Mongoose のスキーマとしてフィールドとバリデーションを定義。

---

## 3. バックエンド API 作成

### 3-1. API ルートのドキュメント作成

- [ ] `docs/README.md` にルート概要を追加。
- [ ] `docs/api/` に詳細な API 仕様 (`POST`, `GET`, `PUT`, `DELETE` など) を記述。

### 3-2. コントローラー作成

- [ ] `server/controllers/` にモデル処理ロジックを記述。
  - CRUD 操作 (`create`, `getAll`, `get`, `update`, `delete`)

### 3-3. ルート定義追加

- [ ] `server/routes/` に新しいルートファイルを追加。
- 必要に応じて `server/routes/index.js` にインポート。

---

## 4. フロントエンド定義追加

### 4-1. 型定義

- [ ] `client/src/types/models/` にモデルの TypeScript 型定義を追加。
- [ ] `client/src/types/models/index.ts` にまとめてエクスポート。

### 4-2. データ変換処理

- [ ] `client/src/lib/convert/` に変換処理関数（`country` など）を追加。

### 4-3. モデルフィールド定義

- [ ] `client/src/model-fields/` に以下を定義:
  - フィルター
  - ソート
  - 詳細画面表示

---

## 5. 状態管理, crud 処理追加

- [ ] `client/src/context/models/`に新しいモデルを管理する context を作成。

---

## 6. 一覧ページ作成

- [ ] `docs/route/index.md`にルートまとめ
- [ ] `client/src/lib/appRoutes.ts`にルート定義
- [ ] `client/src/pages/ModelTable/` に新しいモデル用の一覧ページを作成。

---

## 7. 詳細ページ作成

- [ ] `client/src/pages/ModelDetail/` にモデルの詳細表示ページを作成。

---

## 8. 登録用フォームステップ作成

- [ ] `client/src/lib/form-steps/` に登録用のフォームステップ（ステップフォーム）を作成。
  - 入力項目のバリデーション・ステップ分割を定義

---
