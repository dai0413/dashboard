## 1. ルーティング

### 1.1 ベース

| パス      | 説明                                      |
| --------- | ----------------------------------------- |
| `/`       | メインページ（最新の移籍・怪我 5 件ずつ） |
| `/login`  | ログイン・新規登録ページ                  |
| `/me`     | ユーザーページ                            |
| `/models` | モデル一覧                                |

### 1.2 モデルデータ一覧

| パス                     | 説明             |
| ------------------------ | ---------------- |
| `/country`               | 国               |
| `/injury`                | 怪我             |
| `/national-callup`       | 代表招集リスト   |
| `/national-match-series` | 代表試合シリーズ |
| `/player`                | 選手             |
| `/team`                  | チーム           |
| `/transfer`              | 移籍             |

### 1.3 モデルデータ詳細

| パス                         | 説明             |
| ---------------------------- | ---------------- |
| `/country/:id`               | 国               |
| `/injury/:id`                | 怪我             |
| `/national-callup/:id`       | 代表招集リスト   |
| `/national-match-series/:id` | 代表試合シリーズ |
| `/player/:id`                | 選手             |
| `/team/:id`                  | チーム           |
| `/transfer/:id`              | 移籍             |

### 1.4 まとめページ

| パス                                       | 説明     |
| ------------------------------------------ | -------- |
| `/national-summary/:playerId`              | 国       |
| `/national-match-series-summary/:playerId` | シリーズ |
| `/player-summary/:playerId`                | 選手     |
| `/team-summary/:teamId`                    | チーム   |
