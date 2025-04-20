# 移籍

- [移籍](#移籍)
  - [1. 概要](#1-概要)
  - [2. エラー処理](#2-エラー処理)
    - [2.1 :id が見つからないとき](#21-id-が見つからないとき)
    - [2.2 必須フィールドなし](#22-必須フィールドなし)
  - [3. リクエスト・レスポンス例](#3-リクエストレスポンス例)
    - [3.1 `GET` | `/api/v1/transfer`](#31-get--apiv1transfer)
    - [3.2 `POST` | `/api/v1/transfer`](#32-post--apiv1transfer)
    - [3.3 `GET` | `/api/v1/transfer/:id`](#33-get--apiv1transferid)
    - [3.4 `PUT` | `/api/v1/transfer/:id`](#34-put--apiv1transferid)
    - [3.5 `DELETE` | `/api/v1/transfer/:id`](#35-delete--apiv1transferid)

## 1. 概要

| メソッド | エンドポイント         | 説明     | バリデーション        | フロント  |
| -------- | ---------------------- | -------- | --------------------- | --------- |
| `GET`    | `/api/v1/transfer`     | 一覧取得 | なし                  | /transfer |
| `POST`   | `/api/v1/transfer`     | 新規追加 | 必須                  |
| `GET`    | `/api/v1/transfer/:id` | 取得     | id のフォーマット検証 |
| `PUT`    | `/api/v1/transfer/:id` | 更新     | id のフォーマット検証 |
| `DELETE` | `/api/v1/transfer/:id` | 削除     | id のフォーマット検証 |

## 2. エラー処理

### 2.1 :id が見つからないとき

```json
{
  "error": {
    "code": 404,
    "message": "指定した移籍情報が見つかりません。",
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

### 3.1 `GET` | `/api/v1/transfer`

- レスポンス

```json
{
  "data": [
    {
      "_id": "",
      "dob": "",
      "from_team": "",
      "to_team": "",
      "player": "",
      "position": "",
      "form": "",
      "number": "",
      "from_date": "",
      "to_date": "",
      "URL": ""
    },
    {
      "_id": "",
      "dob": "",
      "from_team": "",
      "to_team": "",
      "player": "",
      "position": "",
      "form": "",
      "number": "",
      "from_date": "",
      "to_date": "",
      "URL": ""
    }
  ]
}
```

### 3.2 `POST` | `/api/v1/transfer`

- リクエストボディ

```json
// 必須フィールド dob, player, form, from_date
{
  "dob": "",
  "from_team"? : "", //abbr
  "to_team" ?: "", //abbr
  "player": "",
  "position"? : "",
  "form": "",
  "number"?: "",
  "from_date": "",
  "to_date"?: "",
  "URL"?: ""
}

```

- レスポンス

  - 成功時

  ```json
  {
    "message" : "追加しました"
    "data":   {
        "dob": "",
        "from_team"? : "",
        "to_team" ?: "",
        "player": "",
        "position"? : "",
        "form": "",
        "number"?: "",
        "from_date": "",
        "to_date"?: "",
        "URL"?: ""
    }
  }

  ```

### 3.3 `GET` | `/api/v1/transfer/:id`

- レスポンス

  - 成功時

  ```json
  {
    "data": {
      "_id": "",
      "dob": "",
      "from_team": "",
      "to_team": "",
      "player": "",
      "position": "",
      "form": "",
      "number": "",
      "from_date": "",
      "to_date": "",
      "URL": ""
    }
  }
  ```

### 3.4 `PUT` | `/api/v1/transfer/:id`

- リクエストボディ

  ```json
  {
    "form": ""
    // "from_team": "", teamのときは _idまたはabbr
  }
  ```

- レスポンス

  - 成功時

  ```json
  {
    "message": "編集しました"
  }
  ```

### 3.5 `DELETE` | `/api/v1/transfer/:id`

- レスポンス

  - 成功時

  ```json
  {
    "message": "削除しました"
  }
  ```
