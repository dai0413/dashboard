# 選手別の統計

- [選手別の統計](#選手別の統計)
  - [1. 概要](#1-概要)
  - [2. リクエスト・レスポンス例](#2-リクエストレスポンス例)
    - [2.1 `GET` | `/api/v1/aggregate/player/statistics`](#21-get--apiv1aggregateplayerstatistics)

## 1. 概要

| メソッド | エンドポイント                        | 説明     | バリデーション           | フロント    |
| -------- | ------------------------------------- | -------- | ------------------------ | ----------- |
| `GET`    | `/api/v1/aggregate/player/statistics` | 一覧取得 | queryにplayer : string[] | /playerなど |

- queryにplayer : string[]を受け取り
- playerごとに以下を集計する
  - player : PlayerGet
    - Playerモデル
  - positionCounts : Partial<Record<Position, number>>
    - PlayerAppearanceモデルから position ごとの出場数を集計する
    - 1件以上出場した position のみ含める
  - mainPosition : Position
    - positionCountsで最多のpositionとする , 同率の場合はenum順
  - appearances : number
    - `starts` + `subs`
  - mainPosition : Position
    - positionCounts の最多 position
    - 同率の場合は Position enum の定義順とする
  - appearances : number
    - starts + subs
  - starts : number
    - PlayerAppearanceモデルの play_status = "スタート" の件数
  - subs : number
    - PlayerAppearanceモデルの play_status = "サブ" の件数
  - bench : number
    - PlayerAppearanceモデルの play_status = "ベンチ" の件数
  - minutes : number
    - PlayerAppearanceモデルの time の合計
  - goals : number
    - PlayerMatchEventLogモデルから集計
    - match_event_type が「Goalイベント」を示すIDの場合の件数
  - assists : number
    - PlayerMatchEventLogモデルから集計
    - match_event_type が「Assistイベント」を示すIDの場合の件数

## 2. リクエスト・レスポンス例

### 2.1 `GET` | `/api/v1/aggregate/player/statistics`

- レスポンス
  - 成功時

  ```json
  {
    "data": [
      {
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
        "mainPosition": "CF",
        "positionCounts": {
          "CF": 10,
          "RWG": 2
        },
        "starts": 10,
        "subs": 2,
        "benchs": 2,
        "minutes": 500,
        "goals": 10,
        "assists": 2
      }
    ]
  }
  ```
