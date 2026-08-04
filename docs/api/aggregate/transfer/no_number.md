# 背番号が未入力の移籍モデルを取得

- [背番号が未入力の移籍モデルを取得](#背番号が未入力の移籍モデルを取得)
  - [1. 概要](#1-概要)
  - [2. リクエスト・レスポンス例](#2-リクエストレスポンス例)
    - [2.1 `GET` | `/api/v1/aggregate/transfer/no-number`](#21-get--apiv1aggregatetransferno-number)

## 1. 概要

| メソッド | エンドポイント                         | 説明     | バリデーション | フロント            |
| -------- | -------------------------------------- | -------- | -------------- | ------------------- |
| `GET`    | `/api/v1/aggregate/transfer/no-number` | 一覧取得 |                | /transfer/no-number |

## 2. リクエスト・レスポンス例

### 2.1 `GET` | `/api/v1/aggregate/transfer/no-number`

- レスポンス
  - 成功時

  ```json
  {
    "data": [
      {
        "_id": "689aa620f6af33ef4e7c2d09",
        "doa": "2025-08-11T15:00:00.000Z",
        "player": {
          "_id": "68516bd288294f93ffd0d3b0",
          "name": "前田　一翔",
          "en_name": "Ichika MAEDA",
          "dob": "2006-06-15T15:00:00.000Z",
          "pob": "福岡県",
          "old_id": "7759",
          "updatedAt": "2026-02-05T07:33:47.942Z",
          "normalized_en_name": "ICHIKA MAEDA"
        },
        "position": ["CF"],
        "form": "期限付き",
        "from_date": "2025-08-11T15:00:00.000Z",
        "to_date": "2026-01-30T15:00:00.000Z",
        "URL": [
          "https://www.kataller.co.jp/all/press-release/25maeoi99/",
          "https://www.avispa.co.jp/news/post-80078"
        ],
        "__v": 0,
        "from_team": {
          "_id": "685fe9e1bdafffc53f47193b",
          "team": "アビスパ福岡",
          "abbr": "福岡",
          "enTeam": "Avispa Fukuoka",
          "country": "688b2c5fe7d7762ddaad1dfb",
          "genre": "club",
          "jdataid": 23,
          "labalph": "/fuku/",
          "transferurl": "https://www.transfermarkt.jp/avispa-fukuoka/startseite/verein/9597",
          "age_group": "full",
          "division": "1st",
          "old_id": "JpnP049",
          "updatedAt": "2026-02-05T07:31:08.663Z",
          "normalized_name": "アビスパ福岡"
        },
        "to_team": {
          "_id": "685fe9e1bdafffc53f47195b",
          "team": "カターレ富山",
          "abbr": "富山",
          "enTeam": "Kataller Toyama",
          "country": "688b2c5fe7d7762ddaad1dfb",
          "genre": "club",
          "jdataid": 41,
          "labalph": "/toya/",
          "transferurl": "https://www.transfermarkt.jp/kataller-toyama/startseite/verein/22173",
          "age_group": "full",
          "division": "1st",
          "old_id": "JpnP029",
          "updatedAt": "2026-02-05T07:31:09.541Z",
          "normalized_name": "カターレ富山"
        }
      }
    ]
  }
  ```
