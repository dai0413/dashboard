# 代表招集人数が0人のシリーズモデルを取得

NationalMatchSeriesモデルのデータごとにNationalCallupのデータ数をカウント

- [代表招集人数が0人のシリーズモデルを取得](#代表招集人数が0人のシリーズモデルを取得)
  - [1. 概要](#1-概要)
  - [2. リクエスト・レスポンス例](#2-リクエストレスポンス例)
    - [2.1 `GET` | `api/v1/aggregate/national-callup/:id`](#21-get--apiv1aggregatenational-callupid)

## 1. 概要

| メソッド | エンドポイント                          | 説明     | バリデーション        | フロント                      |
| -------- | --------------------------------------- | -------- | --------------------- | ----------------------------- |
| `GET`    | `/api/v1/aggregate/national-callup/:id` | 一覧取得 | id のフォーマット検証 | /national-callup/sereis-count |

## 2. リクエスト・レスポンス例

### 2.1 `GET` | `api/v1/aggregate/national-callup/:id`

- レスポンス
  - 成功時

  ```json
  {
    "data": [
      {
        "_id": "6a211c982fe3dd07d3664812",
        "name": "U19北中米遠征26年6月",
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
          "association_member_year": 1954,
          "__v": 0,
          "createdAt": "2025-07-31T08:42:07.984Z",
          "updatedAt": "2026-03-05T23:14:58.083Z",
          "old_id": "日本"
        },
        "age_group": "u19",
        "joined_at": "2026-06-02T15:00:00.000Z",
        "left_at": "2026-06-25T15:00:00.000Z",
        "urls": [
          "https://www.jfa.jp/national_team/mens_all_2026/news/00036380/"
        ],
        "createdAt": "2026-06-04T06:35:04.855Z",
        "updatedAt": "2026-07-03T07:34:51.992Z",
        "__v": 0,
        "matches": [],
        "callups": [],
        "players_count": 0,
        "team": {
          "_id": "6a3d18e64f2932c827a7578a",
          "team": "U19日本",
          "abbr": "U19JPN",
          "country": "688b2c5fe7d7762ddaad1dfb",
          "genre": "national",
          "age_group": "u19",
          "division": "1st",
          "normalized_name": "U19日本",
          "createdAt": "2026-06-25T12:02:46.585Z",
          "updatedAt": "2026-06-25T12:07:59.391Z",
          "__v": 0,
          "enTeam": "U19Japan"
        }
      }
    ]
  }
  ```
