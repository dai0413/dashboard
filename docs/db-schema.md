# データベース設計

- [データベース設計](#データベース設計)
  - [1. ユーザー](#1-ユーザー)
  - [2. チーム](#2-チーム)
  - [3. 選手](#3-選手)
  - [4. 移籍](#4-移籍)
  - [5. 怪我](#5-怪我)

## 1. ユーザー

| フィールド | 型     | null  | 注釈                       | バリデーション              |
| ---------- | ------ | ----- | -------------------------- | --------------------------- |
| user_name  | 文字列 | false | ユーザーの表示名           | 3 文字以上                  |
| email      | 文字列 | false | ユーザーのメールアドレス   | メールアドレス形式,ユニーク |
| password   | 文字列 | false | ハッシュ化されたパスワード | 8 文字以上英数字            |
| created_at | 日付   | false | アカウント作成日           | 自動設定(登録時)            |
| updated_at | 日付   | true  | アカウント情報の最終更新日 | 自動設定(更新時)            |
| admin      | 真偽値 | false | 管理者権限の有無           | デフォルト(false)           |
| is_staff   | 真偽値 | false | スタッフ権限の有無         | デフォルト(false)           |

## 2. チーム

| フィールド  | 型     | null  | 注釈      | バリデーション |
| ----------- | ------ | ----- | --------- | -------------- |
| team        | 文字列 | false | チーム名  |                |
| abbr        | 文字列 | true  | 略称      |                |
| enTeam      | 文字列 | true  | 英名      |                |
| country     | 文字列 | true  | 国名      |                |
| genre       | 文字列 | true  | ジャンル  | ※1             |
| jdataid     | 数字   | true  | j.data.id |                |
| labalph     | 文字列 | true  | lab.alph  |                |
| transferurl | 文字列 | true  | transfer  |                |
| sofaurl     | 文字列 | true  | sofa      |                |

※1 ENUM('academy', 'club', 'college', 'high_school', 'second_team', 'third_team', 'youth')

## 3. 選手

| フィールド | 型     | null  | 注釈     | バリデーション |
| ---------- | ------ | ----- | -------- | -------------- |
| name       | 文字列 | false | 名前     |                |
| en_name    | 文字列 | true  | 英語名   |                |
| dob        | 日付   | true  | 生年月日 |                |
| pob        | 文字列 | true  | 出身地   |                |

※name, en_name, dob いずれか一致してたら確認させる

## 4. 移籍

| フィールド     | 型       | null  | 注釈       | バリデーション  |
| -------------- | -------- | ----- | ---------- | --------------- |
| doa            | 日付     | false | 発表日     |                 |
| from_team      | 外部キー | true  | 所属元     | チーム外部キー  |
| from_team_name | 文字列   | true  | 所属元     | ※3              |
| to_team        | 外部キー | true  | 移籍先     | チーム外部キー  |
| to_team_name   | 文字列   | true  | 移籍先     | ※3              |
| player         | 外部キー | false | 選手       | 選手外部キー    |
| position       | 文字列   | true  | ポジション | 複数可, ※1 ENUM |
| form           | 文字列   | false | 形態       | ※2 ENUM         |
| number         | 数字     | true  | 背番号     |                 |
| from_date      | 日付     | false | 移籍日     |                 |
| to_date        | 日付     | true  |            | 移籍日より後    |
| URL            | URL      | true  |            | 複数可          |

※1 GK | DF | CB | RCB | LCB | SB | RSB | LSB | WB | RWB | LWB | MF | CM | DM | OM | WG | RSH | LSH | RWG | LWG | CF | FW

※2 完全 | 期限付き | 期限付き満了 | 期限付き解除 | 育成型期限付き | 育成型期限付き満了 | 育成型期限付き解除 | 満了 | 退団 | 引退 | 期限付き延長 | 育成型期限付き延長 | 契約解除 | 復帰 | 離脱 | 更新

※3from_team or from_team_name , to_team or to_team_name を入力
※from_team , from_team_name, to_team_name , player, form, from_date, to_date の組み合わせユニーク

## 5. 怪我

| フィールド   | 型       | null  | 注釈               | バリデーション          |
| ------------ | -------- | ----- | ------------------ | ----------------------- |
| doa          | 日付     | false | 公式発表           |                         |
| team         | 外部キー | true  | チーム             | チーム外部キー          |
| team_name    | 文字列   | true  | チーム             | ※3                      |
| now_team     | 外部キー | true  | 現所属             | チーム外部キー          |
| player       | 外部キー | false | 選手               | 選手外部キー            |
| doi          | 日付     | true  | 負傷日             |                         |
| dos          | 日付     | true  | 手術日             |                         |
| injured_part | 文字列   | true  | 負傷箇所・診断結果 | 複数可                  |
| is_injured   | 真偽値   | true  | 負傷中             | デフォルト true         |
| ttp          | 文字列   | true  | 全治期間※1         | 数字 + d or w or m or y |
| erd          | 日付     | true  | 復帰予測※2         | 負傷日・手術日より後    |
| URL          | URL      | true  |                    | 複数可                  |

※1 例） 1d , 1w, 10w-15w, 2m-3m, 10w-5m

※2 erd の値が null かつ ttp の値が null でないときは,doi または dos を基準に ttp 用いて計算。

※3 team or team_name を入力

※doa, team, player, doi, dos の組み合わせユニーク

```

```
