# 選手

- [選手](#選手)
  - [1. 概要](#1-概要)
  - [2. エラー処理](#2-エラー処理)
    - [2.1 :id が見つからないとき](#21-id-が見つからないとき)
    - [2.2 必須フィールドなし](#22-必須フィールドなし)
  - [3. リクエスト・レスポンス例](#3-リクエストレスポンス例)
    - [3.1 `GET` | `/api/v1/player`](#31-get--apiv1player)
    - [3.2 `POST` | `/api/v1/player/check`](#32-post--apiv1playercheck)
    - [3.3 `POST` | `/api/v1/player`](#33-post--apiv1player)
    - [3.4 `GET` | `/api/v1/player/:id`](#34-get--apiv1playerid)
    - [3.5 `PUT` | `/api/v1/player/:id`](#35-put--apiv1playerid)
    - [3.5 `DELETE` | `/api/v1/player/:id`](#35-delete--apiv1playerid)
    - [3.6 `POST` | `/api/v1/player/upload`](#36-post--apiv1playerupload)
    - [3.7 `GET` | `/api/v1/player/download`](#37-get--apiv1playerdownload)

## 1. 概要

| メソッド | エンドポイント           | 説明             | バリデーション        | フロント |
| -------- | ------------------------ | ---------------- | --------------------- | -------- |
| `GET`    | `/api/v1/player`         | 一覧取得         | なし                  | /player  |
| `POST`   | `/api/v1/player/check`   | 類似確認         | 必須:                 |
| `POST`   | `/api/v1/player`         | 新規追加         | 必須:                 |
| `GET`    | `/api/v1/player/:id`     | 取得             | id のフォーマット検証 |
| `PUT`    | `/api/v1/player/:id`     | 更新             | id のフォーマット検証 |
| `DELETE` | `/api/v1/player/:id`     | 削除             | id のフォーマット検証 |
| `POST`   | `/api/v1/player/upload`  | ファイルから追加 | ファイル整形          |
| `GET`    | `api/v1/player/download` | ダウンロード     |                       |

※新規追加は手順

1.  /player/check へ post 類似選手確認
2.  1.  類似選手なし　->　新規追加
    1.  類似選手あり　->　追加するかどうかの確認メッセージ
        1. 許可　-> 新規追加
        2. 未許可　-> キャンセル

## 2. エラー処理

### 2.1 :id が見つからないとき

```json
{
  "error": {
    "code": 404,
    "message": "指定した選手が見つかりません。",
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

### 3.1 `GET` | `/api/v1/player`

- レスポンス

```json
{
  "data": [
    {
      "_id": "",
      "name": "",
      "en_name": "",
      "dob": "",
      "pob": ""
    },
    {
      "_id": "",
      "name": "",
      "en_name": "",
      "dob": "",
      "pob": ""
    }
  ]
}
```

### 3.2 `POST` | `/api/v1/player/check`

- リクエストボディ

```json
// 必須フィールド name
{
  "name": "",
  "en_name"? : "",
  "dob"? : "",
  "pob"? : ""
}

```

- 類似選手なし

  - 成功時

    ```json
    {
        "message" : "追加しました",
        "data": {
            "id": "",
            "name": "",
            "en_name"? : "",
            "dob"? : "",
            "pob"? : ""
        }

    }

    ```

- 類似選手あり

  ```json
  {
    "message": "類似する選手が既に存在します。追加しますか？",
    "existing_player": [
      {
        "id": "123",
        "name": "田中 太郎",
        "en_name": "Taro Tanaka",
        "dob": "1995-04-10"
      },
      {
        "id": "456",
        "name": "田中 一郎",
        "en_name": "",
        "dob": "1995-04-10"
      }
    ]
  }
  ```

### 3.3 `POST` | `/api/v1/player`

- リクエストボディ

```json
// 必須フィールド name
{
  "name": "",
  "en_name"? : "",
  "dob"? : "",
  "pob"? : ""
}

```

- レスポンス

  - 成功時

    ```json
    {
        "message" : "追加しました",
        "data": {
            "id": "",
            "name": "",
            "en_name"? : "",
            "dob"? : "",
            "pob"? : ""
        }

    }

    ```

  - キャンセル

    ```json
    {
      "message": "登録をキャンセルしました。"
    }
    ```

### 3.4 `GET` | `/api/v1/player/:id`

- レスポンス

  - 成功時

  ```json
  {
    "data": {
      "_id": "",
      "name": "",
      "en_name": "",
      "dob": "",
      "pob": ""
    }
  }
  ```

### 3.5 `PUT` | `/api/v1/player/:id`

- リクエストボディ

```json
{
  "en_name": ""
}
```

- レスポンス

  - 成功時

  ```json
  {
    "message": "編集しました"
  }
  ```

### 3.5 `DELETE` | `/api/v1/player/:id`

- レスポンス

- 成功時

```json
{
  "message": "削除しました"
}
```

### 3.6 `POST` | `/api/v1/player/upload`

- リクエスト

```json
{
  "file": ".csv"
}
```

- レスポンス

  - 成功時

    ```json
    {
        "message" : "〇〇件追加しました。〇〇件失敗しました。",
        "data": [{
            "id": "",
            "name": "",
            "en_name"? : "",
            "dob"? : "",
            "pob"? : ""
        }]
    }

    ```

### 3.7 `GET` | `/api/v1/player/download`
