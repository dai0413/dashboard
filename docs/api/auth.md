# 認証

- [認証](#認証)
  - [1. 概要](#1-概要)
  - [2. 共通ヘッダーについて](#2-共通ヘッダーについて)
  - [3. エラー処理](#3-エラー処理)
    - [3.1 必須フィールドなし](#31-必須フィールドなし)
  - [4. リクエスト・レスポンス例](#4-リクエストレスポンス例)
    - [4.1 `POST` | `/api/v1/auth/register`](#41-post--apiv1authregister)
    - [4.2 `POST` | `/api/v1/auth/login`](#42-post--apiv1authlogin)
    - [4.3 `POST` | `/api/v1/auth/logout`](#43-post--apiv1authlogout)
    - [4.4 `GET` | `/api/v1/auth/me`](#44-get--apiv1authme)
    - [4.5 `POST` | `/api/v1/auth/refresh`](#45-post--apiv1authrefresh)

## 1. 概要

| メソッド | エンドポイント          | 説明                                         | 　フロント |
| -------- | ----------------------- | -------------------------------------------- | ---------- |
| `POST`   | `/api/v1/auth/register` | 新規登録                                     | /register  |
| `POST`   | `/api/v1/auth/login`    | アクセストークン & リフレッシュトークン 発行 | /login     |
| `POST`   | `/api/v1/auth/logout`   | トークン無効化                               |
| `GET`    | `/api/v1/auth/me`       | 現在ログイン中のユーザー情報取得             |
| `POST`   | `/api/v1/auth/refresh`  | アクセストークン再発行                       |

## 2. 共通ヘッダーについて

ログイン状態にあるものにはヘッダーにアクセストークンを付与
これがあるときは /auth/logout, auth/me, /auth/refresh にアクセス可能

- ヘッダー

```json
{
  "Authorization": Bearer {アクセストークン}
}

```

## 3. エラー処理

### 3.1 必須フィールドなし

```json
{
  "error": {
    "code": 400,
    "message": "",
    "errors": {}
  }
}
```

※その他ステータスコード別の message は[エラーハンドリング](../error-handling.md)を参照

## 4. リクエスト・レスポンス例

### 4.1 `POST` | `/api/v1/auth/register`

- リクエストボディ

  ```json
  {
    "user_name": "",
    "email": "",
    "password": ""
  }
  ```

- レスポンス

  - 成功時

  ```json
  {
    "message": "新規登録しました。",
    "accessToken": ""
  }
  ```

### 4.2 `POST` | `/api/v1/auth/login`

- リクエストボディ

```json
{
  "email": "",
  "password": ""
}
```

- レスポンス

  - 成功時

  ```json
  {
    "message": "ログインしました。",
    "accessToken": ""
  }
  ```

### 4.3 `POST` | `/api/v1/auth/logout`

- レスポンス

  - 成功時

  ```json
  {
    "message": "ログアウトしました。"
  }
  ```

### 4.4 `GET` | `/api/v1/auth/me`

- レスポンス

  - 成功時

  ```json
  {
    "user_name": "user_example",
    "email": "user@example.com",
    "is_staff": true
  }
  ```

### 4.5 `POST` | `/api/v1/auth/refresh`

- レスポンス

  - 成功時

  ```json
  {
    "message": "アクセストークンを再発行しました。",
    "accessToken": ""
  }
  ```
