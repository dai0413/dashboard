# 代表招集リスト

- [代表招集リスト](#代表招集リスト)
  - [1. 概要- 代表招集リスト](#1-概要--代表招集リスト)
  - [2. エラー処理](#2-エラー処理)
    - [2.1 :id が見つからないとき](#21-id-が見つからないとき)
    - [2.2 必須フィールドなし](#22-必須フィールドなし)
  - [3. リクエスト・レスポンス例](#3-リクエストレスポンス例)
    - [3.1 `GET` | `/api/v1/national-callup`](#31-get--apiv1national-callup)
    - [3.2 `POST` | `/api/v1/national-callup`](#32-post--apiv1national-callup)
    - [3.3 `GET` | `/api/v1/national-callup/:id`](#33-get--apiv1national-callupid)
    - [3.4 `PUT` | `/api/v1/national-callup/:id`](#34-put--apiv1national-callupid)
    - [3.5 `DELETE` | `/api/v1/national-callup/:id`](#35-delete--apiv1national-callupid)

## 1. 概要- [代表招集リスト](#代表招集リスト)

| メソッド | エンドポイント                | 説明                   | バリデーション        | 　フロント       |
| -------- | ----------------------------- | ---------------------- | --------------------- | ---------------- |
| `GET`    | `/api/v1/national-callup`     | 代表招集リスト一覧取得 | なし                  | /national-callup |
| `POST`   | `/api/v1/national-callup`     | 代表招集リスト新規追加 | 必須                  |
| `GET`    | `/api/v1/national-callup/:id` | 代表招集リスト詳細取得 | id のフォーマット検証 |
| `PUT`    | `/api/v1/national-callup/:id` | 代表招集リスト情報更新 | id のフォーマット検証 |
| `DELETE` | `/api/v1/national-callup/:id` | 代表招集リスト削除     | id のフォーマット検証 |

## 2. エラー処理

### 2.1 :id が見つからないとき

```json
{
  "error": {
    "code": 404,
    "message": "指定した代表招集リスト情報が見つかりません。",
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

### 3.1 `GET` | `/api/v1/national-callup`

- レスポンス

```json
{
  "data": {
    "_id": "6895977afd1cbd54022d590d",
    "series": {
      "_id": "688ea1a826c9a7f800b7f716",
      "name": "U23アジアカップ2022",
      "abbr": null,
      "country": "688b2c5fe7d7762ddaad1dfb",
      "team_class": "u21",
      "matchs": null,
      "joined_at": "2022-05-28T15:00:00.000Z",
      "left_at": "2022-06-17T15:00:00.000Z",
      "urls": [],
      "__v": 0
    },
    "player": {
      "_id": "68516bd288294f93ffd0d3ae",
      "name": "張　奥林",
      "en_name": "Aolin ZHANG",
      "dob": "2005-04-24T15:00:00.000Z",
      "pob": "大阪府",
      "__v": 0
    },
    "team": {
      "_id": "685fe9e1bdafffc53f4719f9",
      "team": "尚志高校",
      "abbr": "尚志高",
      "enTeam": "",
      "country": "日本",
      "genre": "high_school",
      "jdataid": null,
      "labalph": "",
      "transferurl": "https://www.transfermarkt.jp/shoshi-high-school/startseite/verein/78048",
      "sofaurl": ""
    },
    "team_name": null,
    "joined_at": "2022-05-28T15:00:00.000Z",
    "left_at": "2022-06-17T15:00:00.000Z",
    "number": 22,
    "position": "DF",
    "is_captain": false,
    "is_overage": false,
    "is_backup": false,
    "is_training_partner": false,
    "is_additional_call": false,
    "status": "joined",
    "left_reason": null,
    "__v": 0,
    "createdAt": "2025-08-08T06:21:46.916Z",
    "updatedAt": "2025-08-08T06:21:46.916Z"
  }
}
```

### 3.2 `POST` | `/api/v1/national-callup`

- リクエストボディ

```json
{
  "series": "688ea1a826c9a7f800b7f716",
  "player": "68516bd288294f93ffd0d3ae",
  "team": "685fe9e1bdafffc53f4719f9",
  "team_name": null,
  // "joined_at": "2022-05-28T15:00:00.000Z",
  // "left_at": "2022-06-17T15:00:00.000Z",
  "number": 22,
  "position": "DF",
  // "is_captain": false,
  // "is_overage": false,
  // "is_backup": false,
  // "is_training_partner": false,
  // "is_additional_call": false,
  "status": "joined",
  "left_reason": null
}
```

- レスポンス

  - 成功時

    ```json
    {
      "message": "追加しました",
      "data": {
        "_id": "6895a475c1d46821b14f50fe",
        "series": {
          "_id": "688ea1a826c9a7f800b7f716",
          "name": "U23アジアカップ2022",
          "abbr": null,
          "country": "688b2c5fe7d7762ddaad1dfb",
          "team_class": "u21",
          "matchs": null,
          "joined_at": "2022-05-28T15:00:00.000Z",
          "left_at": "2022-06-17T15:00:00.000Z",
          "urls": [],
          "__v": 0
        },
        "player": {
          "_id": "68516bd288294f93ffd0d3ae",
          "name": "張　奥林",
          "en_name": "Aolin ZHANG",
          "dob": "2005-04-24T15:00:00.000Z",
          "pob": "大阪府",
          "__v": 0
        },
        "team": {
          "_id": "685fe9e1bdafffc53f4719f9",
          "team": "尚志高校",
          "abbr": "尚志高",
          "enTeam": "",
          "country": "日本",
          "genre": "high_school",
          "jdataid": null,
          "labalph": "",
          "transferurl": "https://www.transfermarkt.jp/shoshi-high-school/startseite/verein/78048",
          "sofaurl": ""
        },
        "team_name": null,
        "number": 22,
        "position": "DF",
        "is_captain": false,
        "is_overage": false,
        "is_backup": false,
        "is_training_partner": false,
        "is_additional_call": false,
        "status": "joined",
        "left_reason": null,
        "createdAt": "2025-08-08T07:17:09.677Z",
        "updatedAt": "2025-08-08T07:17:09.677Z",
        "joined_at": "2022-05-28T15:00:00.000Z",
        "left_at": "2022-06-17T15:00:00.000Z",
        "__v": 0
      }
    }
    ```

### 3.3 `GET` | `/api/v1/national-callup/:id`

- レスポンス

- 成功時

```json
{
  "data": {
    "_id": "6895977afd1cbd54022d590d",
    "series": {
      "_id": "688ea1a826c9a7f800b7f716",
      "name": "U23アジアカップ2022",
      "abbr": null,
      "country": "688b2c5fe7d7762ddaad1dfb",
      "team_class": "u21",
      "matchs": null,
      "joined_at": "2022-05-28T15:00:00.000Z",
      "left_at": "2022-06-17T15:00:00.000Z",
      "urls": [],
      "__v": 0
    },
    "player": {
      "_id": "68516bd288294f93ffd0d3ae",
      "name": "張　奥林",
      "en_name": "Aolin ZHANG",
      "dob": "2005-04-24T15:00:00.000Z",
      "pob": "大阪府",
      "__v": 0
    },
    "team": {
      "_id": "685fe9e1bdafffc53f4719f9",
      "team": "尚志高校",
      "abbr": "尚志高",
      "enTeam": "",
      "country": "日本",
      "genre": "high_school",
      "jdataid": null,
      "labalph": "",
      "transferurl": "https://www.transfermarkt.jp/shoshi-high-school/startseite/verein/78048",
      "sofaurl": ""
    },
    "team_name": null,
    "joined_at": "2022-05-28T15:00:00.000Z",
    "left_at": "2022-06-17T15:00:00.000Z",
    "number": 22,
    "position": "DF",
    "is_captain": false,
    "is_overage": false,
    "is_backup": false,
    "is_training_partner": false,
    "is_additional_call": false,
    "status": "joined",
    "left_reason": null,
    "__v": 0,
    "createdAt": "2025-08-08T06:21:46.916Z",
    "updatedAt": "2025-08-08T06:21:46.916Z"
  }
}
```

### 3.4 `PUT` | `/api/v1/national-callup/:id`

- リクエストボディ

```json
{
  "position": null
}
```

- レスポンス

  - 成功時

  ```json
  {
    "message": "編集しました",
    "data": {
      "_id": "6895977afd1cbd54022d590d",
      "series": {
        "_id": "688ea1a826c9a7f800b7f716",
        "name": "U23アジアカップ2022",
        "abbr": null,
        "country": "688b2c5fe7d7762ddaad1dfb",
        "team_class": "u21",
        "matchs": null,
        "joined_at": "2022-05-28T15:00:00.000Z",
        "left_at": "2022-06-17T15:00:00.000Z",
        "urls": [],
        "__v": 0
      },
      "player": {
        "_id": "68516bd288294f93ffd0d3ae",
        "name": "張　奥林",
        "en_name": "Aolin ZHANG",
        "dob": "2005-04-24T15:00:00.000Z",
        "pob": "大阪府",
        "__v": 0
      },
      "team": {
        "_id": "685fe9e1bdafffc53f4719f9",
        "team": "尚志高校",
        "abbr": "尚志高",
        "enTeam": "",
        "country": "日本",
        "genre": "high_school",
        "jdataid": null,
        "labalph": "",
        "transferurl": "https://www.transfermarkt.jp/shoshi-high-school/startseite/verein/78048",
        "sofaurl": ""
      },
      "team_name": null,
      "joined_at": "2022-05-28T15:00:00.000Z",
      "left_at": "2022-06-17T15:00:00.000Z",
      "number": 22,
      "position": null,
      "is_captain": false,
      "is_overage": false,
      "is_backup": false,
      "is_training_partner": false,
      "is_additional_call": false,
      "status": "joined",
      "left_reason": null,
      "__v": 0,
      "createdAt": "2025-08-08T06:21:46.916Z",
      "updatedAt": "2025-08-08T07:08:27.820Z"
    }
  }
  ```

### 3.5 `DELETE` | `/api/v1/national-callup/:id`

- レスポンス

- 成功時

```json
{
  "message": "削除しました"
}
```
