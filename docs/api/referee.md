# 審判

- [審判](#審判)
  - [1. 概要](#1-概要)
  - [2. エラー処理](#2-エラー処理)
    - [2.1 :id が見つからないとき](#21-id-が見つからないとき)
    - [2.2 必須フィールドなし](#22-必須フィールドなし)
  - [3. リクエスト・レスポンス例](#3-リクエストレスポンス例)
    - [3.1 `GET` | `/api/v1/referee`](#31-get--apiv1referee)
    - [3.2 `POST` | `/api/v1/referee`](#32-post--apiv1referee)
    - [3.4 `GET` | `/api/v1/referee/:id`](#34-get--apiv1refereeid)
    - [3.5 `PUT` | `/api/v1/referee/:id`](#35-put--apiv1refereeid)
    - [3.5 `DELETE` | `/api/v1/referee/:id`](#35-delete--apiv1refereeid)

## 1. 概要

| メソッド | エンドポイント        | 説明     | バリデーション        | フロント |
| -------- | --------------------- | -------- | --------------------- | -------- |
| `GET`    | `/api/v1/referee`     | 一覧取得 | なし                  | /referee |
| `POST`   | `/api/v1/referee`     | 新規追加 | 必須:                 |
| `GET`    | `/api/v1/referee/:id` | 取得     | id のフォーマット検証 |
| `PUT`    | `/api/v1/referee/:id` | 更新     | id のフォーマット検証 |
| `DELETE` | `/api/v1/referee/:id` | 削除     | id のフォーマット検証 |

## 2. エラー処理

### 2.1 :id が見つからないとき

```json
{
  "error": {
    "code": 404,
    "message": "指定した審判が見つかりません。",
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

### 3.1 `GET` | `/api/v1/referee`

- レスポンス

```json
{
  "data": [
    {
      "_id": "68ae4b0936e4437f7bec77a7",
      "name": "相葉　忠臣",
      "en_name": "Tadaomi AIBA",
      "dob": "1967-03-17T15:00:00.000Z",
      "pob": null,
      "citizenship": [],
      "player": null,
      "__v": 0,
      "createdAt": "2025-08-27T00:02:17.742Z",
      "updatedAt": "2025-08-27T00:02:17.742Z"
    }
  ]
}
```

### 3.2 `POST` | `/api/v1/referee`

- リクエストボディ

```json
{
  "name": "相葉　忠臣",
  "en_name": "Tadaomi AIBA",
  "dob": "1967-03-17T15:00:00.000Z",
  "pob": null,
  "citizenship": [],
  "player": null
}
```

- レスポンス

  - 成功時

  ```json
  {
    "message": "追加しました",
    "data": {
      "_id": "68ae4b01219f34880823447c",
      "name": "相葉　忠臣",
      "en_name": "Tadaomi AIBA",
      "dob": "1967-03-17T15:00:00.000Z",
      "pob": null,
      "citizenship": [],
      "player": null,
      "createdAt": "2025-08-27T00:02:09.482Z",
      "updatedAt": "2025-08-27T00:02:09.482Z",
      "__v": 0
    }
  }
  ```

### 3.4 `GET` | `/api/v1/referee/:id`

- レスポンス

  - 成功時

  ```json
  {
    "data": {
      "_id": "68ae4b0936e4437f7bec77a7",
      "name": "相葉　忠臣",
      "en_name": "Tadaomi AIBA",
      "dob": "1967-03-17T15:00:00.000Z",
      "pob": null,
      "citizenship": [],
      "player": null,
      "__v": 0,
      "createdAt": "2025-08-27T00:02:17.742Z",
      "updatedAt": "2025-08-27T00:02:17.742Z"
    }
  }
  ```

### 3.5 `PUT` | `/api/v1/referee/:id`

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
      "_id": "68ae4b0936e4437f7bec77a7",
      "name": "putted",
      "en_name": "Tadaomi AIBA",
      "dob": "1967-03-17T15:00:00.000Z",
      "pob": null,
      "citizenship": [],
      "player": null,
      "__v": 0,
      "createdAt": "2025-08-27T00:02:17.742Z",
      "updatedAt": "2025-08-27T00:08:33.506Z"
    }
  }
  ```

### 3.5 `DELETE` | `/api/v1/referee/:id`

- レスポンス

- 成功時

```json
{
  "message": "削除しました"
}
```
