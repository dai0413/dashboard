# クライアント (フロントエンド) 構成

このディレクトリは React.js を使ったフロントエンドの実装。

## 目次

- [クライアント (フロントエンド) 構成](#クライアント-フロントエンド-構成)
  - [目次](#目次)
  - [1. 構成](#1-構成)
  - [2.セットアップ](#2セットアップ)
  - [3.開発環境](#3開発環境)
  - [4.ビルド](#4ビルド)

## 1. 構成

```
project/
│
├── client/             # フロントエンド（React）
│   ├── src/            # ソースコード
│   │   ├── components/ # UI コンポーネント
│   │   ├── context/    # グローバルステート管理
│   │   ├── lib/        # ルーティング,バックエンドDBへの変換
│   │   ├── pages/      # ページ
│   │   ├── styles/     # 型定義
│   │   ├── utils/      # 関数
│   │   ├── App.ts      # ルーティング設定
│   │   ├── index.ts    # エントリーポイント
│   ├── test_data       # テストデータ
│   ├── package.json    # React の設定
│   └── README.md       # フロントエンドの説明
```

## 2.セットアップ

```bash
npm create vite@latest client -- --template react-ts
cd client
npm install
```

## 3.開発環境

```bash
  npm run dev
```

## 4.ビルド

```bash
  npm run build
```

生成されたファイルは dist/ディレクトリに出力される
