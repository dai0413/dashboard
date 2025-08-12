# データベース設計

- [データベース設計](#データベース設計)
  - [1. ユーザー(user)](#1-ユーザーuser)
  - [2. チーム(team)](#2-チームteam)
  - [3. 選手(player)](#3-選手player)
  - [4. 移籍(transfer)](#4-移籍transfer)
  - [5. 怪我(injury)](#5-怪我injury)
  - [6. 国(country)](#6-国country)
  - [7. 代表試合シリーズ(NationalMatchSeries)](#7-代表試合シリーズnationalmatchseries)
    - [※1 team\_class の ENUM 値](#1-team_class-の-enum-値)
  - [8. 代表召集リスト(NationalCallUpList)](#8-代表召集リストnationalcalluplist)
  - [6. 国(country)](#6-国country-1)
  - [7. 代表試合シリーズ(NationalMatchSeries)](#7-代表試合シリーズnationalmatchseries-1)
    - [※1 team\_class の ENUM 値](#1-team_class-の-enum-値-1)
  - [8. 代表召集リスト(NationalCallUp)](#8-代表召集リストnationalcallup)

## 1. ユーザー(user)

| フィールド | 型     | null  | 注釈                       | バリデーション              |
| ---------- | ------ | ----- | -------------------------- | --------------------------- |
| user_name  | 文字列 | false | ユーザーの表示名           | 3 文字以上                  |
| email      | 文字列 | false | ユーザーのメールアドレス   | メールアドレス形式,ユニーク |
| password   | 文字列 | false | ハッシュ化されたパスワード | 8 文字以上英数字            |
| created_at | 日付   | false | アカウント作成日           | 自動設定(登録時)            |
| updated_at | 日付   | true  | アカウント情報の最終更新日 | 自動設定(更新時)            |
| admin      | 真偽値 | false | 管理者権限の有無           | デフォルト(false)           |
| is_staff   | 真偽値 | false | スタッフ権限の有無         | デフォルト(false)           |

## 2. チーム(team)

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

## 3. 選手(player)

| フィールド | 型     | null  | 注釈     | バリデーション |
| ---------- | ------ | ----- | -------- | -------------- |
| name       | 文字列 | false | 名前     |                |
| en_name    | 文字列 | true  | 英語名   |                |
| dob        | 日付   | true  | 生年月日 |                |
| pob        | 文字列 | true  | 出身地   |                |

※name, en_name, dob いずれか一致してたら確認させる

## 4. 移籍(transfer)

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

## 5. 怪我(injury)

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

※team, team_name, player, doi, dos , injured_part の組み合わせユニーク

## 6. 国(country)

| フィールド              | 型     | null  | 注釈               | バリデーション |
| ----------------------- | ------ | ----- | ------------------ | -------------- |
| name                    | 文字列 | false | 名前               |                |
| en_name                 | 文字列 | true  | 英語名             |                |
| iso3                    | 文字列 | true  | 英 3 文字コード    |                |
| fifa_code               | 文字列 | true  | 英 3 文字コード    |                |
| area                    | 文字列 | false | 地域               | ※1 ENUM        |
| district                | 文字列 | false | 詳細地域           | ※2 ENUM        |
| confederation           | 文字列 | false | 所属地域協会       | ※3 ENUM        |
| sub_confederation       | 文字列 | false | 所属詳細地域協会   | ※4 ENUM        |
| established_year        | 数字   | false | 協会成立年         |                |
| fifa_member_year        | 数字   | false | FIFA 加入年        |                |
| association_member_year | 数字   | false | 地域協会加入年     |                |
| district_member_year    | 数字   | false | 詳細地域協会加入年 |                |

※1 アジア, ヨーロッパ, アフリカ, オセアニア, 北アメリカ, 南極, 南アメリカ, ミクロネシア
※2 中央アジア, 北ヨーロッパ, 南ヨーロッパ, 北アフリカ, ポリネシア, 南部アフリカ, カリブ海, 南極大陸, 南アメリカ大陸, 西アジア, オーストラリア大陸, 中央ヨーロッパ, 中東, 南アジア, 東ヨーロッパ, 西ヨーロッパ, 中央アメリカ, 西アフリカ, 北大西洋, 東南アジア, 東アフリカ, 中央アフリカ, 北アメリカ大陸, 中部アフリカ, 東アジア, 東部アフリカ, 南大西洋, メラネシア, インド洋および南極大陸, ミクロネシア, インド洋, 東南アフリカ, オセアニア大陸, 大西洋, 北部アフリカ
※3 AFC, UEFA, CAF, OFC, CONCACAF, CONMEBOL, FSMFA
※4 CAFA,UNAF,COSAFA,CFU,AFF,WAFF,SAFF,UNCAF,WAFU,CECAFA,UNIFFAC,NAFU,EAFF

※iso3, name, の組み合わせユニーク

## 7. 代表試合シリーズ(NationalMatchSeries)

| フィールド | 型       | null  | 注釈       | バリデーション      |
| ---------- | -------- | ----- | ---------- | ------------------- |
| name       | 文字列   | false | シリーズ名 |                     |
| abbr       | 文字列   | true  | 略称       |                     |
| country    | 外部キー | false | 国         | 国外部キー          |
| team_class | 文字列   | false | 種類       | ※1 ENUM             |
| matches    | 外部キー | false | 試合       | 試合外部キー 複数可 |
| joined_at  | 日付     | true  | 合流日     |                     |
| left_at    | 日付     | true  | 離脱日     |                     |
| urls       | URL      | true  |            | 複数可              |

### ※1 team_class の ENUM 値

以下のような代表クラスを指定：

- `full`（フル代表）
- `u17` ～ `u24`（各年代別代表）
- `high_school`（高校選抜）
- `university`（大学選抜）
- `youth`（ユース選抜）

※country, team_class, joined_at, の組み合わせユニーク

## 8. 代表召集リスト(NationalCallUpList)

| フィールド          | 型       | null  | 注釈           | バリデーション           |
| ------------------- | -------- | ----- | -------------- | ------------------------ |
| series              | 外部キー | false | 試合シリーズ   | 代表試合シリーズ外部キー |
| player              | 外部キー | false | 選手           | 選手外部キー             |
| team                | 外部キー | true  | チーム         | チーム外部キー           |
| joined_at           | 日付     | true  | 合流日         |                          |
| left_at             | 日付     | true  | 離脱日         |                          |
| number              | 数字     | true  | 背番号         |                          |
| position            | 文字列   | true  | ポジション     | ※1 ENUM                  |
| is_overage          | 真偽値   | true  | オーバーエイジ |                          |
| is_backup           | 真偽値   | true  | バックアップ   |                          |
| is_training_partner | 真偽値   | true  | パートナー     |                          |
| left_reason         | 文字列   | true  | 離脱理由       |                          |

※1 GK | DF | MF | FW | MF/FW

※series, player, の組み合わせユニーク

## 6. 国(country)

| フィールド              | 型     | null  | 注釈               | バリデーション |
| ----------------------- | ------ | ----- | ------------------ | -------------- |
| name                    | 文字列 | false | 名前               |                |
| en_name                 | 文字列 | true  | 英語名             |                |
| iso3                    | 文字列 | true  | 英 3 文字コード    |                |
| fifa_code               | 文字列 | true  | 英 3 文字コード    |                |
| area                    | 文字列 | false | 地域               | ※1 ENUM        |
| district                | 文字列 | false | 詳細地域           | ※2 ENUM        |
| confederation           | 文字列 | false | 所属地域協会       | ※3 ENUM        |
| sub_confederation       | 文字列 | false | 所属詳細地域協会   | ※4 ENUM        |
| established_year        | 数字   | false | 協会成立年         |                |
| fifa_member_year        | 数字   | false | FIFA 加入年        |                |
| association_member_year | 数字   | false | 地域協会加入年     |                |
| district_member_year    | 数字   | false | 詳細地域協会加入年 |                |

※1 アジア, ヨーロッパ, アフリカ, オセアニア, 北アメリカ, 南極, 南アメリカ, ミクロネシア
※2 中央アジア, 北ヨーロッパ, 南ヨーロッパ, 北アフリカ, ポリネシア, 南部アフリカ, カリブ海, 南極大陸, 南アメリカ大陸, 西アジア, オーストラリア大陸, 中央ヨーロッパ, 中東, 南アジア, 東ヨーロッパ, 西ヨーロッパ, 中央アメリカ, 西アフリカ, 北大西洋, 東南アジア, 東アフリカ, 中央アフリカ, 北アメリカ大陸, 中部アフリカ, 東アジア, 東部アフリカ, 南大西洋, メラネシア, インド洋および南極大陸, ミクロネシア, インド洋, 東南アフリカ, オセアニア大陸, 大西洋, 北部アフリカ
※3 AFC, UEFA, CAF, OFC, CONCACAF, CONMEBOL, FSMFA
※4 CAFA,UNAF,COSAFA,CFU,AFF,WAFF,SAFF,UNCAF,WAFU,CECAFA,UNIFFAC,NAFU,EAFF

※iso3, name, の組み合わせユニーク

## 7. 代表試合シリーズ(NationalMatchSeries)

| フィールド | 型       | null  | 注釈       | バリデーション      |
| ---------- | -------- | ----- | ---------- | ------------------- |
| name       | 文字列   | false | シリーズ名 |                     |
| abbr       | 文字列   | true  | 略称       |                     |
| country    | 外部キー | false | 国         | 国外部キー          |
| team_class | 文字列   | false | 種類       | ※1 ENUM             |
| matches    | 外部キー | false | 試合       | 試合外部キー 複数可 |
| joined_at  | 日付     | true  | 合流日     |                     |
| left_at    | 日付     | true  | 離脱日     |                     |
| urls       | URL      | true  |            | 複数可              |

### ※1 team_class の ENUM 値

以下のような代表クラスを指定：

- `full`（フル代表）
- `u17` ～ `u24`（各年代別代表）
- `high_school`（高校選抜）
- `university`（大学選抜）
- `youth`（ユース選抜）

※country, team_class, joined_at, の組み合わせユニーク

## 8. 代表召集リスト(NationalCallUp)

| フィールド          | 型       | null  | 注釈           | バリデーション           |
| ------------------- | -------- | ----- | -------------- | ------------------------ |
| series              | 外部キー | false | 試合シリーズ   | 代表試合シリーズ外部キー |
| player              | 外部キー | false | 選手           | 選手外部キー             |
| team                | 外部キー | true  | 所属チーム     | チーム外部キー           |
| team_name           | 文字列   | true  | 所属チーム     |                          |
| joined_at           | 日付     | true  | 合流日         |                          |
| left_at             | 日付     | true  | 離脱日         |                          |
| number              | 数字     | true  | 背番号         |                          |
| position            | 文字列   | true  | ポジション     | ※1 ENUM                  |
| is_captain          | 真偽値   | true  | キャプテン     |                          |
| is_overage          | 真偽値   | true  | オーバーエイジ |                          |
| is_backup           | 真偽値   | true  | バックアップ   |                          |
| is_training_partner | 真偽値   | true  | パートナー     |                          |
| is_additional_call  | 真偽値   | true  | 追加招集       |                          |
| status              | 文字列   | false | 招集状況　     | ※2 ENUM                  |
| left_reason         | 文字列   | true  | 離脱理由       | ※3 ENUM                  |

※1 GK | DF | MF | FW | MF/FW
※2 called | joined | declined | withdrawn
joined : 全期間参加
declined : 事前辞退 joined_at, left_at は null
withdrawn : 途中離脱
※3 injury | personal | management | club | other | condition | suspension | transfer

※ team or team_name を入力
※series, player, の組み合わせユニーク
