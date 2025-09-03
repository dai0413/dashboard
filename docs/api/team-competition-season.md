# チームの大会参加記録

- [チームの大会参加記録](#チームの大会参加記録)
  - [1. 概要](#1-概要)
  - [2. エラー処理](#2-エラー処理)
    - [2.1 :id が見つからないとき](#21-id-が見つからないとき)
    - [2.2 必須フィールドなし](#22-必須フィールドなし)
  - [3. リクエスト・レスポンス例](#3-リクエストレスポンス例)
    - [3.1 `GET` | `/api/v1/team-competition-season`](#31-get--apiv1team-competition-season)
    - [3.2 `POST` | `/api/v1/team-competition-season`](#32-post--apiv1team-competition-season)
    - [3.4 `GET` | `/api/v1/team-competition-season/:id`](#34-get--apiv1team-competition-seasonid)
    - [3.5 `PUT` | `/api/v1/team-competition-season/:id`](#35-put--apiv1team-competition-seasonid)
    - [3.5 `DELETE` | `/api/v1/team-competition-season/:id`](#35-delete--apiv1team-competition-seasonid)

## 1. 概要

| メソッド | エンドポイント                        | 説明     | バリデーション        | フロント                 |
| -------- | ------------------------------------- | -------- | --------------------- | ------------------------ |
| `GET`    | `/api/v1/team-competition-season`     | 一覧取得 | なし                  | /team-competition-season |
| `POST`   | `/api/v1/team-competition-season`     | 新規追加 | 必須:                 |
| `GET`    | `/api/v1/team-competition-season/:id` | 取得     | id のフォーマット検証 |
| `PUT`    | `/api/v1/team-competition-season/:id` | 更新     | id のフォーマット検証 |
| `DELETE` | `/api/v1/team-competition-season/:id` | 削除     | id のフォーマット検証 |

## 2. エラー処理

### 2.1 :id が見つからないとき

```json
{
  "error": {
    "code": 404,
    "message": "指定したチームの大会参加記録が見つかりません。",
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

### 3.1 `GET` | `/api/v1/team-competition-season`

- レスポンス

```json
{
  "data": [
    {
      "_id": "68b6a1951e571fc2b4016c93",
      "team": {
        "_id": "685fe9e1bdafffc53f471928",
        "team": "浦和レッドダイヤモンズ",
        "abbr": "浦和",
        "enTeam": "Urawa Reds",
        "country": "688b2c5fe7d7762ddaad1dfb",
        "genre": "club",
        "jdataid": 3,
        "labalph": "/uraw/",
        "transferurl": "https://www.transfermarkt.jp/urawa-red-diamonds/startseite/verein/828",
        "sofaurl": ""
      },
      "season": {
        "_id": "68b54342990b9673bf8a99c4",
        "competition": "68b16aa806098678a4f4af3e",
        "name": "2025",
        "start_date": "2025-01-31T15:00:00.000Z",
        "end_date": "2026-01-30T15:00:00.000Z",
        "current": true,
        "__v": 0,
        "createdAt": "2025-09-01T06:54:58.274Z",
        "updatedAt": "2025-09-01T06:54:58.274Z"
      },
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
      "createdAt": "2025-09-02T07:49:41.372Z",
      "updatedAt": "2025-09-02T07:49:41.372Z",
      "__v": 0
    }
  ]
}
```

### 3.2 `POST` | `/api/v1/team-competition-season`

- リクエストボディ

```json
{
  "team": "685fe9e1bdafffc53f471928",
  "season": "68b54342990b9673bf8a99c4"
}
```

- レスポンス

  - 成功時

  ```json
  {
    "message": "追加しました",
    "data": {
      "_id": "68b6a1951e571fc2b4016c93",
      "team": {
        "_id": "685fe9e1bdafffc53f471928",
        "team": "浦和レッドダイヤモンズ",
        "abbr": "浦和",
        "enTeam": "Urawa Reds",
        "country": "688b2c5fe7d7762ddaad1dfb",
        "genre": "club",
        "jdataid": 3,
        "labalph": "/uraw/",
        "transferurl": "https://www.transfermarkt.jp/urawa-red-diamonds/startseite/verein/828",
        "sofaurl": ""
      },
      "season": {
        "_id": "68b54342990b9673bf8a99c4",
        "competition": "68b16aa806098678a4f4af3e",
        "name": "2025",
        "start_date": "2025-01-31T15:00:00.000Z",
        "end_date": "2026-01-30T15:00:00.000Z",
        "current": true,
        "__v": 0,
        "createdAt": "2025-09-01T06:54:58.274Z",
        "updatedAt": "2025-09-01T06:54:58.274Z"
      },
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
      "createdAt": "2025-09-02T07:49:41.372Z",
      "updatedAt": "2025-09-02T07:49:41.372Z",
      "__v": 0
    }
  }
  ```

### 3.4 `GET` | `/api/v1/team-competition-season/:id`

- レスポンス

  - 成功時

  ```json
  {
    "data": {
      "_id": "68b6a1951e571fc2b4016c93",
      "team": {
        "_id": "685fe9e1bdafffc53f471928",
        "team": "浦和レッドダイヤモンズ",
        "abbr": "浦和",
        "enTeam": "Urawa Reds",
        "country": "688b2c5fe7d7762ddaad1dfb",
        "genre": "club",
        "jdataid": 3,
        "labalph": "/uraw/",
        "transferurl": "https://www.transfermarkt.jp/urawa-red-diamonds/startseite/verein/828",
        "sofaurl": ""
      },
      "season": {
        "_id": "68b54342990b9673bf8a99c4",
        "competition": "68b16aa806098678a4f4af3e",
        "name": "2025",
        "start_date": "2025-01-31T15:00:00.000Z",
        "end_date": "2026-01-30T15:00:00.000Z",
        "current": true,
        "__v": 0,
        "createdAt": "2025-09-01T06:54:58.274Z",
        "updatedAt": "2025-09-01T06:54:58.274Z"
      },
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
      "createdAt": "2025-09-02T07:49:41.372Z",
      "updatedAt": "2025-09-02T07:49:41.372Z",
      "__v": 0
    }
  }
  ```

### 3.5 `PUT` | `/api/v1/team-competition-season/:id`

- リクエストボディ

```json
{
  "team": "685fe9e1bdafffc53f47192a"
}
```

- レスポンス

  - 成功時

  ```json
  {
    "message": "編集しました",
    "data": {
      "_id": "68b6a1951e571fc2b4016c93",
      "team": {
        "_id": "685fe9e1bdafffc53f47192a",
        "team": "横浜F・マリノス",
        "abbr": "横浜FM",
        "enTeam": "Yokohama F･Marinos",
        "country": "688b2c5fe7d7762ddaad1dfb",
        "genre": "club",
        "jdataid": 5,
        "labalph": "/y-fm/",
        "transferurl": "https://www.transfermarkt.jp/yokohama-f-marinos/startseite/verein/3828",
        "sofaurl": ""
      },
      "season": {
        "_id": "68b54342990b9673bf8a99c4",
        "competition": "68b16aa806098678a4f4af3e",
        "name": "2025",
        "start_date": "2025-01-31T15:00:00.000Z",
        "end_date": "2026-01-30T15:00:00.000Z",
        "current": true,
        "__v": 0,
        "createdAt": "2025-09-01T06:54:58.274Z",
        "updatedAt": "2025-09-01T06:54:58.274Z"
      },
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
      "createdAt": "2025-09-02T07:49:41.372Z",
      "updatedAt": "2025-09-02T07:54:15.686Z",
      "__v": 0
    }
  }
  ```

### 3.5 `DELETE` | `/api/v1/team-competition-season/:id`

- レスポンス

- 成功時

```json
{
  "message": "削除しました"
}
```
