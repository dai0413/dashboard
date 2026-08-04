# 国

- [国](#国)
  - [1. 概要- 国](#1-概要--国)
  - [2. エラー処理](#2-エラー処理)
    - [2.1 :id が見つからないとき](#21-id-が見つからないとき)
    - [2.2 必須フィールドなし](#22-必須フィールドなし)
  - [3. リクエスト・レスポンス例](#3-リクエストレスポンス例)
    - [3.1 `GET` | `/api/v1/country`](#31-get--apiv1country)
    - [3.2 `POST` | `/api/v1/country`](#32-post--apiv1country)
    - [3.3 `GET` | `/api/v1/country/:id`](#33-get--apiv1countryid)
    - [3.4 `PUT` | `/api/v1/country/:id`](#34-put--apiv1countryid)
    - [3.5 `DELETE` | `/api/v1/country/:id`](#35-delete--apiv1countryid)

## 1. 概要- [国](#国)

| メソッド | エンドポイント        | 説明       | バリデーション        | 　フロント |
| -------- | --------------------- | ---------- | --------------------- | ---------- |
| `GET`    | `/api/v1/country`     | 国一覧取得 | なし                  | /country   |
| `POST`   | `/api/v1/country`     | 国新規追加 | 必須                  |
| `GET`    | `/api/v1/country/:id` | 国詳細取得 | id のフォーマット検証 |
| `PUT`    | `/api/v1/country/:id` | 国情報更新 | id のフォーマット検証 |
| `DELETE` | `/api/v1/country/:id` | 国削除     | id のフォーマット検証 |

## 2. エラー処理

### 2.1 :id が見つからないとき

```json
{
  "error": {
    "code": 404,
    "message": "指定した国情報が見つかりません。",
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

### 3.1 `GET` | `/api/v1/country`

- レスポンス

```json
{
  "data": [
    {
      "_id": "688b2c5fe7d7762ddaad1d8c",
      "name": "アフガニスタン",
      "en_name": "Afghanistan",
      "iso3": "AFG",
      "fifa_code": "AFG",
      "area": "アジア",
      "district": "中央アジア",
      "confederation": "AFC",
      "sub_confederation": "CAFA",
      "established_year": 1933,
      "fifa_member_year": null,
      "association_member_year": 1954,
      "district_member_year": null,
      "__v": 0,
      "createdAt": "2025-07-31T08:42:07.974Z",
      "updatedAt": "2025-07-31T08:42:07.974Z"
    }
  ]
}
```

### 3.2 `POST` | `/api/v1/country`

- リクエストボディ

```json
        {
            "name": "アフガニスタン",
            "en_name": "Afghanistan",
            "iso3": "AFG",
            "fifa_code": "AFG",
            "area": "アジア",
            "district": "中央アジア",
            "confederation": "AFC",
            "sub_confederation": "CAFA",
            "established_year": 1933,
            "fifa_member_year": null,
            "association_member_year": 1954,
            "district_member_year": null,
            "__v": 0,
            "createdAt": "2025-07-31T08:42:07.974Z",
            "updatedAt": "2025-07-31T08:42:07.974Z"
        },
```

- レスポンス

  - 成功時

    ```json
    {
      "message": "追加しました",
      "data": {
        "_id": "688b2c5fe7d7762ddaad1d8c",
        "name": "アフガニスタン",
        "en_name": "Afghanistan",
        "iso3": "AFG",
        "fifa_code": "AFG",
        "area": "アジア",
        "district": "中央アジア",
        "confederation": "AFC",
        "sub_confederation": "CAFA",
        "established_year": 1933,
        "fifa_member_year": null,
        "association_member_year": 1954,
        "district_member_year": null,
        "__v": 0,
        "createdAt": "2025-07-31T08:42:07.974Z",
        "updatedAt": "2025-07-31T08:42:07.974Z"
      }
    }
    ```

### 3.3 `GET` | `/api/v1/country/:id`

- レスポンス

- 成功時

```json
{
  "data": {
    "_id": "688b2c5fe7d7762ddaad1d8c",
    "name": "アフガニスタン",
    "en_name": "Afghanistan",
    "iso3": "AFG",
    "fifa_code": "AFG",
    "area": "アジア",
    "district": "中央アジア",
    "confederation": "AFC",
    "sub_confederation": "CAFA",
    "established_year": 1933,
    "fifa_member_year": null,
    "association_member_year": 1954,
    "district_member_year": null,
    "__v": 0,
    "createdAt": "2025-07-31T08:42:07.974Z",
    "updatedAt": "2025-07-31T08:42:07.974Z"
  }
}
```

### 3.4 `PUT` | `/api/v1/country/:id`

- リクエストボディ

```json
{
  "country": "new"
}
```

- レスポンス

  - 成功時

  ```json
    "message": "編集しました",
    "data": {
        "_id": "688b2c5fe7d7762ddaad1d8c",
        "name": "new",
        "en_name": "Afghanistan",
        "iso3": "AFG",
        "fifa_code": "AFG",
        "area": "アジア",
        "district": "中央アジア",
        "confederation": "AFC",
        "sub_confederation": "CAFA",
        "established_year": 1933,
        "fifa_member_year": null,
        "association_member_year": 1954,
        "district_member_year": null,
        "__v": 0,
        "createdAt": "2025-07-31T08:42:07.974Z",
        "updatedAt": "2025-07-31T09:05:16.875Z"
    }
  ```

### 3.5 `DELETE` | `/api/v1/country/:id`

- レスポンス

- 成功時

```json
{
  "message": "削除しました"
}
```
