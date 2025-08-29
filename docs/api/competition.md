# 大会

- [大会](#大会)
  - [1. 概要](#1-概要)
  - [2. エラー処理](#2-エラー処理)
    - [2.1 :id が見つからないとき](#21-id-が見つからないとき)
    - [2.2 必須フィールドなし](#22-必須フィールドなし)
  - [3. リクエスト・レスポンス例](#3-リクエストレスポンス例)
    - [3.1 `GET` | `/api/v1/competition`](#31-get--apiv1competition)
    - [3.2 `POST` | `/api/v1/competition`](#32-post--apiv1competition)
    - [3.4 `GET` | `/api/v1/competition/:id`](#34-get--apiv1competitionid)
    - [3.5 `PUT` | `/api/v1/competition/:id`](#35-put--apiv1competitionid)
    - [3.5 `DELETE` | `/api/v1/competition/:id`](#35-delete--apiv1competitionid)

## 1. 概要

| メソッド | エンドポイント            | 説明     | バリデーション        | フロント     |
| -------- | ------------------------- | -------- | --------------------- | ------------ |
| `GET`    | `/api/v1/competition`     | 一覧取得 | なし                  | /competition |
| `POST`   | `/api/v1/competition`     | 新規追加 | 必須:                 |
| `GET`    | `/api/v1/competition/:id` | 取得     | id のフォーマット検証 |
| `PUT`    | `/api/v1/competition/:id` | 更新     | id のフォーマット検証 |
| `DELETE` | `/api/v1/competition/:id` | 削除     | id のフォーマット検証 |

## 2. エラー処理

### 2.1 :id が見つからないとき

```json
{
  "error": {
    "code": 404,
    "message": "指定した大会が見つかりません。",
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

### 3.1 `GET` | `/api/v1/competition`

- レスポンス

```json
{
  "data": [
    {
      "_id": "68b01ca388fc89196105389b",
      "name": "Ｊ１リーグ",
      "abbr": "J1",
      "en_name": null,
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
      "competition_type": "club",
      "category": "league",
      "level": "1部",
      "age_group": "full",
      "official_match": true,
      "createdAt": "2025-08-28T09:08:51.499Z",
      "updatedAt": "2025-08-28T09:08:51.499Z",
      "__v": 0
    }
  ]
}
```

### 3.2 `POST` | `/api/v1/competition`

- リクエストボディ

```json
{
  "name": "Ｊ１リーグ",
  "abbr": "J1",
  "en_name": null,
  "country": "688b2c5fe7d7762ddaad1dfb",
  "competition_type": "club",
  "category": "league",
  "level": "1部",
  "age_group": "full",
  "official_match": true
}
```

- レスポンス

  - 成功時

  ```json
  {
    "message": "追加しました",
    "data": {
      "_id": "68b13f3576e3c43c2be03d29",
      "name": "Ｊ１リーグ",
      "abbr": "J1",
      "en_name": null,
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
      "competition_type": "club",
      "category": "league",
      "level": "1部",
      "age_group": "full",
      "official_match": true,
      "createdAt": "2025-08-29T05:48:37.454Z",
      "updatedAt": "2025-08-29T05:48:37.454Z",
      "__v": 0
    }
  }
  ```

### 3.4 `GET` | `/api/v1/competition/:id`

- レスポンス

  - 成功時

  ```json
  {
    "data": {
      "_id": "68b01ca388fc89196105389b",
      "name": "Ｊ１リーグ",
      "abbr": "J1",
      "en_name": null,
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
      "competition_type": "club",
      "category": "league",
      "level": "1部",
      "age_group": "full",
      "official_match": true,
      "createdAt": "2025-08-28T09:08:51.499Z",
      "updatedAt": "2025-08-28T09:08:51.499Z",
      "__v": 0
    }
  }
  ```

### 3.5 `PUT` | `/api/v1/competition/:id`

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
      "_id": "68b01ca388fc89196105389b",
      "name": "putted",
      "abbr": "J1",
      "en_name": null,
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
      "competition_type": "club",
      "category": "league",
      "level": "1部",
      "age_group": "full",
      "official_match": true,
      "createdAt": "2025-08-28T09:08:51.499Z",
      "updatedAt": "2025-08-29T05:47:11.261Z",
      "__v": 0
    }
  }
  ```

### 3.5 `DELETE` | `/api/v1/competition/:id`

- レスポンス

- 成功時

```json
{
  "message": "削除しました"
}
```
