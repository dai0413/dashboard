# ドキュメント概要

このディレクトリには、バックエンドとフロントエンドの技術仕様や API 定義、将来的な改善方針など、開発に関わるドキュメントをまとめています。

## 目次

- [ドキュメント概要](#ドキュメント概要)
  - [目次](#目次)
  - [1. API ドキュメント](#1-api-ドキュメント)
  - [2. 認証の仕様](#2-認証の仕様)
  - [3. データベース設計](#3-データベース設計)
  - [4. エラーハンドリング方針](#4-エラーハンドリング方針)
  - [5. 将来的な改善アイデア](#5-将来的な改善アイデア)
  - [6. Git 管理](#6-git-管理)
  - [7. パッケージ管理](#7-パッケージ管理)

---

## 1. API ドキュメント

各エンドポイントごとの仕様は以下にまとめています。

| エンドポイント                  | 機能説明         | 詳細ドキュメント                                             |
| ------------------------------- | ---------------- | ------------------------------------------------------------ |
| `/api/v1/auth`                  | 認証             | [auth.md](./api/auth.md)                                     |
| `/api/v1/country`               | 国               | [country.md](./api/country.md)                               |
| `/api/v1/injury`                | 怪我             | [injury.md](./api/injury.md)                                 |
| `/api/v1/player`                | 選手             | [player.md](./api/player.md)                                 |
| `/api/v1/team`                  | チーム           | [team.md](./api/team.md)                                     |
| `/api/v1/top-page`              | トップページ用   | [top-page.md](./api/top-page.md)                             |
| `/api/v1/transfer`              | 移籍             | [transfer.md](./api/transfer.md)                             |
| `/api/v1/national-match-series` | 代表試合シリーズ | 　[national-match-series.md](./api/national-match-series.md) |

---

## 2. 認証の仕様

- [auth.md](./auth.md): JWT を用いたログイン・登録・トークンリフレッシュなどの仕様。

---

## 3. データベース設計

- [db-schema.md](./db-schema.md): MongoDB のコレクション構成とスキーマの詳細。

---

## 4. エラーハンドリング方針

- [error-handling.md](./error-handling.md): クライアント・サーバー間での統一的なエラー設計について。

---

## 5. 将来的な改善アイデア

- [future.md](./future.md): 今後追加したい機能や改善案のメモ。

---

## 6. Git 管理

- [git-management.md](./git-management.md): Git 管理用のブランチ・コミットルールについて。

---

## 7. パッケージ管理

- [packages.md](./packages.md): インストールするパッケージについて。
