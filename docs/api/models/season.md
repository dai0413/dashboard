# シーズン

- [シーズン](#シーズン)
  - [1. 概要](#1-概要)
  - [2. エラー処理](#2-エラー処理)
    - [2.1 :id が見つからないとき](#21-id-が見つからないとき)
    - [2.2 必須フィールドなし](#22-必須フィールドなし)
  - [3. リクエスト・レスポンス例](#3-リクエストレスポンス例)
    - [3.1 `GET` | `/api/v1/season`](#31-get--apiv1season)
    - [3.2 `POST` | `/api/v1/season`](#32-post--apiv1season)
    - [3.4 `GET` | `/api/v1/season/:id`](#34-get--apiv1seasonid)
    - [3.5 `PUT` | `/api/v1/season/:id`](#35-put--apiv1seasonid)
    - [3.5 `DELETE` | `/api/v1/season/:id`](#35-delete--apiv1seasonid)

## 1. 概要

| メソッド | エンドポイント       | 説明     | バリデーション        | フロント |
| -------- | -------------------- | -------- | --------------------- | -------- |
| `GET`    | `/api/v1/season`     | 一覧取得 | なし                  | /season  |
| `POST`   | `/api/v1/season`     | 新規追加 | 必須:                 |
| `GET`    | `/api/v1/season/:id` | 取得     | id のフォーマット検証 |
| `PUT`    | `/api/v1/season/:id` | 更新     | id のフォーマット検証 |
| `DELETE` | `/api/v1/season/:id` | 削除     | id のフォーマット検証 |

## 2. エラー処理

### 2.1 :id が見つからないとき

```json
{
  "error": {
    "code": 404,
    "message": "指定したシーズンが見つかりません。",
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

### 3.1 `GET` | `/api/v1/season`

- レスポンス

```json
{
  "data": [
    {
      "_id": "68b53ad3f196eaff99e00ace",
      "competition": {
        "_id": "68b16aa806098678a4f4af3e",
        "name": "Ｊ１リーグ",
        "abbr": "J1",
        "en_name": null,
        "country": "688b2c5fe7d7762ddaad1dfb",
        "competition_type": "club",
        "category": "league",
        "level": "1部",
        "age_group": "full",
        "official_match": true,
        "transferurl": "https://www.transfermarkt.jp/j1rigu/startseite/wettbewerb/JAP1",
        "__v": 0,
        "createdAt": "2025-08-29T08:54:00.803Z",
        "updatedAt": "2025-08-29T08:54:00.803Z"
      },
      "name": "2025",
      "createdAt": "2025-09-01T06:18:59.379Z",
      "updatedAt": "2025-09-01T06:18:59.379Z",
      "__v": 0
    }
  ]
}
```

### 3.2 `POST` | `/api/v1/season`

- リクエストボディ

```json
{
  "competition": "68b16aa806098678a4f4af3e",
  "name": "2025"
}
```

- レスポンス

  - 成功時

  ```json
  {
    "message": "追加しました",
    "data": {
      "_id": "68b53ad3f196eaff99e00ace",
      "competition": {
        "_id": "68b16aa806098678a4f4af3e",
        "name": "Ｊ１リーグ",
        "abbr": "J1",
        "en_name": null,
        "country": "688b2c5fe7d7762ddaad1dfb",
        "competition_type": "club",
        "category": "league",
        "level": "1部",
        "age_group": "full",
        "official_match": true,
        "transferurl": "https://www.transfermarkt.jp/j1rigu/startseite/wettbewerb/JAP1",
        "__v": 0,
        "createdAt": "2025-08-29T08:54:00.803Z",
        "updatedAt": "2025-08-29T08:54:00.803Z"
      },
      "name": "2025",
      "createdAt": "2025-09-01T06:18:59.379Z",
      "updatedAt": "2025-09-01T06:18:59.379Z",
      "__v": 0
    }
  }
  ```

### 3.4 `GET` | `/api/v1/season/:id`

- レスポンス

  - 成功時

  ```json
  {
    "data": {
      "_id": "68b53ad3f196eaff99e00ace",
      "competition": {
        "_id": "68b16aa806098678a4f4af3e",
        "name": "Ｊ１リーグ",
        "abbr": "J1",
        "en_name": null,
        "country": "688b2c5fe7d7762ddaad1dfb",
        "competition_type": "club",
        "category": "league",
        "level": "1部",
        "age_group": "full",
        "official_match": true,
        "transferurl": "https://www.transfermarkt.jp/j1rigu/startseite/wettbewerb/JAP1",
        "__v": 0,
        "createdAt": "2025-08-29T08:54:00.803Z",
        "updatedAt": "2025-08-29T08:54:00.803Z"
      },
      "name": "2025",
      "createdAt": "2025-09-01T06:18:59.379Z",
      "updatedAt": "2025-09-01T06:18:59.379Z",
      "__v": 0
    }
  }
  ```

### 3.5 `PUT` | `/api/v1/season/:id`

- リクエストボディ

```json
{
  "start_date": "2025/2/1"
}
```

- レスポンス

  - 成功時

  ```json
  {
    "message": "編集しました",
    "data": {
      "_id": "68b53ad3f196eaff99e00ace",
      "competition": {
        "_id": "68b16aa806098678a4f4af3e",
        "name": "Ｊ１リーグ",
        "abbr": "J1",
        "en_name": null,
        "country": "688b2c5fe7d7762ddaad1dfb",
        "competition_type": "club",
        "category": "league",
        "level": "1部",
        "age_group": "full",
        "official_match": true,
        "transferurl": "https://www.transfermarkt.jp/j1rigu/startseite/wettbewerb/JAP1",
        "__v": 0,
        "createdAt": "2025-08-29T08:54:00.803Z",
        "updatedAt": "2025-08-29T08:54:00.803Z"
      },
      "name": "2025",
      "createdAt": "2025-09-01T06:18:59.379Z",
      "updatedAt": "2025-09-01T06:19:55.828Z",
      "__v": 0,
      "start_date": "2025-01-31T15:00:00.000Z"
    }
  }
  ```

### 3.5 `DELETE` | `/api/v1/season/:id`

- レスポンス

- 成功時

```json
{
  "message": "削除しました"
}
```
