# 試合フォーマット

- [試合フォーマット](#試合フォーマット)
  - [1. 概要](#1-概要)
  - [2. エラー処理](#2-エラー処理)
    - [2.1 :id が見つからないとき](#21-id-が見つからないとき)
    - [2.2 必須フィールドなし](#22-必須フィールドなし)
  - [3. リクエスト・レスポンス例](#3-リクエストレスポンス例)
    - [3.1 `GET` | `/api/v1/match-format`](#31-get--apiv1match-format)
    - [3.2 `POST` | `/api/v1/match-format`](#32-post--apiv1match-format)
    - [3.4 `GET` | `/api/v1/match-format/:id`](#34-get--apiv1match-formatid)
    - [3.5 `PUT` | `/api/v1/match-format/:id`](#35-put--apiv1match-formatid)
    - [3.5 `DELETE` | `/api/v1/match-format/:id`](#35-delete--apiv1match-formatid)

## 1. 概要

| メソッド | エンドポイント             | 説明     | バリデーション        | フロント      |
| -------- | -------------------------- | -------- | --------------------- | ------------- |
| `GET`    | `/api/v1/match-format`     | 一覧取得 | なし                  | /match-format |
| `POST`   | `/api/v1/match-format`     | 新規追加 | 必須:                 |
| `GET`    | `/api/v1/match-format/:id` | 取得     | id のフォーマット検証 |
| `PUT`    | `/api/v1/match-format/:id` | 更新     | id のフォーマット検証 |
| `DELETE` | `/api/v1/match-format/:id` | 削除     | id のフォーマット検証 |

## 2. エラー処理

### 2.1 :id が見つからないとき

```json
{
  "error": {
    "code": 404,
    "message": "指定した試合フォーマットが見つかりません。",
    "errors": {}
  }
}
```

### 2.2 必須フィールドなし

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

## 3. リクエスト・レスポンス例

### 3.1 `GET` | `/api/v1/match-format`

- レスポンス

```json
{
  "data": [
    {
      "_id": "68c3e49b21e1577c80af5616",
      "name": "90",
      "period": [
        {
          "period_label": "1H",
          "start": 0,
          "end": 45,
          "order": 0
        },
        {
          "period_label": "2H",
          "start": 45,
          "end": 90,
          "order": 0
        }
      ],
      "createdAt": "2025-09-12T09:15:07.872Z",
      "updatedAt": "2025-09-12T09:15:07.872Z",
      "__v": 0
    }
  ]
}
```

### 3.2 `POST` | `/api/v1/match-format`

- リクエストボディ

```json
{
  "name": "90+PK",
  "period": [
    { "period_label": "1H", "start": 0, "end": 45 },
    { "period_label": "2H", "start": 45, "end": 90 },
    { "period_label": "PK" }
  ]
}
```

- レスポンス

  - 成功時

  ```json
  {
    "message": "追加しました",
    "data": {
      "_id": "68c3e4e821e1577c80af561d",
      "name": "90+PK",
      "period": [
        {
          "period_label": "1H",
          "start": 0,
          "end": 45,
          "order": 0
        },
        {
          "period_label": "2H",
          "start": 45,
          "end": 90,
          "order": 0
        },
        {
          "period_label": "PK",
          "start": null,
          "end": null,
          "order": 0
        }
      ],
      "createdAt": "2025-09-12T09:16:24.735Z",
      "updatedAt": "2025-09-12T09:16:24.735Z",
      "__v": 0
    }
  }
  ```

### 3.4 `GET` | `/api/v1/match-format/:id`

- レスポンス

  - 成功時

  ```json
  {
    "data": {
      "_id": "68c3e4e821e1577c80af561d",
      "name": "putted",
      "period": [
        {
          "period_label": "1H",
          "start": 0,
          "end": 45,
          "order": 0
        },
        {
          "period_label": "2H",
          "start": 45,
          "end": 90,
          "order": 0
        },
        {
          "period_label": "PK",
          "start": null,
          "end": null,
          "order": 0
        }
      ],
      "createdAt": "2025-09-12T09:16:24.735Z",
      "updatedAt": "2025-09-12T09:17:06.293Z",
      "__v": 0
    }
  }
  ```

### 3.5 `PUT` | `/api/v1/match-format/:id`

- リクエストボディ

```json
{
  "name": "putted"
}
```

- レスポンス

  - 成功時

  ```json
  {
    "message": "編集しました",
    "data": {
      "_id": "68c3e4e821e1577c80af561d",
      "name": "putted",
      "period": [
        {
          "period_label": "1H",
          "start": 0,
          "end": 45,
          "order": 0
        },
        {
          "period_label": "2H",
          "start": 45,
          "end": 90,
          "order": 0
        },
        {
          "period_label": "PK",
          "start": null,
          "end": null,
          "order": 0
        }
      ],
      "createdAt": "2025-09-12T09:16:24.735Z",
      "updatedAt": "2025-09-12T09:17:06.293Z",
      "__v": 0
    }
  }
  ```

### 3.5 `DELETE` | `/api/v1/match-format/:id`

- レスポンス

- 成功時

```json
{
  "message": "削除しました"
}
```
