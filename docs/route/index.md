## 1. ルーティング

### 1.1 ベース

| パス      | 説明                                      |
| --------- | ----------------------------------------- |
| `/`       | メインページ（最新の移籍・怪我 5 件ずつ） |
| `/login`  | ログイン・新規登録ページ                  |
| `/me`     | ユーザーページ                            |
| `/models` | モデル一覧                                |

### 1.2 モデルデータ一覧

| パス                           | 説明                         |
| ------------------------------ | ---------------------------- |
| `/competition-stage`           | 大会ステージ                 |
| `/competition`                 | 大会                         |
| `/country`                     | 国                           |
| `/formation`                   | フォーメーション             |
| `/injury`                      | 怪我                         |
| `/match-event-type`            | 試合イベントタイプ           |
| `/match-format`                | 大会フォーマット             |
| `/match-team-formation`        | 試合でのフォーメーション     |
| `/match`                       | 試合                         |
| `/national-callup`             | 代表招集リスト               |
| `/national-match-series`       | 代表試合シリーズ             |
| `/player-appearance`           | 選手出場履歴                 |
| `/player-match-event-log`      | 選手試合イベントログ         |
| `/player-registration-history` | 選手登録履歴                 |
| `/player-registration`         | 選手登録                     |
| `/player`                      | 選手                         |
| `/referee`                     | 審判                         |
| `/season`                      | シーズン                     |
| `/stadium`                     | スタジアム                   |
| `/staff-appearance`            | 監督・コーチ出場履歴         |
| `/staff-match-event-log`       | 監督・コーチ試合イベントログ |
| `/staff`                       | 監督・コーチ                 |
| `/team-competition-season`     | チームの大会参加記録         |
| `/team`                        | チーム                       |
| `/transfer`                    | 移籍                         |

### 1.3 モデルデータ詳細

### 1.3 モデルデータ詳細

| パス                               | 説明                         |
| ---------------------------------- | ---------------------------- |
| `/competition-stage/:id`           | 大会ステージ                 |
| `/competition/:id`                 | 大会                         |
| `/country/:id`                     | 国                           |
| `/formation/:id`                   | フォーメーション             |
| `/injury/:id`                      | 怪我                         |
| `/match-event-type/:id`            | 試合イベントタイプ           |
| `/match-format/:id`                | 大会フォーマット             |
| `/match-team-formation/:id`        | 試合でのフォーメーション     |
| `/match/:id`                       | 試合                         |
| `/national-callup/:id`             | 代表招集リスト               |
| `/national-match-series/:id`       | 代表試合シリーズ             |
| `/player-appearance/:id`           | 選手出場履歴                 |
| `/player-match-event-log/:id`      | 選手試合イベントログ         |
| `/player-registration-history/:id` | 選手登録履歴                 |
| `/player-registration/:id`         | 選手登録                     |
| `/player/:id`                      | 選手                         |
| `/referee/:id`                     | 審判                         |
| `/season/:id`                      | シーズン                     |
| `/stadium/:id`                     | スタジアム                   |
| `/staff-appearance/:id`            | 監督・コーチ出場履歴         |
| `/staff-match-event-log/:id`       | 監督・コーチ試合イベントログ |
| `/staff/:id`                       | 監督・コーチ                 |
| `/team-competition-season/:id`     | チームの大会参加記録         |
| `/team/:id`                        | チーム                       |
| `/transfer/:id`                    | 移籍                         |

### 1.4 まとめページ

| パス                                       | 説明     |
| ------------------------------------------ | -------- |
| `/national-summary/:countryId`             | 国       |
| `/national-match-series-summary/:seriesId` | シリーズ |
| `/player-summary/:playerId`                | 選手     |
| `/team-summary/:teamId`                    | チーム   |
