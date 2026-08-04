# 試合

- [試合](#試合)
  - [1. 概要](#1-概要)
  - [2. エラー処理](#2-エラー処理)
    - [2.1 :id が見つからないとき](#21-id-が見つからないとき)
    - [2.2 必須フィールドなし](#22-必須フィールドなし)
  - [3. リクエスト・レスポンス例](#3-リクエストレスポンス例)
    - [3.1 `GET` | `/api/v1/match`](#31-get--apiv1match)
    - [3.2 `POST` | `/api/v1/match`](#32-post--apiv1match)
    - [3.4 `GET` | `/api/v1/match/:id`](#34-get--apiv1matchid)
    - [3.5 `PUT` | `/api/v1/match/:id`](#35-put--apiv1matchid)
    - [3.5 `DELETE` | `/api/v1/match/:id`](#35-delete--apiv1matchid)

## 1. 概要

| メソッド | エンドポイント      | 説明     | バリデーション        | フロント |
| -------- | ------------------- | -------- | --------------------- | -------- |
| `GET`    | `/api/v1/match`     | 一覧取得 | なし                  | /match   |
| `POST`   | `/api/v1/match`     | 新規追加 | 必須:                 |
| `GET`    | `/api/v1/match/:id` | 取得     | id のフォーマット検証 |
| `PUT`    | `/api/v1/match/:id` | 更新     | id のフォーマット検証 |
| `DELETE` | `/api/v1/match/:id` | 削除     | id のフォーマット検証 |

## 2. エラー処理

### 2.1 :id が見つからないとき

```json
{
  "error": {
    "code": 404,
    "message": "指定した試合が見つかりません。",
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

### 3.1 `GET` | `/api/v1/match`

- レスポンス

```json
{
  "data": [
    {
      "_id": "68cd1da31121c8f69ce0f0ed",
      "competition_stage": {
        "_id": "68c0e28d3bf5cb103be963a6",
        "season": "68b7b227b3716945451a52c5",
        "stage_type": "none",
        "competition": "68b16aa806098678a4f4af3e",
        "createdAt": "2025-09-10T02:29:33.894Z",
        "updatedAt": "2025-09-10T02:29:33.894Z",
        "__v": 0
      },
      "home_team": {
        "_id": "685fe9e1bdafffc53f471928",
        "team": "浦和レッドダイヤモンズ",
        "abbr": "浦和",
        "enTeam": "Urawa Reds",
        "country": "688b2c5fe7d7762ddaad1dfb",
        "genre": "club",
        "jdataid": 3,
        "labalph": "/uraw/",
        "transferurl": "https://www.transfermarkt.jp/urawa-red-diamonds/startseite/verein/828",
        "sofaurl": "",
        "age_group": "full",
        "division": "1st"
      },
      "away_team": {
        "_id": "685fe9e1bdafffc53f471929",
        "team": "FC町田ゼルビア",
        "abbr": "町田",
        "enTeam": "FC Machida Zelvia",
        "country": "688b2c5fe7d7762ddaad1dfb",
        "genre": "club",
        "jdataid": 45,
        "labalph": "/mcd/",
        "transferurl": "https://www.transfermarkt.jp/machida-zelvia/startseite/verein/23568",
        "sofaurl": "",
        "age_group": "full",
        "division": "1st"
      },
      "match_format": {
        "_id": "68c90fc6179253217c838994",
        "name": "90",
        "period": [
          {
            "period_label": "1H",
            "start": 0,
            "end": 45,
            "order": 1
          },
          {
            "period_label": "2H",
            "start": 45,
            "end": 90,
            "order": 2
          }
        ],
        "createdAt": "2025-09-16T07:20:38.763Z",
        "updatedAt": "2025-09-16T07:20:38.763Z",
        "__v": 0
      },
      "stadium": {
        "_id": "68bf8fcb700ec3a9cc9cfae4",
        "name": "済南オリンピック・スポーツセンター",
        "abbr": "",
        "en_name": "",
        "alt_names": [
          "済南奥林匹克体育中心,済南オリンピック・スポーツセンター・スタジアム"
        ],
        "alt_abbrs": [],
        "alt_en_names": [],
        "country": "688b2c5fe7d7762ddaad1db8",
        "__v": 0,
        "createdAt": "2025-09-09T02:24:11.130Z",
        "updatedAt": "2025-09-09T02:24:11.130Z"
      },
      "date": "2025-08-08T00:00:00.000Z",
      "audience": 100000,
      "home_goal": 0,
      "away_goal": 1,
      "home_pk_goal": 0,
      "away_pk_goal": 1,
      "match_week": 20000,
      "urls": [],
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
      "season": {
        "_id": "68b7b227b3716945451a52c5",
        "competition": "68b16aa806098678a4f4af3e",
        "name": "1993",
        "start_date": "1993-01-31T15:00:00.000Z",
        "end_date": "1994-01-30T15:00:00.000Z",
        "current": false,
        "__v": 0,
        "createdAt": "2025-09-03T03:12:39.701Z",
        "updatedAt": "2025-09-03T03:12:39.701Z"
      },
      "play_time": 90,
      "result": "away",
      "createdAt": "2025-09-19T09:08:51.358Z",
      "updatedAt": "2025-09-19T09:08:51.358Z",
      "__v": 0
    }
  ]
}
```

### 3.2 `POST` | `/api/v1/match`

- リクエストボディ

```json
{
  "competition_stage": "68c0e28d3bf5cb103be963a6",
  "home_team": "685fe9e1bdafffc53f471928",
  "away_team": "685fe9e1bdafffc53f471929",
  "match_format": "68c90fc6179253217c838994",
  "stadium": "68bf8fcb700ec3a9cc9cfae4",
  "date": "2025-08-08T00:00:00.000Z",
  "audience": 100000,
  "home_goal": 0,
  "away_goal": 1,
  "home_pk_goal": 0,
  "away_pk_goal": 1,
  "match_week": 20000
}
```

- レスポンス

  - 成功時

  ```json
  {
    "message": "追加しました",
    "data": {
      "_id": "68cd1da31121c8f69ce0f0ed",
      "competition_stage": {
        "_id": "68c0e28d3bf5cb103be963a6",
        "season": "68b7b227b3716945451a52c5",
        "stage_type": "none",
        "competition": "68b16aa806098678a4f4af3e",
        "createdAt": "2025-09-10T02:29:33.894Z",
        "updatedAt": "2025-09-10T02:29:33.894Z",
        "__v": 0
      },
      "home_team": {
        "_id": "685fe9e1bdafffc53f471928",
        "team": "浦和レッドダイヤモンズ",
        "abbr": "浦和",
        "enTeam": "Urawa Reds",
        "country": "688b2c5fe7d7762ddaad1dfb",
        "genre": "club",
        "jdataid": 3,
        "labalph": "/uraw/",
        "transferurl": "https://www.transfermarkt.jp/urawa-red-diamonds/startseite/verein/828",
        "sofaurl": "",
        "age_group": "full",
        "division": "1st"
      },
      "away_team": {
        "_id": "685fe9e1bdafffc53f471929",
        "team": "FC町田ゼルビア",
        "abbr": "町田",
        "enTeam": "FC Machida Zelvia",
        "country": "688b2c5fe7d7762ddaad1dfb",
        "genre": "club",
        "jdataid": 45,
        "labalph": "/mcd/",
        "transferurl": "https://www.transfermarkt.jp/machida-zelvia/startseite/verein/23568",
        "sofaurl": "",
        "age_group": "full",
        "division": "1st"
      },
      "match_format": {
        "_id": "68c90fc6179253217c838994",
        "name": "90",
        "period": [
          {
            "period_label": "1H",
            "start": 0,
            "end": 45,
            "order": 1
          },
          {
            "period_label": "2H",
            "start": 45,
            "end": 90,
            "order": 2
          }
        ],
        "createdAt": "2025-09-16T07:20:38.763Z",
        "updatedAt": "2025-09-16T07:20:38.763Z",
        "__v": 0
      },
      "stadium": {
        "_id": "68bf8fcb700ec3a9cc9cfae4",
        "name": "済南オリンピック・スポーツセンター",
        "abbr": "",
        "en_name": "",
        "alt_names": [
          "済南奥林匹克体育中心,済南オリンピック・スポーツセンター・スタジアム"
        ],
        "alt_abbrs": [],
        "alt_en_names": [],
        "country": "688b2c5fe7d7762ddaad1db8",
        "__v": 0,
        "createdAt": "2025-09-09T02:24:11.130Z",
        "updatedAt": "2025-09-09T02:24:11.130Z"
      },
      "date": "2025-08-08T00:00:00.000Z",
      "audience": 100000,
      "home_goal": 0,
      "away_goal": 1,
      "home_pk_goal": 0,
      "away_pk_goal": 1,
      "match_week": 20000,
      "urls": [],
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
      "season": {
        "_id": "68b7b227b3716945451a52c5",
        "competition": "68b16aa806098678a4f4af3e",
        "name": "1993",
        "start_date": "1993-01-31T15:00:00.000Z",
        "end_date": "1994-01-30T15:00:00.000Z",
        "current": false,
        "__v": 0,
        "createdAt": "2025-09-03T03:12:39.701Z",
        "updatedAt": "2025-09-03T03:12:39.701Z"
      },
      "play_time": 90,
      "result": "away",
      "createdAt": "2025-09-19T09:08:51.358Z",
      "updatedAt": "2025-09-19T09:08:51.358Z",
      "__v": 0
    }
  }
  ```

### 3.4 `GET` | `/api/v1/match/:id`

- レスポンス

  - 成功時

  ```json
  {
    "data": {
      "_id": "68cde85bc64e2dbfbc8f4301",
      "competition_stage": {
        "_id": "68c0e28d3bf5cb103be963a6",
        "season": "68b7b227b3716945451a52c5",
        "stage_type": "none",
        "competition": "68b16aa806098678a4f4af3e",
        "createdAt": "2025-09-10T02:29:33.894Z",
        "updatedAt": "2025-09-10T02:29:33.894Z",
        "__v": 0
      },
      "home_team": {
        "_id": "685fe9e1bdafffc53f471928",
        "team": "浦和レッドダイヤモンズ",
        "abbr": "浦和",
        "enTeam": "Urawa Reds",
        "country": "688b2c5fe7d7762ddaad1dfb",
        "genre": "club",
        "jdataid": 3,
        "labalph": "/uraw/",
        "transferurl": "https://www.transfermarkt.jp/urawa-red-diamonds/startseite/verein/828",
        "sofaurl": "",
        "age_group": "full",
        "division": "1st"
      },
      "away_team": {
        "_id": "685fe9e1bdafffc53f471929",
        "team": "FC町田ゼルビア",
        "abbr": "町田",
        "enTeam": "FC Machida Zelvia",
        "country": "688b2c5fe7d7762ddaad1dfb",
        "genre": "club",
        "jdataid": 45,
        "labalph": "/mcd/",
        "transferurl": "https://www.transfermarkt.jp/machida-zelvia/startseite/verein/23568",
        "sofaurl": "",
        "age_group": "full",
        "division": "1st"
      },
      "match_format": {
        "_id": "68c90fc6179253217c838994",
        "name": "90",
        "period": [
          {
            "period_label": "1H",
            "start": 0,
            "end": 45,
            "order": 1
          },
          {
            "period_label": "2H",
            "start": 45,
            "end": 90,
            "order": 2
          }
        ],
        "createdAt": "2025-09-16T07:20:38.763Z",
        "updatedAt": "2025-09-16T07:20:38.763Z",
        "__v": 0
      },
      "stadium": {
        "_id": "68bf8fcb700ec3a9cc9cfae5",
        "name": "昌原サッカーセンター",
        "abbr": "",
        "en_name": "",
        "alt_names": [],
        "alt_abbrs": [],
        "alt_en_names": [],
        "country": "688b2c5fe7d7762ddaad1e5d",
        "__v": 0,
        "createdAt": "2025-09-09T02:24:11.132Z",
        "updatedAt": "2025-09-09T02:24:11.132Z"
      },
      "date": "2025-09-20T00:00:00.000Z",
      "audience": 1000,
      "home_goal": 1,
      "away_goal": 0,
      "match_week": 1,
      "urls": [],
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
      "season": {
        "_id": "68b7b227b3716945451a52c5",
        "competition": "68b16aa806098678a4f4af3e",
        "name": "1993",
        "start_date": "1993-01-31T15:00:00.000Z",
        "end_date": "1994-01-30T15:00:00.000Z",
        "current": false,
        "__v": 0,
        "createdAt": "2025-09-03T03:12:39.701Z",
        "updatedAt": "2025-09-03T03:12:39.701Z"
      },
      "play_time": 90,
      "result": "home",
      "createdAt": "2025-09-19T23:33:47.158Z",
      "updatedAt": "2025-09-19T23:33:47.158Z",
      "__v": 0
    }
  }
  ```

### 3.5 `PUT` | `/api/v1/match/:id`

- リクエストボディ

```json
{
  "audience": 0
}
```

- レスポンス

  - 成功時

  ```json
  {
    "message": "編集しました",
    "data": {
      "_id": "68cde85bc64e2dbfbc8f4301",
      "competition_stage": {
        "_id": "68c0e28d3bf5cb103be963a6",
        "season": "68b7b227b3716945451a52c5",
        "stage_type": "none",
        "competition": "68b16aa806098678a4f4af3e",
        "createdAt": "2025-09-10T02:29:33.894Z",
        "updatedAt": "2025-09-10T02:29:33.894Z",
        "__v": 0
      },
      "home_team": {
        "_id": "685fe9e1bdafffc53f471928",
        "team": "浦和レッドダイヤモンズ",
        "abbr": "浦和",
        "enTeam": "Urawa Reds",
        "country": "688b2c5fe7d7762ddaad1dfb",
        "genre": "club",
        "jdataid": 3,
        "labalph": "/uraw/",
        "transferurl": "https://www.transfermarkt.jp/urawa-red-diamonds/startseite/verein/828",
        "sofaurl": "",
        "age_group": "full",
        "division": "1st"
      },
      "away_team": {
        "_id": "685fe9e1bdafffc53f471929",
        "team": "FC町田ゼルビア",
        "abbr": "町田",
        "enTeam": "FC Machida Zelvia",
        "country": "688b2c5fe7d7762ddaad1dfb",
        "genre": "club",
        "jdataid": 45,
        "labalph": "/mcd/",
        "transferurl": "https://www.transfermarkt.jp/machida-zelvia/startseite/verein/23568",
        "sofaurl": "",
        "age_group": "full",
        "division": "1st"
      },
      "match_format": {
        "_id": "68c90fc6179253217c838994",
        "name": "90",
        "period": [
          {
            "period_label": "1H",
            "start": 0,
            "end": 45,
            "order": 1
          },
          {
            "period_label": "2H",
            "start": 45,
            "end": 90,
            "order": 2
          }
        ],
        "createdAt": "2025-09-16T07:20:38.763Z",
        "updatedAt": "2025-09-16T07:20:38.763Z",
        "__v": 0
      },
      "stadium": {
        "_id": "68bf8fcb700ec3a9cc9cfae5",
        "name": "昌原サッカーセンター",
        "abbr": "",
        "en_name": "",
        "alt_names": [],
        "alt_abbrs": [],
        "alt_en_names": [],
        "country": "688b2c5fe7d7762ddaad1e5d",
        "__v": 0,
        "createdAt": "2025-09-09T02:24:11.132Z",
        "updatedAt": "2025-09-09T02:24:11.132Z"
      },
      "date": "2025-09-20T00:00:00.000Z",
      "audience": 0,
      "home_goal": 1,
      "away_goal": 0,
      "match_week": 1,
      "urls": [],
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
      "season": {
        "_id": "68b7b227b3716945451a52c5",
        "competition": "68b16aa806098678a4f4af3e",
        "name": "1993",
        "start_date": "1993-01-31T15:00:00.000Z",
        "end_date": "1994-01-30T15:00:00.000Z",
        "current": false,
        "__v": 0,
        "createdAt": "2025-09-03T03:12:39.701Z",
        "updatedAt": "2025-09-03T03:12:39.701Z"
      },
      "play_time": 90,
      "result": "home",
      "createdAt": "2025-09-19T23:33:47.158Z",
      "updatedAt": "2025-09-19T23:41:56.836Z",
      "__v": 0
    }
  }
  ```

### 3.5 `DELETE` | `/api/v1/match/:id`

- レスポンス

- 成功時

```json
{
  "message": "削除しました"
}
```
