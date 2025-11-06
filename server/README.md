# サーバー (バックエンド) 構成

このディレクトリは Node.js + Express + MongoDB による API サーバーの実装。
選手情報・移籍履歴・怪我履歴の管理・JWT を使った認証機能を提供。

## 目次

- [サーバー (バックエンド) 構成](#サーバー-バックエンド-構成)
  - [目次](#目次)
  - [1. 構成](#1-構成)
  - [2. 環境変数](#2-環境変数)
  - [3.開発環境](#3開発環境)
  - [4.ビルド](#4ビルド)

## 1. 構成

```
project/
│
├──server/
│ ├── app.ts # サーバーエントリーポイント
│ ├── controllers/ # ビジネスロジック
│ │ ├── auth.ts
│ │ ├── player.ts
│ │ ├── transfer.ts
│ │ └── injury.ts
│ ├── csvImport/ # csvダウンロードロジック
│ ├── db/ # db 接続
│ │ └── connect.ts
│ ├── erros/ # エラー処理
│ ├── middleware/ # ミドルウェア
│ ├── models/ # データベースのモデル
│ │ ├── user.ts
│ │ ├── team.ts
│ │ ├── player.ts
│ │ ├── transfer.ts
│ │ └── injury.ts
│ ├── routes/ # ルーティング
│ │ ├── auth.ts
│ │ ├── player.ts
│ │ ├── transfer.ts
│ │ └── injury.ts
│ ├── utils/ # ヘルパー関数やユーティリティ
│ │ └── generateToken.ts
│ ├── .env
│ └── README.md       # バックエンドの説明
```

## 2. 環境変数

```
PORT=3000
MONGODB_URI=<your_mongodb_uri>
JWT_SECRET=<your_jwt_secret>
JWT_EXPIRATION="1h"
JWT_REFRESH_EXPIRATION="30d"
CLIENT_URL=1,2,3
SAMPLE_INPUT_MODEL_PATH_TRANSFER=\test_data\input\transfer_sample.csv
SAMPLE_INPUT_MODEL_PATH_INJURY=\test_data\input\injury.csv
SAMPLE_OUTPUT_MODEL_PATH_TRANSFER=\test_data\output\failed_transfer.csv
SAMPLE_OUTPUT_MODEL_PATH_INJURY=\test_data\output\failed_injury.csv
```

## 3.開発環境

```bash
  npm run dev
```

## 4.ビルド

```bash
  cd shared && npm run build && cd ../server && npm install
```
