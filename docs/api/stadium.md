# スタジアム

- [スタジアム](#スタジアム)
  - [1. 概要](#1-概要)
  - [2. エラー処理](#2-エラー処理)
    - [2.1 :id が見つからないとき](#21-id-が見つからないとき)
    - [2.2 必須フィールドなし](#22-必須フィールドなし)
  - [3. リクエスト・レスポンス例](#3-リクエストレスポンス例)
    - [3.1 `GET` | `/api/v1/stadium`](#31-get--apiv1stadium)
    - [3.2 `POST` | `/api/v1/stadium`](#32-post--apiv1stadium)
    - [3.4 `GET` | `/api/v1/stadium/:id`](#34-get--apiv1stadiumid)
    - [3.5 `PUT` | `/api/v1/stadium/:id`](#35-put--apiv1stadiumid)
    - [3.5 `DELETE` | `/api/v1/stadium/:id`](#35-delete--apiv1stadiumid)

## 1. 概要

| メソッド | エンドポイント        | 説明     | バリデーション        | フロント |
| -------- | --------------------- | -------- | --------------------- | -------- |
| `GET`    | `/api/v1/stadium`     | 一覧取得 | なし                  | /stadium |
| `POST`   | `/api/v1/stadium`     | 新規追加 | 必須:                 |
| `GET`    | `/api/v1/stadium/:id` | 取得     | id のフォーマット検証 |
| `PUT`    | `/api/v1/stadium/:id` | 更新     | id のフォーマット検証 |
| `DELETE` | `/api/v1/stadium/:id` | 削除     | id のフォーマット検証 |

## 2. エラー処理

### 2.1 :id が見つからないとき

```json
{
  "error": {
    "code": 404,
    "message": "指定したスタジアムが見つかりません。",
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

### 3.1 `GET` | `/api/v1/stadium`

- レスポンス

```json
{
  "data": [
    {
      "_id": "68bf7a49e92430c533c03982",
      "name": "test_stadium",
      "alt_name": [],
      "alt_abbr": [],
      "alt_en_name": [],
      "country": "688b2c5fe7d7762ddaad1dfb",
      "createdAt": "2025-09-09T00:52:25.790Z",
      "updatedAt": "2025-09-09T00:52:25.790Z",
      "__v": 0
    }
  ]
}
```

### 3.2 `POST` | `/api/v1/stadium`

- リクエストボディ

```json
{
  "name": "test_stadium",
  "country": "688b2c5fe7d7762ddaad1dfb"
}
```

- レスポンス

  - 成功時

  ```json
  {
    "message": "追加しました",
    "data": {
      "_id": "68bf7a49e92430c533c03982",
      "name": "test_stadium",
      "alt_name": [],
      "alt_abbr": [],
      "alt_en_name": [],
      "country": {
        "_id": "688b2c5fe7d7762ddaad1dfb",
        "name": "日本",
        "en_name": "Japan",
        "iso3": "JPN",
        "fifa_code": "JPN",
        "area": "アジア",
        "district": "東アジア",
        "confederation": "AFC",
        "sub_confederation": "EAFF",
        "established_year": 1921,
        "fifa_member_year": null,
        "association_member_year": 1954,
        "district_member_year": null,
        "__v": 0,
        "createdAt": "2025-07-31T08:42:07.984Z",
        "updatedAt": "2025-07-31T08:42:07.984Z"
      },
      "createdAt": "2025-09-09T00:52:25.790Z",
      "updatedAt": "2025-09-09T00:52:25.790Z",
      "__v": 0
    }
  }
  ```

### 3.4 `GET` | `/api/v1/stadium/:id`

- レスポンス

  - 成功時

  ```json
  {
    "data": {
      "_id": "68bf7a49e92430c533c03982",
      "name": "test_stadium",
      "alt_name": [],
      "alt_abbr": [],
      "alt_en_name": [],
      "country": {
        "_id": "688b2c5fe7d7762ddaad1dfb",
        "name": "日本",
        "en_name": "Japan",
        "iso3": "JPN",
        "fifa_code": "JPN",
        "area": "アジア",
        "district": "東アジア",
        "confederation": "AFC",
        "sub_confederation": "EAFF",
        "established_year": 1921,
        "fifa_member_year": null,
        "association_member_year": 1954,
        "district_member_year": null,
        "__v": 0,
        "createdAt": "2025-07-31T08:42:07.984Z",
        "updatedAt": "2025-07-31T08:42:07.984Z"
      },
      "createdAt": "2025-09-09T00:52:25.790Z",
      "updatedAt": "2025-09-09T00:52:25.790Z",
      "__v": 0
    }
  }
  ```

### 3.5 `PUT` | `/api/v1/stadium/:id`

- リクエストボディ

```json
{
  "name": "putted_test_stadium"
}
```

- レスポンス

  - 成功時

  ```json
  {
    "message": "編集しました",
    "data": {
      "_id": "68bf7a49e92430c533c03982",
      "name": "putted_test_stadium",
      "alt_name": [],
      "alt_abbr": [],
      "alt_en_name": [],
      "country": {
        "_id": "688b2c5fe7d7762ddaad1dfb",
        "name": "日本",
        "en_name": "Japan",
        "iso3": "JPN",
        "fifa_code": "JPN",
        "area": "アジア",
        "district": "東アジア",
        "confederation": "AFC",
        "sub_confederation": "EAFF",
        "established_year": 1921,
        "fifa_member_year": null,
        "association_member_year": 1954,
        "district_member_year": null,
        "__v": 0,
        "createdAt": "2025-07-31T08:42:07.984Z",
        "updatedAt": "2025-07-31T08:42:07.984Z"
      },
      "createdAt": "2025-09-09T00:52:25.790Z",
      "updatedAt": "2025-09-09T00:53:45.769Z",
      "__v": 0
    }
  }
  ```

### 3.5 `DELETE` | `/api/v1/stadium/:id`

- レスポンス

- 成功時

```json
{
  "message": "削除しました"
}
```
