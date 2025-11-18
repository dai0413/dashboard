# データベース設計

- [データベース設計](#データベース設計)
  - [1. ユーザー(user)](#1-ユーザーuser)
  - [2. チーム(team)](#2-チームteam)
  - [3. 選手(player)](#3-選手player)
  - [4. 移籍(transfer)](#4-移籍transfer)
  - [5. 怪我(injury)](#5-怪我injury)
  - [6. 国(country)](#6-国country)
  - [7. 代表試合シリーズ(National-Match-Series)](#7-代表試合シリーズnational-match-series)
  - [8. 代表召集リスト(National-Callup)](#8-代表召集リストnational-callup)
  - [9. 審判(referee)](#9-審判referee)
  - [10. 大会(Competition)](#10-大会competition)
  - [11. シーズン(Season)](#11-シーズンseason)
  - [12. チームの大会参加記録(Team-Competition-Season)](#12-チームの大会参加記録team-competition-season)
  - [13. スタジアム(Stadium)](#13-スタジアムstadium)
  - [14. 大会ステージ(Competition-Stage)](#14-大会ステージcompetition-stage)
  - [15. 試合フォーマット(Match-Format)](#15-試合フォーマットmatch-format)
  - [16. 試合(Match)](#16-試合match)
  - [17. 選手登録(Player-Registration)](#17-選手登録player-registration)
  - [18. 選手登録履歴(Player-RegistrationHistory)](#18-選手登録履歴player-registrationhistory)

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

| フィールド  | 型     | 日本語        | require | undefined | 外部参照 | enum | default | not in form | その他規則 |
| ----------- | ------ | ------------- | ------- | --------- | -------- | ---- | ------- | ----------- | ---------- |
| team        | 文字列 | チーム名      | true    | false     |          |      |         |             |            |
| abbr        | 文字列 | 略称          | false   | true      |          |      |         |             |            |
| enTeam      | 文字列 | 英名          | false   | true      |          |      |         |             |            |
| country     | 文字列 | 国名          | false   | true      | Country  |      |         |             |            |
| genre       | 文字列 | ジャンル      | false   | true      |          | ※1   |         |             |            |
| age_group   | 文字列 | 年代          | false   | true      |          | ※2   |         |             |            |
| division    | 文字列 | 2nd, 3rd など | false   | true      |          | ※3   | 1st     |             |            |
| jdataid     | 数字   | j.data.id     | false   | true      |          |      |         |             |            |
| labalph     | 文字列 | lab.alph      | false   | true      |          |      |         |             |            |
| transferurl | 文字列 | transfer      | false   | true      |          |      |         |             |            |
| sofaurl     | 文字列 | sofa          | false   | true      |          |      |         |             |            |

※1 `club` | `national`

※2 年代

- `full`（フル代表）
- `u17` ～ `u24`（各年代別代表）
- `high_school`（高校選抜）
- `university`（大学選抜）
- `youth`（ユース選抜）
-

※3 `1st` |`2nd` | `3rd`

※4 制約

- transferurl はユニーク
- sofaurl はユニーク

## 3. 選手(player)

| フィールド | 型     | 日本語   | require | undefined | 外部参照 | enum | default | not in form | その他規則 |
| ---------- | ------ | -------- | ------- | --------- | -------- | ---- | ------- | ----------- | ---------- |
| name       | 文字列 | 名前     | true    |           |          |      |         |             |            |
| en_name    | 文字列 | 英語名   |         | true      |          |      |         |             |            |
| dob        | 日付   | 生年月日 |         | true      |          |      |         |             |            |
| pob        | 文字列 | 出身地   |         | true      |          |      |         |             |            |

※name, en_name, dob いずれか一致してたら確認させる

## 4. 移籍(transfer)

| フィールド     | 型       | 日本語     | require | undefined | 外部参照 | enum | default | not in form | その他規則 |
| -------------- | -------- | ---------- | ------- | --------- | -------- | ---- | ------- | ----------- | ---------- |
| doa            | 日付     | 発表日     | true    |           |          |      |         |             |            |
| from_team      | 外部キー | 所属元     |         | true      | Team     |      |         |             |            |
| from_team_name | 文字列   | 所属元     |         | true      |          |      |         |             |            |
| to_team        | 外部キー | 移籍先     |         | true      | Team     |      |         |             |            |
| to_team_name   | 文字列   | 移籍先     |         | true      |          |      |         |             |            |
| player         | 外部キー | 選手       | true    |           | Player   |      |         |             |            |
| position       | [文字列] | ポジション |         | true      |          | ※1   |         |             |            |
| form           | 文字列   | 形態       |         | true      |          | ※2   |         |             |            |
| number         | 数字     | 背番号     |         | true      |          |      |         |             |            |
| from_date      | 日付     | 移籍日     | true    | true      |          |      |         |             |            |
| to_date        | 日付     | 満了日     |         | true      |          |      |         |             |            |
| URL            | [URL]    | URL        |         | true      |          |      |         |             |            |

※1 GK | DF | CB | RCB | LCB | SB | RSB | LSB | WB | RWB | LWB | MF | CM | DM | OM | WG | RSH | LSH | RWG | LWG | CF | FW

※2 完全 | 期限付き | 期限付き満了 | 期限付き解除 | 育成型期限付き | 育成型期限付き満了 | 育成型期限付き解除 | 満了 | 退団 | 引退 | 期限付き延長 | 育成型期限付き延長 | 契約解除 | 復帰 | 離脱 | 更新

※ from_team or from_team_name どちらかを入力
※ to_team or to_team_name どちらかを入力
※ from_team , from_team_name, to_team_name , player, form, from_date, to_date の組み合わせユニーク
※ to_date は from_date より後

## 5. 怪我(injury)

| フィールド   | 型       | 日本語             | require | undefined | 外部参照 | enum | default | not in form | その他規則              |
| ------------ | -------- | ------------------ | ------- | --------- | -------- | ---- | ------- | ----------- | ----------------------- |
| doa          | 日付     | 公式発表           | true    |           |          |      |         |             |                         |
| team         | 外部キー | チーム             |         | true      | Team     |      |         |             |                         |
| team_name    | 文字列   | チーム             |         | true      |          | ※3   |         |             |                         |
| now_team     | 外部キー | 現所属             |         | true      | Team     |      |         |             |                         |
| player       | 外部キー | 選手               | true    |           | Player   |      |         |             |                         |
| doi          | 日付     | 負傷日             |         | true      |          |      |         |             |                         |
| dos          | 日付     | 手術日             |         | true      |          |      |         |             |                         |
| injured_part | [文字列] | 負傷箇所・診断結果 |         | true      |          |      |         |             |                         |
| is_injured   | 真偽値   | 負傷中             |         | true      |          |      | true    |             |                         |
| ttp          | 文字列   | 全治期間※1         |         | true      |          |      |         |             | 数字 + d or w or m or y |
| erd          | 日付     | 復帰予測※2         |         | true      |          |      |         | true        |                         |
| URL          | [URL]    |                    |         | true      |          |      |         |             |                         |

※1 例） 1d , 1w, 10w-15w, 2m-3m, 10w-5m

※2 erd の値が null かつ ttp の値が null でないときは,doi または dos を基準に ttp 用いて計算。

※3 team or team_name を入力

※ team, team_name, player, doi, dos , injured_part の組み合わせユニーク
※ erd は doi , dos より後

## 6. 国(country)

| フィールド              | 型     | 日本語             | require | undefined | 外部参照 | enum | default | not in form | その他規則 |
| ----------------------- | ------ | ------------------ | ------- | --------- | -------- | ---- | ------- | ----------- | ---------- |
| name                    | 文字列 | 名前               | true    |           |          |      |         |             |            |
| en_name                 | 文字列 | 英語名             |         | true      |          |      |         |             |            |
| iso3                    | 文字列 | 英 3 文字コード    |         | true      |          |      |         |             |            |
| fifa_code               | 文字列 | 英 3 文字コード    |         | true      |          |      |         |             |            |
| area                    | 文字列 | 地域               |         | true      |          | ※1   |         |             |            |
| district                | 文字列 | 詳細地域           |         | true      |          | ※2   |         |             |            |
| confederation           | 文字列 | 所属地域協会       |         | true      |          | ※3   |         |             |            |
| sub_confederation       | 文字列 | 所属詳細地域協会   |         | true      |          | ※4   |         |             |            |
| established_year        | 数字   | 協会成立年         |         | true      |          |      |         |             |            |
| fifa_member_year        | 数字   | FIFA 加入年        |         | true      |          |      |         |             |            |
| association_member_year | 数字   | 地域協会加入年     |         | true      |          |      |         |             |            |
| district_member_year    | 数字   | 詳細地域協会加入年 |         | true      |          |      |         |             |            |

※1 アジア, ヨーロッパ, アフリカ, オセアニア, 北アメリカ, 南極, 南アメリカ, ミクロネシア
※2 中央アジア, 北ヨーロッパ, 南ヨーロッパ, 北アフリカ, ポリネシア, 南部アフリカ, カリブ海, 南極大陸, 南アメリカ大陸, 西アジア, オーストラリア大陸, 中央ヨーロッパ, 中東, 南アジア, 東ヨーロッパ, 西ヨーロッパ, 中央アメリカ, 西アフリカ, 北大西洋, 東南アジア, 東アフリカ, 中央アフリカ, 北アメリカ大陸, 中部アフリカ, 東アジア, 東部アフリカ, 南大西洋, メラネシア, インド洋および南極大陸, ミクロネシア, インド洋, 東南アフリカ, オセアニア大陸, 大西洋, 北部アフリカ
※3 AFC, UEFA, CAF, OFC, CONCACAF, CONMEBOL, FSMFA
※4 CAFA,UNAF,COSAFA,CFU,AFF,WAFF,SAFF,UNCAF,WAFU,CECAFA,UNIFFAC,NAFU,EAFF

※ `iso3`, `name`, の組み合わせユニーク

## 7. 代表試合シリーズ(National-Match-Series)

| フィールド | 型         | 日本語     | require | undefined | 外部参照 | enum | default | not in form | その他規則 |
| ---------- | ---------- | ---------- | ------- | --------- | -------- | ---- | ------- | ----------- | ---------- |
| name       | 文字列     | シリーズ名 | true    |           |          |      |         |             |            |
| abbr       | 文字列     | 略称       |         | true      |          |      |         |             |            |
| country    | 外部キー   | 国         | true    |           | Country  |      |         |             |            |
| age_group  | 文字列     | 年代       |         | true      |          | ※1   |         |             |            |
| matches    | [外部キー] | 試合       |         | true      | Match    |      |         |             |            |
| joined_at  | 日付       | 合流日     |         | true      |          |      |         |             |            |
| left_at    | 日付       | 離脱日     |         | true      |          |      |         |             |            |
| urls       | [URL]      | URL        |         | true      |          |      |         |             |            |

※1 age_group の ENUM 値

以下のような代表クラスを指定：

- `full`（フル代表）
- `u17` ～ `u24`（各年代別代表）
- `high_school`（高校選抜）
- `university`（大学選抜）
- `youth`（ユース選抜）

※ `country`, `age_group`, `joined_at`, の組み合わせユニーク

## 8. 代表召集リスト(National-Callup)

| フィールド          | 型       | 日本語         | require | undefined | 外部参照            | enum | default  | not in form | その他規則 |
| ------------------- | -------- | -------------- | ------- | --------- | ------------------- | ---- | -------- | ----------- | ---------- |
| series              | 外部キー | 試合シリーズ   | true    |           | NationalMatchSeries |      |          |             |            |
| player              | 外部キー | 選手           | true    |           | Player              |      |          |             |            |
| team                | 外部キー | 所属チーム     |         | true      | Team                |      |          |             |            |
| team_name           | 文字列   | 所属チーム     |         | true      |                     |      |          |             |            |
| joined_at           | 日付     | 合流日         |         | true      |                     |      |          |             |            |
| left_at             | 日付     | 離脱日         |         | true      |                     |      |          |             |            |
| number              | 数字     | 背番号         |         | true      |                     |      |          |             |            |
| position_group      | 文字列   | ポジション     |         | true      |                     | ※1   |          |             |            |
| is_captain          | 真偽値   | キャプテン     | true    |           |                     |      | false    |             |            |
| is_overage          | 真偽値   | オーバーエイジ | true    |           |                     |      | false    |             |            |
| is_backup           | 真偽値   | バックアップ   | true    |           |                     |      | false    |             |            |
| is_training_partner | 真偽値   | パートナー     | true    |           |                     |      | false    |             |            |
| is_additional_call  | 真偽値   | 追加招集       | true    |           |                     |      | false    |             |            |
| status              | 文字列   | 招集状況       | true    |           |                     | ※2   | `joined` |             |            |
| left_reason         | 文字列   | 離脱理由       | false   | true      |                     | ※3   |          |             |            |

※1 `GK` | `DF` | `MF` | `FW` | `MF/FW`
※2 `called` | `joined` | `declined` | `withdrawn`
`joined` : 全期間参加
`declined` : 事前辞退
`withdrawn` : 途中離脱
※3 `injury` | `personal` | `management` | `club` | `other` | `condition` | `suspension` | `transfer`

※ `team` or `team_name` を入力
※ `series`, `player`, の組み合わせユニーク

※ `status` == `decliend`のときは `joinjed_at`, `left_at` は `undefined`

## 9. 審判(referee)

| フィールド  | 型         | 日本語   | require | undefined | 外部参照 | enum | default | not in form | その他規則 |
| ----------- | ---------- | -------- | ------- | --------- | -------- | ---- | ------- | ----------- | ---------- |
| name        | 文字列     | 名前     | true    |           |          |      |         |             |            |
| en_name     | 文字列     | 英名     |         | true      |          |      |         |             |            |
| dob         | 日付       | 生年月日 |         | true      |          |      |         |             |            |
| pob         | 文字列     | 出身地   |         | true      |          |      |         |             |            |
| citizenship | [外部キー] | 国籍     |         | true      | Country  |      |         |             |            |
| player      | 外部キー   | 選手     |         | true      | Player   |      |         |             |            |
| transferurl | 文字列     | transfer |         | true      |          |      |         |             |            |
| sofaurl     | 文字列     | sofa     |         | true      |          |      |         |             |            |

- transferurl はユニーク
- sofaurl はユニーク

## 10. 大会(Competition)

| フィールド       | 型       | 日本語     | require | undefined | 外部参照 | enum | default | not in form | その他規則 |
| ---------------- | -------- | ---------- | ------- | --------- | -------- | ---- | ------- | ----------- | ---------- |
| name             | 文字列   | 大会名     | true    |           |          |      |         |             |            |
| abbr             | 文字列   | 略称       |         | true      |          |      |         |             |            |
| en_name          | 文字列   | 英名       |         | true      |          |      |         |             |            |
| country          | 外部キー | 国         |         | true      | Country  |      |         |             |            |
| competition_type | 文字列   | 大会規模   | true    |           |          | ※1   |         |             |            |
| category         | 文字列   | 大会タイプ |         | true      |          | ※2   |         |             |            |
| level?           | 文字列   | 大会レベル |         | true      |          | ※3   |         |             |            |
| age_group?       | 文字列   | 年代       |         | true      |          | ※4   |         |             |            |
| official_match?  | 真偽値   | 公式戦     |         | true      |          |      |         |             |            |
| transferurl?     | 文字列   | transfer   |         | true      |          |      |         |             |            |
| sofaurl?         | 文字列   | sofa       |         | true      |          |      |         |             |            |

※1 `club` | `national` | `other`
※2 `league` | `cup` | `po` | `friendly` | `qualification`
※3

- `1部` ~ `6部`
- `リーグカップ`
- `国内カップ戦`
- `国内スーパーカップ`
- `入れ替え`
- `地域大会`
- `地域予選`
- `世界大会`

※4 年代

- `full`（フル代表）
- `u17` ～ `u24`（各年代別代表）
- `high_school`（高校選抜）
- `university`（大学選抜）
- `youth`（ユース選抜）

※name, country, の組み合わせユニーク

- transferurl はユニーク
- sofaurl はユニーク

## 11. シーズン(Season)

| フィールド  | 型       | 日本語           | require | undefined | 外部参照    | enum | default | not in form | その他規則 |
| ----------- | -------- | ---------------- | ------- | --------- | ----------- | ---- | ------- | ----------- | ---------- |
| competition | 外部キー | 大会             | true    |           | Competition |      |         |             |            |
| name        | 文字列   | 名称             | true    |           |             | ※1   |         |             |            |
| start_date  | 日付     | シーズン開始日   |         | true      |             |      |         |             |            |
| end_date    | 日付     | シーズン終了日   |         | true      |             |      |         |             |            |
| current     | 真偽値   | 現在のシーズンか |         | true      |             |      |         |             |            |
| note        | 文字列   | 備考             |         | true      |             |      |         |             |            |

※1 例 "2023","2023-2024"
※competition, start_date, の組み合わせユニーク

## 12. チームの大会参加記録(Team-Competition-Season)

| フィールド  | 型       | 日本語   | require | undefined | 外部参照    | enum | default | not in form | その他規則 |
| ----------- | -------- | -------- | ------- | --------- | ----------- | ---- | ------- | ----------- | ---------- |
| team        | 外部キー | チーム   | true    |           | Team        |      |         |             |            |
| season      | 外部キー | シーズン | true    |           | Season      |      |         |             |            |
| competition | 外部キー | 大会     | true    |           | Competition |      |         | true        |            |
| note        | 文字列   | 備考     |         | true      |             |      |         |             |            |

※team, season,competition の組み合わせユニーク

※ season 入力で　 competition 自動入力

## 13. スタジアム(Stadium)

| フィールド   | 型       | 日本語   | require | undefined | 外部参照 | enum | default | not in form | その他規則 |
| ------------ | -------- | -------- | ------- | --------- | -------- | ---- | ------- | ----------- | ---------- |
| name         | 文字列   | 名前     | true    |           |          |      |         |             |            |
| abbr         | 文字列   | 略称     |         | true      |          |      |         |             |            |
| en_name      | 文字列   | 英語名   |         | true      |          |      |         |             |            |
| alt_names    | [文字列] | 別名     |         | true      |          |      |         |             |            |
| alt_abbrs    | [文字列] | 別略称   |         | true      |          |      |         |             |            |
| alt_en_names | [文字列] | 別英語名 |         | true      |          |      |         |             |            |
| country      | 外部キー | 国       |         | true      | Country  |      |         |             |            |
| transferurl  | 文字列   | transfer |         | true      |          |      |         |             |            |
| sofaurl      | 文字列   | sofa     |         | true      |          |      |         |             |            |

※country, name, の組み合わせユニーク

- transferurl はユニーク
- sofaurl はユニーク

## 14. 大会ステージ(Competition-Stage)

| フィールド   | 型       | 日本語               | require | undefined | 外部参照         | enum        | default | not in form | その他規則 |
| ------------ | -------- | -------------------- | ------- | --------- | ---------------- | ----------- | ------- | ----------- | ---------- |
| competition  | 外部キー | 大会                 | true    |           |                  | Competition |         | true        |            |
| season       | 外部キー | シーズン             | true    |           | Season           |             |         |             |            |
| stage_type   | 文字列   | ステージタイプ       | true    |           |                  | ※1          |         |             |            |
| name         | 文字列   | ステージ名           |         | true      |                  |             |         |             | ※2         |
| round_number | 数字     | 数字で表すラウンド   |         | true      |                  |             |         |             | ※3         |
| leg          | 数字     | 第 1 戦、第 2 戦など |         | true      |                  |             |         |             |            |
| order        | 数字     | 表示順               |         | true      |                  |             |         |             |            |
| parent_stage | 外部キー | 親ステージ           |         | true      | CompetitionStage |             |         |             | ※4         |
| notes        | 文字列   | 備考                 |         | true      |                  |             |         |             |            |

※1 `none` | `group_stage`| `round`| `quarter_final`| `semi_final`| `final` | `other`
※2 (例: "準決勝", "決勝", "Group Stage A")
※3 (例: 1=1 回戦, 2=2 回戦)

※4 同じ competition/season 内のステージだけ親にできる

※competition, season, stage_type, round_number, leg の組み合わせユニーク

※stage_type == `none` のときは name, round_number, leg, order, が undefined

※ season 入力で　 competition 自動入力

## 15. 試合フォーマット(Match-Format)

| フィールド | 型                                            | 日本語 | require | undefined | 外部参照 | enum | default | not in form | その他規則 |
| ---------- | --------------------------------------------- | ------ | ------- | --------- | -------- | ---- | ------- | ----------- | ---------- |
| name       | 名前                                          | 名前   | true    |           |          |      |         |             |            |
| period     | [{label : 文字列, start : 数字 , end : 数字}] |        |         | true      |          |      |         |             |            |

※ label は※1 から選択
※1 `1H` | `2H` | `ET1` | `ET2` | `3H` | `PK `| `GB`

- 例 1 "match_format": [
  { "label": "1H", "start": 0, "end": 45 },
  { "label": "2H", "start": 45, "end": 90 },
  { "label": "ET1", "start": 90, "end": 105 },
  { "label": "ET2", "start": 105, "end": 120 }
  ]

- 例 2 "match_format": [
  { "label": "1H", "start": 0, "end": 45 },
  { "label": "2H", "start": 45, "end": 90 },
  { "label": "PK", "start": null, "end": null }
  ]

- 例 3 "match_format": [
  { "label": "1H", "start": 0, "end": 30 },
  { "label": "2H", "start": 30, "end": 60 },
  { "label": "3H", "start": 60, "end": 90 }
  ]

- name は unique
- period は unique

## 16. 試合(Match)

| フィールド        | 型       | 日本語           | require | undefined | 外部参照         | enum | default | not in form | その他規則            |
| ----------------- | -------- | ---------------- | ------- | --------- | ---------------- | ---- | ------- | ----------- | --------------------- |
| competition       | 外部キー | 大会             | true    |           | Competition      |      | true    | true        |                       |
| competition-stage | 外部キー | ステージ         | true    |           | CompetitionStage |      |         |             |                       |
| season            | 外部キー | シーズン         | true    |           | Season           |      | true    | true        |                       |
| home_team         | 外部キー | ホーム           | true    |           | Team             |      |         |             |                       |
| away_team         | 外部キー | アウェイ         | true    |           | Team             |      |         |             |                       |
| match_format      | 外部キー | 試合フォーマット |         | true      | MatchFormat      |      |         |             |                       |
| stadium           | 外部キー | スタジアム       |         | true      | Stadium          |      |         |             |                       |
| play_time         | 数字     | プレイ時間       |         | true      |                  |      | true    | true        | match_format から計算 |
| date              | 日付     | 開催日           |         | true      |                  |      |         |             |                       |
| audience          | 数字     | 観客数           |         | true      |                  |      |         |             |                       |
| home_goal         | 数字     | ホーム得点       |         | true      |                  |      |         |             |                       |
| away_goal         | 数字     | アウェイ得点     |         | true      |                  |      |         |             |                       |
| home_pk_goal      | 数字     | ホーム PK 得点   |         | true      |                  |      |         |             |                       |
| away_pk_goal      | 数字     | アウェイ PK 得点 |         | true      |                  |      |         |             |                       |
| result            | 文字列   | 試合結果         |         | true      |                  | ※2   | true    | true        | 得点から計算          |
| match_week        | 数字     | 節               |         | true      |                  |      |         |             |                       |
| weather           | 文字列   | 天気             |         | true      |                  |      |         |             |                       |
| temperature       | 数字     | 気温             |         | true      |                  |      |         |             |                       |
| humidity          | 数字     | 湿度             |         | true      |                  |      |         |             |                       |
| transferurl       | 文字列   | transfer         |         | true      | unique           |      |         |             |                       |
| sofaurl           | 文字列   | sofa             |         | true      | unique           |      |         |             |                       |
| urls              | [文字列] | urls             |         | true      |                  |      |         |             |                       |
| old_id            | 文字列   | 旧 match_id      |         | true      | unique           |      | true    |             |                       |

※2 'home' | 'away' | 'draw'

※competition, competition_stage, home_team, away_team, date , の組み合わせユニーク
※competition, competition_stage, home_team, away_team, match_week , の組み合わせユニーク

※competition_stage を入力で competition , season を自動入力
※match_format 　を入力で　 play_time 　を自動入力
※goal から result を自動入力

- transferurl はユニーク
- sofaurl はユニーク
- old_id はユニーク

## 17. 選手登録(Player-Registration)

18. 選手登録履歴(Player-RegistrationHistory)から自動更新するモデル

| フィールド           | 型       | 日本語         | require | undefined | 外部参照    | enum | default | not in form | その他規則 |
| -------------------- | -------- | -------------- | ------- | --------- | ----------- | ---- | ------- | ----------- | ---------- |
| date                 | 日付     | 開催日         |         | true      |             |      |         |             |            |
| season               | 外部キー | シーズン       | true    |           | Season      |      |         |             |            |
| competition          | 外部キー | 大会           | true    |           | Competition |      |         | true        |            |
| player               | 外部キー | 選手           | true    |           | Player      |      |         |             |            |
| team                 | 外部キー | チーム         | true    |           | Team        |      |         |             |            |
| number               | 数字     | 背番号         |         | true      |             |      |         |             |            |
| position_group       | 文字列   | ポジション     |         | true      |             | ※1   |         |             |            |
| name                 | 文字列   | 名前           | true    |           |             |      |         |             |            |
| en_name              | 文字列   | 英語名         |         | true      |             |      |         |             |            |
| registration_type    | 文字列   | 登録・抹消     | true    |           |             | ※2   |         |             |            |
| height               | 数字     | 身長           |         | true      |             |      |         |             |            |
| weight               | 数字     | 体重           |         | true      |             |      |         |             |            |
| homegrown            | 真偽値   | ホームグロウン |         | true      |             |      | false   |             |            |
| registration_status  | 文字列   | 登録状況       | true    |           |             | ※3   |         | true        |            |
| isTypeTwo            | 真偽値   | 2 種登録       |         | true      |             |      | false   |             |            |
| isSpecialDesignation | 真偽値   | 特別指定       |         | true      |             |      | false   |             |            |
| note                 | 文字列   | 備考           |         | true      |             |      |         |             |            |

※1 `GK` | `DF` | `MF` | `FW` | `MF/FW`
※2 `register` | `deregister`
※3 `active` | `terminated`

※date, season, player, team , registration_type, の組み合わせユニーク

※4 `registration_type` === `register` がきたとき
season, player, が一致する data を探す、　そのうち最新データの`registration_status` を `active`に, それ以外データは`terminated`
※5 `registration_type` === `deregister` がきたとき
season, player, が一致する data を探す、　そのうち送られてきた`date`より前のデータの`registration_status` を `terminated`に

[Player-RegistrationHistory] register ----→ [Player-Registration (registration_type === `register`)作成 + ※4]

[Player-RegistrationHistory] update ------→ [Player-Registration に差分適用]

[Player-RegistrationHistory] deregister --→ [Player-Registration (registration_type === `deregister`)作成 + ※5]

## 18. 選手登録履歴(Player-RegistrationHistory)

| フィールド        | 型           | 日本語           | require                                                  | undefined | 外部参照    | enum | default | not in form | その他規則 |
| ----------------- | ------------ | ---------------- | -------------------------------------------------------- | --------- | ----------- | ---- | ------- | ----------- | ---------- |
| date              | 日付         | 開催日           |                                                          | true      |             |      |         |             |            |
| season            | 外部キー     | シーズン         | true                                                     |           | Season      |      |         |             |            |
| competition       | 外部キー     | 大会             | true                                                     |           | Competition |      |         | true        |            |
| player            | 外部キー     | 選手             | true                                                     |           | Player      |      |         |             |            |
| team              | 外部キー     | チーム           | true                                                     |           | Team        |      |         |             |            |
| registration_type | 文字列       | 登録・抹消・変更 | true                                                     |           |             | ※2   |         |             |            |
| changes           | オブジェクト | 変更点           | `registration_type` === `register`, `change` のとき true | true      |             |      |         |             |            |

changes は以下の通り

| フィールド           | 型     | 日本語         | require | undefined | 外部参照 | enum | default | not in form | その他規則 |
| -------------------- | ------ | -------------- | ------- | --------- | -------- | ---- | ------- | ----------- | ---------- |
| number               | 数字   | 背番号         |         | true      |          |      |         |             |            |
| position_group       | 文字列 | ポジション     |         | true      |          | ※1   |         |             |            |
| name                 | 文字列 | 名前           | true    |           |          |      |         |             |            |
| en_name              | 文字列 | 英語名         |         | true      |          |      |         |             |            |
| height               | 数字   | 身長           |         | true      |          |      |         |             |            |
| weight               | 数字   | 体重           |         | true      |          |      |         |             |            |
| homegrown            | 真偽値 | ホームグロウン |         | true      |          |      | false   |             |            |
| isTypeTwo            | 真偽値 | 2 種登録       |         | true      |          |      | false   |             |            |
| isSpecialDesignation | 真偽値 | 特別指定       |         | true      |          |      | false   |             |            |
| note                 | 文字列 | 備考           |         | true      |          |      |         |             |            |

※1 `GK` | `DF` | `MF` | `FW` | `MF/FW`
※2 `register` | `deregister` | `change`
※3 `active` | `terminated`

※date, season, player, team , registration_type, の組み合わせユニーク

※season を入力で competition を自動入力

※name , en_name は未入力のとき player モデルから取得
