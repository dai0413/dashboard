# 更新履歴

## v2.0.2 #134

### 追加

- 移籍モデルデータ追加時のサポート機能
  - form === "更新" のとき from_team スキップ, to_team 自動入力

### 修正・改善

- フィルターにて選択中のフィールド消える問題
- 日付フィルター修正
  - server にて utc に変換して同年月日のデータを探す(時刻は無視)
- チームサマリー
  - 初期値のタブ変更 `line-plot`→`player`
  - タブの下に解説追加
  - season を得られないチームには`登録シーズンなし`と表示

## v2.0.0 #80

### 追加

- server にて crud 処理のテスト導入
- server, client での共通要素は shared に配置
- zod を使ったモデル定義

- モデル追加
  - `Referee`
  - `Competition`
  - `Season`
  - `TeamCompetitionSeason`
  - `Stadium`
  - `CompetitionStage`
  - `MatchFormat`
  - `Match`
  - `Player-registration`
  - `Player-RegistrationHistory`
  -
- 新規ページ追加
  - `competition-summary/:id`

### 改良

- フォーム
  - スキップ機能
  - 多数データバリデーション機能

### 修正

- スマホサイズフッター
- モーダルサイズ
- ログイン後のローディング表示

## v1.3.0 #53 - 2025-08-26

### 追加

- モデル追加
  - `Country`
  - `NationalMatchSeries`
  - `NationalCallUp`
- 新規ページ追加
  - `national-summary/:id`
  - `national-match-series-summary/:id`
  - `transfer/no-number`
  - `national-callup/series-count`
  - `admin`
- データ追加フォーム
  - `checkbox`追加
  - 多数データ追加用フォーム
- メニューに日本を追加
- `player-summary`に`national-callup`タブを追加
- `model-wrapper`にモデルプロバイダーまとめ
- `query-context`に`page`管理
- 新規モデル追加じの手順テンプレ作成

### 改良

- 開発中のログイン領略
- サマリーページでのフォーム開閉時でデータ更新
- サマリーページでのテーブルフィルターのリセットタイミング
- `createOption`改善 `utils/createOption`に移動
  - フィルタリングした後の`options`を返すのかどうかを引数に追加
- テーブルページ遷移
  - テーブルで page2 開く → 詳細 → テーブル page2 へ戻る
- `Team`モデルの`Country`フィールドを変更
  - 文字列から外部キーに変更
- `IconButton` コンポーネントの改善
  - アイコンを追加
- modelContext のリファクタリング
  - single, bulk, metacrud の 3 つに分類
- `Table`コンポーネント
  - 値 title のオブジェクト対応
  - `width`対応
- `player`の追加は多数データ(配列)対応

### 修正

- `team-summary/:id`の内定タブの表示データ修正
  - `to_team`が一致する`transfer`モデルを取得
- その他軽微な修正

## v1.2.0 #46 - 2025-07-30

### 追加

- 新規ページの作成
  - `/player-summary/:playerId/`
    - 移籍情報（transfer）・怪我情報（injury）をタブメニューで切り替え表示
  - `/team-summary/:teamId/`
    - 選手、内定、加入、退団、レンタル中、怪我をタブメニューで切り替え表示
- フルスクリーンでのローディング表示
- データがないときのテーブル表示処理
- `detail`を閉じた際に前のページに戻る処理
- API・service の追加（データ取得用）
  - `/transfer/current-players/:teamId`：現所属の選手一覧
  - `/transfer/current-loans/:teamId`：レンタル中の選手一覧
- `getAllInjury`, `getAllTransfer` にクエリオプションを追加

### 改良

- `IconButton` コンポーネントの改善
  - 押せない状態の表示を追加
  - アイコンを追加

### 修正

- ヘッダー・フッター調整に伴う余白修正
- 詳細ページにおける `undefined` 表示を空白に変更
- その他軽微な修正

## v1.1.0 #48 - 2025-07-23

### 追加

- ローディングの表示 #47
- 条件演算子追加（より大きい、より小さい、値あり、値なし） #52

### 修正

- ヘッダー #50
- フッター #48
- フォーム入力時のフィルター用データ管理 #49
- アラートメッセージの消去タイミング #51

## v1.0.0 - 初期リリース（2025-07-21）
