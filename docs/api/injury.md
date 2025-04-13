# 怪我

- [怪我](#怪我)
  - [1. 概要- 怪我](#1-概要--怪我)
  - [2. エラー処理](#2-エラー処理)
    - [2.1 :id が見つからないとき](#21-id-が見つからないとき)
    - [2.2 必須フィールドなし](#22-必須フィールドなし)
  - [3. リクエスト・レスポンス例](#3-リクエストレスポンス例)
    - [3.1 `GET` | `/api/v1/injury`](#31-get--apiv1injury)
    - [3.2 `POST` | `/api/v1/injury`](#32-post--apiv1injury)
    - [3.3 `GET` | `/api/v1/injury/:id`](#33-get--apiv1injuryid)
    - [3.4 `PUT` | `/api/v1/injury/:id`](#34-put--apiv1injuryid)
    - [3.5 `DELETE` | `/api/v1/injury/:id`](#35-delete--apiv1injuryid)

## 1. 概要- [怪我](#怪我)

| メソッド | エンドポイント       | 説明         | バリデーション        |
| -------- | -------------------- | ------------ | --------------------- |
| `GET`    | `/api/v1/injury`     | 怪我一覧取得 | なし                  |
| `POST`   | `/api/v1/injury`     | 怪我新規追加 | 必須                  |
| `GET`    | `/api/v1/injury/:id` | 怪我詳細取得 | id のフォーマット検証 |
| `PUT`    | `/api/v1/injury/:id` | 怪我情報更新 | id のフォーマット検証 |
| `DELETE` | `/api/v1/injury/:id` | 怪我削除     | id のフォーマット検証 |

## 2. エラー処理

### 2.1 :id が見つからないとき

```json
{
  "error": {
    "code": 404,
    "message": "指定した怪我情報が見つかりません。",
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

### 3.1 `GET` | `/api/v1/injury`

- レスポンス

```json
{
  "data": [
    {
      "_id": "",
      "doa": "",
      "team": "",
      "now_team": "",
      "player": "",
      "doi": "",
      "dos": "",
      "injured_part": "",
      "is_injured": "",
      "ttp": "",
      "erd": "",
      "URL": ""
    },
    {
      "_id": "",
      "doa": "",
      "team": "",
      "now_team": "",
      "player": "",
      "doi": "",
      "dos": "",
      "injured_part": "",
      "is_injured": "",
      "ttp": "",
      "erd": "",
      "URL": ""
    }
  ]
}
```

### 3.2 `POST` | `/api/v1/injury`

- リクエストボディ

```json
{
  // 必須フィールド doa, player,
  "doa": "",
  "team"?: "",
  // "now_team"?: "", バックエンドで処理される
  "player": "", // _id　または name
  "doi"?: "",
  "dos"?: "",
  "injured_part"? : "",
  "is_injured"? : "",
  "ttp"?: "",
  "erd"?: "",
  "URL"?: "",
}

```

- レスポンス

  - 成功時

    ```json
    {
      "message": "追加しました",
      "data": {
        "_id": "",
        "doa": "",
        "team": "",
        "now_team": "",
        "player": "",
        "doi": "",
        "dos": "",
        "injured_part": "",
        "is_injured": "",
        "ttp": "",
        "erd": "",
        "URL": ""
      }
    }
    ```

### 3.3 `GET` | `/api/v1/injury/:id`

- レスポンス

- 成功時

```json
{
  "data": {
    "_id": "",
    "doa": "",
    "team": "",
    "now_team": "",
    "player": "",
    "doi": "",
    "dos": "",
    "injured_part": "",
    "is_injured": "",
    "ttp": "",
    "erd": "",
    "URL": ""
  }
}
```

### 3.4 `PUT` | `/api/v1/injury/:id`

- リクエストボディ

```json
{
  // "player": "", // _id　または name
  // "team": "", // _id　または abbr
  "is_injured": ""
}
```

- レスポンス

  - 成功時

  ```json
  {
    "message": "編集しました"
  }
  ```

### 3.5 `DELETE` | `/api/v1/injury/:id`

- レスポンス

- 成功時

```json
{
  "message": "削除しました"
}
```
