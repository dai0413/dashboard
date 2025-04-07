# サーバー (バックエンド) 構成

このディレクトリは Node.js + Express + MongoDB による API サーバーの実装。
選手情報・移籍履歴・怪我履歴の管理・JWT を使った認証機能を提供。

## 目次

- [サーバー (バックエンド) 構成](#サーバー-バックエンド-構成)
  - [目次](#目次)
  - [1. 構成](#1-構成)
  - [2. 環境変数](#2-環境変数)
  - [3. セットアップ](#3-セットアップ)

## 1. 構成

```
project/
│
├──server/
│ ├── server.ts # サーバーエントリーポイント
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
│ ├── controllers/ # ビジネスロジック
│ │ ├── auth.ts
│ │ ├── player.ts
│ │ ├── transfer.ts
│ │ └── injury.ts
│ ├── middleware/ # ミドルウェア
│ │ ├── auth.ts
│ │ └── error.ts
│ ├── db/ # db 接続
│ │ └── connect.ts
│ ├── utils/ # ヘルパー関数やユーティリティ
│ │ └── generateToken.ts
│ ├── .env
│ └── README.md       # バックエンドの説明
```

## 2. 環境変数

```

MONGODB_URI=<your_mongodb_uri>
JWT_SECRET=<your_jwt_secret>
JWT_EXPIRATION="1h"
JWT_REFRESH_EXPIRATION="30d"

```

## 3. セットアップ

```bash

```
