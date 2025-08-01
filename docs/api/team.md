# チーム

- [チーム](#チーム)
  - [1. 概要- チーム](#1-概要--チーム)
  - [2. エラー処理](#2-エラー処理)
    - [2.1 :id が見つからないとき](#21-id-が見つからないとき)
    - [2.2 必須フィールドなし](#22-必須フィールドなし)
  - [3. リクエスト・レスポンス例](#3-リクエストレスポンス例)
    - [3.1 `GET` | `/api/v1/team`](#31-get--apiv1team)
    - [3.2 `POST` | `/api/v1/team`](#32-post--apiv1team)
    - [3.3 `GET` | `/api/v1/team/:id`](#33-get--apiv1teamid)
    - [3.4 `PUT` | `/api/v1/team/:id`](#34-put--apiv1teamid)
    - [3.5 `DELETE` | `/api/v1/team/:id`](#35-delete--apiv1teamid)

## 1. 概要- [チーム](#チーム)

| メソッド | エンドポイント     | 説明           | バリデーション        | 　フロント |
| -------- | ------------------ | -------------- | --------------------- | ---------- |
| `GET`    | `/api/v1/team`     | チーム一覧取得 | なし                  | /team      |
| `POST`   | `/api/v1/team`     | チーム新規追加 | 必須                  |
| `GET`    | `/api/v1/team/:id` | チーム詳細取得 | id のフォーマット検証 |
| `PUT`    | `/api/v1/team/:id` | チーム情報更新 | id のフォーマット検証 |
| `DELETE` | `/api/v1/team/:id` | チーム削除     | id のフォーマット検証 |

## 2. エラー処理

### 2.1 :id が見つからないとき

```json
{
  "error": {
    "code": 404,
    "message": "指定したチーム情報が見つかりません。",
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

### 3.1 `GET` | `/api/v1/team`

- レスポンス

```json
{
  "data": [
    {
      "_id": "685fe9e1bdafffc53f471928",
      "team": "浦和レッドダイヤモンズ",
      "abbr": "浦和",
      "enTeam": "Urawa Reds",
      "country": "日本",
      "genre": "club",
      "jdataid": 3,
      "labalph": "/uraw/",
      "transferurl": "https://www.transfermarkt.jp/urawa-red-diamonds/startseite/verein/828",
      "sofaurl": ""
    }
  ]
}
```

### 3.2 `POST` | `/api/v1/team`

- リクエストボディ

```json
{
  "team": "浦和レッドダイヤモンズ",
  "abbr": "浦和",
  "enTeam": "Urawa Reds",
  "country": "日本",
  "genre": "club",
  "jdataid": 3,
  "labalph": "/uraw/",
  "transferurl": "https://www.transfermarkt.jp/urawa-red-diamonds/startseite/verein/828",
  "sofaurl": ""
}
```

- レスポンス

  - 成功時

    ```json
    {
      "message": "追加しました",
      "data": {
        "_id": "685fe9e1bdafffc53f471928",
        "team": "浦和レッドダイヤモンズ",
        "abbr": "浦和",
        "enTeam": "Urawa Reds",
        "country": "日本",
        "genre": "club",
        "jdataid": 3,
        "labalph": "/uraw/",
        "transferurl": "https://www.transfermarkt.jp/urawa-red-diamonds/startseite/verein/828",
        "sofaurl": ""
      }
    }
    ```

### 3.3 `GET` | `/api/v1/team/:id`

- レスポンス

- 成功時

```json
{
  "data": {
    "_id": "685fe9e1bdafffc53f471928",
    "team": "浦和レッドダイヤモンズ",
    "abbr": "浦和",
    "enTeam": "Urawa Reds",
    "country": "日本",
    "genre": "club",
    "jdataid": 3,
    "labalph": "/uraw/",
    "transferurl": "https://www.transfermarkt.jp/urawa-red-diamonds/startseite/verein/828",
    "sofaurl": ""
  }
}
```

### 3.4 `PUT` | `/api/v1/team/:id`

- リクエストボディ

```json
{
  "team": "new"
}
```

- レスポンス

  - 成功時

  ```json
  {
    "message": "編集しました"
  }
  ```

### 3.5 `DELETE` | `/api/v1/team/:id`

- レスポンス

- 成功時

```json
{
  "message": "削除しました"
}
```
