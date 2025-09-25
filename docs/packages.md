# 使用パッケージ一覧

## 1. サーバー（バックエンド）

### 1.1 サーバー・フレームワーク関連

| パッケージ           | 用途                                           | 種別            |
| -------------------- | ---------------------------------------------- | --------------- |
| express              | Node.js の Web アプリケーションフレームワーク  | dependencies    |
| express-async-errors | 非同期関数内の例外処理を簡単にするミドルウェア | dependencies    |
| http-status-codes    | HTTP ステータスコードを定数で扱えるライブラリ  | dependencies    |
| cookie-parser        | リクエストクッキーを簡単に扱うミドルウェア     | dependencies    |
| cors                 | クロスオリジンリクエストを許可するミドルウェア | dependencies    |
| dotenv               | `.env` による環境変数の読み込み                | dependencies    |
| nodemon              | サーバーコード変更時に自動で再起動             | devDependencies |

---

### 1.2 データベース関連（MongoDB）

| パッケージ | 用途                           | 種別         |
| ---------- | ------------------------------ | ------------ |
| mongoose   | MongoDB 用 ODM（データ操作層） | dependencies |

---

### 1.3 認証・セキュリティ関連

| パッケージ   | 用途                         | 種別         |
| ------------ | ---------------------------- | ------------ |
| bcryptjs     | パスワードのハッシュ化       | dependencies |
| jsonwebtoken | JWT によるトークンベース認証 | dependencies |

---

### 1.4 CSV・文字コード処理関連

| パッケージ | 用途                                                | 種別         |
| ---------- | --------------------------------------------------- | ------------ |
| csv-parser | CSV ファイルの読み込み                              | dependencies |
| csv-writer | CSV ファイルの書き出し                              | dependencies |
| json2csv   | JSON から CSV への変換                              | dependencies |
| iconv-lite | 文字コード変換（Shift-JIS や UTF-8 などの相互変換） | dependencies |
| jschardet  | 文字コード自動判定ライブラリ                        | dependencies |

---

### 1.5 日付・時間処理

| パッケージ | 用途                     | 種別         |
| ---------- | ------------------------ | ------------ |
| moment     | 日付・時間のフォーマット | dependencies |

---

### 1.6 ファイルアップロード

| パッケージ | 用途                       | 種別         |
| ---------- | -------------------------- | ------------ |
| multer     | multipart/form-data の処理 | dependencies |

### 1.7 テスト関連

| パッケージ            | 用途 | 種別 |
| --------------------- | ---- | ---- |
| jest                  |      |      |
| supertest             |      |      |
| mongodb-memory-server |      |      |

---

## 2. クライアント（フロントエンド）

### 2.1 React・ルーティング関連

| パッケージ       | 用途                                      | 種別            |
| ---------------- | ----------------------------------------- | --------------- |
| react            | UI 構築ライブラリ                         | dependencies    |
| react-dom        | React を HTML に描画するためのライブラリ  | dependencies    |
| react-router-dom | ページ遷移・ルーティング機能を提供        | dependencies    |
| @types/react     | React の型定義ファイル（TypeScript 向け） | devDependencies |
| @types/react-dom | ReactDOM の型定義ファイル                 | devDependencies |

---

### 2.2 スタイリング関連（Tailwind / PostCSS）

| パッケージ           | 用途                                          | 種別            |
| -------------------- | --------------------------------------------- | --------------- |
| tailwindcss          | ユーティリティファーストの CSS フレームワーク | 両方に存在      |
| postcss              | CSS 処理ツール（Tailwind などと連携）         | devDependencies |
| autoprefixer         | ベンダープレフィックス自動付加ツール          | devDependencies |
| @tailwindcss/postcss | TailwindCSS の PostCSS プラグイン             | dependencies    |
| @tailwindcss/vite    | TailwindCSS を Vite に統合する公式プラグイン  | dependencies    |
| @heroicons/react     | Tailwind UI 向けのアイコンコンポーネント      | dependencies    |
| csstype              | CSS プロパティの型定義ライブラリ              | devDependencies |

---

### 2.3 ビルド・実行ツール（Vite / Babel）

| パッケージ           | 用途                                                      | 種別            |
| -------------------- | --------------------------------------------------------- | --------------- |
| vite                 | 高速なモダンフロントエンド開発ビルドツール                | devDependencies |
| serve                | 本番ビルドをローカルでホスティングするサーバー            | devDependencies |
| @vitejs/plugin-react | Vite に React 機能を統合する公式プラグイン                | devDependencies |
| @babel/parser        | JavaScript/TypeScript のコードをパースする Babel パーサー | devDependencies |
| @babel/types         | Babel の AST ノード型定義                                 | devDependencies |

---

### 2.4 型チェック・Lint 関連

| パッケージ                  | 用途                                                            | 種別            |
| --------------------------- | --------------------------------------------------------------- | --------------- |
| typescript                  | TypeScript 言語本体                                             | devDependencies |
| eslint                      | コード品質・構文チェックツール                                  | devDependencies |
| @eslint/js                  | ESLint の公式ルールセット                                       | devDependencies |
| eslint-plugin-react-hooks   | React Hooks のルールチェック                                    | devDependencies |
| eslint-plugin-react-refresh | React Fast Refresh（HMR）に関する ESLint プラグイン             | devDependencies |
| globals                     | グローバル変数定義サポート（ESLint 用）                         | devDependencies |
| typescript-eslint           | ESLint で TypeScript を使うための統合ツール（パーサ・ルール等） | devDependencies |

---

### 2.5 通信関連

| パッケージ | 用途                              | 種別         |
| ---------- | --------------------------------- | ------------ |
| axios      | HTTP 通信ライブラリ（API 連携用） | dependencies |
