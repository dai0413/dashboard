# 使用パッケージ一覧

## 1. サーバー（バックエンド）

```bash
    npm install express mongoose bcryptjs jsonwebtoken dotenv http-status-codes express-async-errors
    npm install -D nodemon
```

### 1.1 本番環境パッケージ(dependencies)

| パッケージ           | 用途                      |
| -------------------- | ------------------------- |
| express              | Web フレームワーク        |
| mongoose             | MongoDB ODM               |
| bcryptjs             | パスワードのハッシュ化    |
| jsonwebtoken         | JWT によるトークン認証    |
| dotenv               | 環境変数の管理            |
| http-status-codes    | HTTP ステータスコード定数 |
| express-async-errors | async 関数内エラーの補足  |
| cookie-parser        | クッキーを解析            |

### 1.2 開発環境パッケージ(devDependencies)

## 開発環境パッケージ（devDependencies）

| パッケージ | 用途                 |
| ---------- | -------------------- |
| nodemon    | サーバーの自動再起動 |

## 2. クライアント（フロントエンド）

```bash
    npm install react-router-dom axios
    npm install -D tailwindcss postcss autoprefixer
    npx tailwindcss init -p
```

### 2.1 本番環境パッケージ（dependencies）

| パッケージ       | 用途                                     |
| ---------------- | ---------------------------------------- |
| react            | UI 構築ライブラリ                        |
| react-dom        | React を HTML に描画するためのライブラリ |
| react-router-dom | ページ遷移・ルーティング機能を提供       |
| axios            | バックエンド接続                         |

### 2.2 開発環境パッケージ（devDependencies）

| パッケージ   | 用途                                      |
| ------------ | ----------------------------------------- |
| tailwindcss  | ユーティリティベースの CSS フレームワーク |
| postcss      | CSS 変換ツール（Tailwind と連携）         |
| autoprefixer | ベンダープレフィックス自動付加ツール      |
