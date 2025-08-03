# 代表試合シリーズ

- [代表試合シリーズ](#代表試合シリーズ)
  - [1. 概要- 代表試合シリーズ](#1-概要--代表試合シリーズ)
  - [2. エラー処理](#2-エラー処理)
    - [2.1 :id が見つからないとき](#21-id-が見つからないとき)
    - [2.2 必須フィールドなし](#22-必須フィールドなし)
  - [3. リクエスト・レスポンス例](#3-リクエストレスポンス例)
    - [3.1 `GET` | `/api/v1/country`](#31-get--apiv1country)
    - [3.2 `POST` | `/api/v1/country`](#32-post--apiv1country)
    - [3.3 `GET` | `/api/v1/country/:id`](#33-get--apiv1countryid)
    - [3.4 `PUT` | `/api/v1/country/:id`](#34-put--apiv1countryid)
    - [3.5 `DELETE` | `/api/v1/country/:id`](#35-delete--apiv1countryid)

## 1. 概要- [代表試合シリーズ](#代表試合シリーズ)

| メソッド | エンドポイント                      | 説明                     | バリデーション        | 　フロント             |
| -------- | ----------------------------------- | ------------------------ | --------------------- | ---------------------- |
| `GET`    | `/api/v1/national-match-series`     | 代表試合シリーズ一覧取得 | なし                  | /national-match-series |
| `POST`   | `/api/v1/national-match-series`     | 代表試合シリーズ新規追加 | 必須                  |
| `GET`    | `/api/v1/national-match-series/:id` | 代表試合シリーズ詳細取得 | id のフォーマット検証 |
| `PUT`    | `/api/v1/national-match-series/:id` | 代表試合シリーズ情報更新 | id のフォーマット検証 |
| `DELETE` | `/api/v1/national-match-series/:id` | 代表試合シリーズ削除     | id のフォーマット検証 |

## 2. エラー処理

### 2.1 :id が見つからないとき

```json
{
  "error": {
    "code": 404,
    "message": "指定した代表試合シリーズ情報が見つかりません。",
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
  "data": {
    "_id": "688ea475de505d913ce74ad7",
    "name": "親善試合14年11月",
    "abbr": null,
    "country": "688b2c5fe7d7762ddaad1dfb",
    "team_class": "full",
    "matchs": null,
    "joined_at": "2014-11-09T15:00:00.000Z",
    "left_at": "2014-11-17T15:00:00.000Z",
    "urls": [],
    "createdAt": "2025-08-02T23:51:17.870Z",
    "updatedAt": "2025-08-02T23:51:17.870Z",
    "__v": 0
  }
}
```

### 3.2 `POST` | `/api/v1/country`

- リクエストボディ

```json
{
  "name": "親善試合14年11月",
  "abbr": null,
  "country": "688b2c5fe7d7762ddaad1dfb",
  "team_class": "full",
  "matchs": null,
  "joined_at": "2014-11-09T15:00:00.000Z",
  "left_at": "2014-11-17T15:00:00.000Z",
  "urls": []
}
```

- レスポンス

  - 成功時

    ```json
    {
      "message": "追加しました",
      "data": {
        "name": "親善試合 14 年 11 月",
        "abbr": null,
        "country": "688b2c5fe7d7762ddaad1dfb",
        "team_class": "full",
        "matchs": null,
        "joined_at": "2014-11-09T15:00:00.000Z",
        "left_at": "2014-11-17T15:00:00.000Z",
        "urls": [],
        "_id": "688ea475de505d913ce74ad7",
        "createdAt": "2025-08-02T23:51:17.870Z",
        "updatedAt": "2025-08-02T23:51:17.870Z",
        "__v": 0
      }
    }
    ```

### 3.3 `GET` | `/api/v1/country/:id`

- レスポンス

- 成功時

```json
{
  "data": {
    "_id": "688ea1a826c9a7f800b7f6ad",
    "name": "親善試合14年10月",
    "abbr": null,
    "country": "688b2c5fe7d7762ddaad1dfb",
    "team_class": "full",
    "matchs": null,
    "joined_at": "2014-10-05T15:00:00.000Z",
    "left_at": "2014-10-13T15:00:00.000Z",
    "urls": [],
    "__v": 0
  }
}
```

### 3.4 `PUT` | `/api/v1/country/:id`

- リクエストボディ

```json
{
  "name": "親善試合14年11月updated"
}
```

- レスポンス

  - 成功時

  ```json
  {
    "message": "編集しました",
    "data": {
      "_id": "688ea1a826c9a7f800b7f6ac",
      "name": "親善試合14年11月updated",
      "abbr": null,
      "country": "688b2c5fe7d7762ddaad1dfb",
      "team_class": "full",
      "matchs": null,
      "joined_at": "2014-11-09T15:00:00.000Z",
      "left_at": "2014-11-17T15:00:00.000Z",
      "urls": [],
      "__v": 0,
      "updatedAt": "2025-08-02T23:46:59.806Z"
    }
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
