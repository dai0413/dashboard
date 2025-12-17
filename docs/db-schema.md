# データベース設計

- [データベース設計](#データベース設計)
  - [1. ユーザー(user)](#1-ユーザーuser)
  - [2. チーム(team)](#2-チームteam)
    - [フィールド一覧](#フィールド一覧)
    - [ENUM](#enum)
    - [組み合わせ (Mongoose)](#組み合わせ-mongoose)
  - [3. 選手(player)](#3-選手player)
    - [フィールド一覧](#フィールド一覧-1)
  - [4. 移籍(transfer)](#4-移籍transfer)
    - [フィールド一覧](#フィールド一覧-2)
    - [ENUM](#enum-1)
    - [組み合わせ (Mongoose)](#組み合わせ-mongoose-1)
    - [バリデーション(zod)](#バリデーションzod)
  - [5. 怪我(injury)](#5-怪我injury)
    - [フィールド一覧](#フィールド一覧-3)
    - [組み合わせ (Mongoose)](#組み合わせ-mongoose-2)
    - [バリデーション(zod)](#バリデーションzod-1)
    - [自動入力(server)](#自動入力server)
  - [6. 国(country)](#6-国country)
    - [フィールド一覧](#フィールド一覧-4)
    - [ENUM](#enum-2)
    - [組み合わせ (Mongoose)](#組み合わせ-mongoose-3)
  - [7. 代表試合シリーズ(National-Match-Series)](#7-代表試合シリーズnational-match-series)
    - [フィールド一覧](#フィールド一覧-5)
    - [ENUM](#enum-3)
    - [組み合わせ (Mongoose)](#組み合わせ-mongoose-4)
  - [8. 代表召集リスト(National-Callup)](#8-代表召集リストnational-callup)
    - [フィールド一覧](#フィールド一覧-6)
    - [ENUM](#enum-4)
    - [組み合わせ (Mongoose)](#組み合わせ-mongoose-5)
    - [バリデーション(zod)](#バリデーションzod-2)
  - [9. 審判(referee)](#9-審判referee)
    - [フィールド一覧](#フィールド一覧-7)
    - [組み合わせ (Mongoose)](#組み合わせ-mongoose-6)
  - [10. 大会(Competition)](#10-大会competition)
    - [フィールド一覧](#フィールド一覧-8)
    - [ENUM](#enum-5)
    - [組み合わせ (Mongoose)](#組み合わせ-mongoose-7)
  - [11. シーズン(Season)](#11-シーズンseason)
    - [フィールド一覧](#フィールド一覧-9)
    - [組み合わせ (Mongoose)](#組み合わせ-mongoose-8)
    - [備考](#備考)
  - [12. チームの大会参加記録(Team-Competition-Season)](#12-チームの大会参加記録team-competition-season)
    - [フィールド一覧](#フィールド一覧-10)
    - [組み合わせ (Mongoose)](#組み合わせ-mongoose-9)
    - [自動入力(client)](#自動入力client)
  - [13. スタジアム(Stadium)](#13-スタジアムstadium)
    - [フィールド一覧](#フィールド一覧-11)
    - [組み合わせ (Mongoose)](#組み合わせ-mongoose-10)
  - [14. 大会ステージ(Competition-Stage)](#14-大会ステージcompetition-stage)
    - [フィールド一覧](#フィールド一覧-12)
    - [ENUM](#enum-6)
    - [組み合わせ (Mongoose)](#組み合わせ-mongoose-11)
    - [バリデーション(zod)](#バリデーションzod-3)
    - [自動入力(client)](#自動入力client-1)
    - [備考](#備考-1)
  - [15. 試合フォーマット(Match-Format)](#15-試合フォーマットmatch-format)
    - [フィールド一覧](#フィールド一覧-13)
    - [period の型](#period-の型)
    - [ENUM](#enum-7)
    - [組み合わせ (Mongoose)](#組み合わせ-mongoose-12)
  - [16. 試合(Match)](#16-試合match)
    - [フィールド一覧](#フィールド一覧-14)
    - [ENUM](#enum-8)
    - [組み合わせ (Mongoose)](#組み合わせ-mongoose-13)
    - [自動入力(client)](#自動入力client-2)
  - [17. 選手登録(Player-Registration)](#17-選手登録player-registration)
    - [フィールド一覧](#フィールド一覧-15)
    - [ENUM](#enum-9)
    - [組み合わせ (Mongoose)](#組み合わせ-mongoose-14)
    - [自動入力(client)](#自動入力client-3)
  - [18. 選手登録履歴(Player-RegistrationHistory)](#18-選手登録履歴player-registrationhistory)
    - [フィールド一覧](#フィールド一覧-16)
    - [ENUM](#enum-10)
    - [組み合わせ (Mongoose)](#組み合わせ-mongoose-15)
    - [バリデーション(zod)](#バリデーションzod-4)
    - [自動入力(client)](#自動入力client-4)
  - [19. 試合イベント(Match-Event-Type)](#19-試合イベントmatch-event-type)
    - [フィールド一覧](#フィールド一覧-17)
    - [ENUM](#enum-11)
    - [組み合わせ (Mongoose)](#組み合わせ-mongoose-16)
    - [備考](#備考-2)
  - [20. フォーメーション(Formation)](#20-フォーメーションformation)
    - [フィールド一覧](#フィールド一覧-18)
    - [ENUM](#enum-12)
    - [組み合わせ (Mongoose)](#組み合わせ-mongoose-17)
    - [バリデーション(zod)](#バリデーションzod-5)
  - [21. 監督・コーチ(Staff)](#21-監督コーチstaff)
    - [フィールド一覧](#フィールド一覧-19)
    - [組み合わせ (Mongoose)](#組み合わせ-mongoose-18)
    - [自動入力(client)](#自動入力client-5)
  - [22. 選手の出場履歴(Player-Appearance)](#22-選手の出場履歴player-appearance)
    - [フィールド一覧](#フィールド一覧-20)
    - [ENUM](#enum-13)
    - [組み合わせ (Mongoose)](#組み合わせ-mongoose-19)
  - [23. 監督・コーチの出場履歴(Staff-Appearance)](#23-監督コーチの出場履歴staff-appearance)
    - [フィールド一覧](#フィールド一覧-21)
    - [組み合わせ (Mongoose)](#組み合わせ-mongoose-20)
    - [備考](#備考-3)
  - [24. 選手の試合イベントログ(Player-Match-Event-Log)](#24-選手の試合イベントログplayer-match-event-log)
    - [フィールド一覧](#フィールド一覧-22)
    - [ENUM](#enum-14)
    - [組み合わせ (Mongoose)](#組み合わせ-mongoose-21)
    - [バリデーション(zod)](#バリデーションzod-6)
    - [バリデーション(client)](#バリデーションclient)
    - [自動入力(client)](#自動入力client-6)
    - [入力時注意](#入力時注意)
    - [備考](#備考-4)
  - [25. 監督・コーチの試合イベントログ(Staff-Match-Event-Log)](#25-監督コーチの試合イベントログstaff-match-event-log)
    - [フィールド一覧](#フィールド一覧-23)
    - [ENUM](#enum-15)
    - [組み合わせ (Mongoose)](#組み合わせ-mongoose-22)
    - [バリデーション(zod)](#バリデーションzod-7)
    - [バリデーション(client)](#バリデーションclient-1)
    - [自動入力(client)](#自動入力client-7)
    - [入力時注意](#入力時注意-1)
  - [26. 試合でのフォーメーション(Match-Team-Formation)](#26-試合でのフォーメーションmatch-team-formation)
    - [フィールド一覧](#フィールド一覧-24)
    - [組み合わせ (Mongoose)](#組み合わせ-mongoose-23)
  - [今後](#今後)
  - [. 出場停止](#-出場停止)
  - [. 監督キャリア](#-監督キャリア)
  - [. ポジション](#-ポジション)

---

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

---

## 2. チーム(team)

### フィールド一覧

| フィールド  | 型                | 日本語        | require | default |
| ----------- | ----------------- | ------------- | ------- | ------- |
| team        | 文字列            | チーム名      | true    |         |
| abbr        | 文字列            | 略称          |         |         |
| enTeam      | 文字列            | 英名          |         |         |
| country     | 外部キー(Country) | 国名          |         |         |
| genre       | 文字列            | ジャンル      |         |         |
| age_group   | 文字列            | 年代          |         |         |
| division    | 文字列            | 2nd, 3rd など |         | 1st     |
| jdataid     | 数字              | j.data.id     |         |         |
| labalph     | 文字列            | lab.alph      |         |         |
| transferurl | 文字列            | transfer      |         |         |
| sofaurl     | 文字列            | sofa          |         |         |

### ENUM

- **genre**: `club` | `national`
- **age_group**: `full` | `u17` ～ `u24` | `high_school` | `university` | `youth`
- **division**: `1st` |`2nd` | `3rd`

### 組み合わせ (Mongoose)

- `transferurl` は **ユニーク**
- `sofaurl` は **ユニーク**

---

## 3. 選手(player)

### フィールド一覧

| フィールド | 型     | 日本語   | require | default |
| ---------- | ------ | -------- | ------- | ------- |
| name       | 文字列 | 名前     | true    |         |
| en_name    | 文字列 | 英語名   |         |         |
| dob        | 日付   | 生年月日 |         |         |
| pob        | 文字列 | 出身地   |         |         |

---

## 4. 移籍(transfer)

### フィールド一覧

| フィールド     | 型               | 日本語     | require | default |
| -------------- | ---------------- | ---------- | ------- | ------- |
| doa            | 日付             | 発表日     |         |         |
| from_team      | 外部キー(Team)   | 所属元     |         |         |
| from_team_name | 文字列           | 所属元     |         |         |
| to_team        | 外部キー(Team)   | 移籍先     |         |         |
| to_team_name   | 文字列           | 移籍先     |         |         |
| player         | 外部キー(Player) | 選手       | true    |         |
| position       | [文字列]         | ポジション |         |         |
| form           | 文字列           | 形態       |         |         |
| number         | 数字             | 背番号     |         |         |
| from_date      | 日付             | 移籍日     | true    |         |
| to_date        | 日付             | 満了日     |         |         |
| URL            | [URL]            | URL        |         |         |

### ENUM

- **position**:
  `GK` | `DF` | `CB` | `RCB` | `LCB` | `SB` | `RSB` | `LSB` |
  `WB` | `RWB` | `LWB` | `MF` | `CM` | `DM` | `OM` |
  `WG` | `RSH` | `LSH` | `RWG` | `LWG` | `CF` | `FW`
- **form**:  
  `完全` | `期限付き` | `期限付き満了` | `期限付き解除` |  
  `育成型期限付き` | `育成型期限付き満了` | `育成型期限付き解除` |  
  `満了` | `退団` | `引退` |  
  `期限付き延長` | `育成型期限付き延長` |  
  `契約解除` | `復帰` | `離脱` | `更新`

### 組み合わせ (Mongoose)

以下の組み合わせで **ユニーク** とする：

- `from_team`（任意）
- `from_team_name`（任意）
- `to_team`（任意）
- `to_team_name`（任意）
- `player`
- `form`（任意）
- `from_date`
- `to_date`（任意）

### バリデーション(zod)

- **from 系 または to 系 少なくとも一方は入力**
- **from_team または from_team_name どちらかを入力**
- **to_team または to_team_name どちらかを入力**
- **to_date は from_date より後**

---

## 5. 怪我(injury)

### フィールド一覧

| フィールド   | 型               | 日本語             | require | default |
| ------------ | ---------------- | ------------------ | ------- | ------- |
| doa          | 日付             | 公式発表           | true    |         |
| team         | 外部キー(Team)   | チーム             |         |         |
| team_name    | 文字列           | チーム             |         |         |
| now_team     | 外部キー(Team)   | 現所属             |         |         |
| player       | 外部キー(Player) | 選手               | true    |         |
| doi          | 日付             | 負傷日             |         |         |
| dos          | 日付             | 手術日             |         |         |
| injured_part | [文字列]         | 負傷箇所・診断結果 |         |         |
| is_injured   | 真偽値           | 負傷中             |         | true    |
| ttp          | 文字列           | 全治期間※1         |         |         |
| erd          | 日付             | 復帰予測※2         |         |         |
| URL          | [URL]            |                    |         |         |

### 組み合わせ (Mongoose)

以下の組み合わせで **ユニーク** とする：

- `team`（任意）
- `team_name`（任意）
- `player`
- `doi`（任意）
- `dos`（任意）
- `injured_part`（任意）

### バリデーション(zod)

- **team または team_name どちらかを入力**
- **erd は doi , dos より後**
- **ttp は `数字 + d or w or m or y` で入力**
  例） 1d , 1w, 10w-15w, 2m-3m, 10w-5m

### 自動入力(server)

- **erd の自動生成**
  - erd の値が undefined かつ ttp の値が undefined でないとき
    doi または dos を基準に ttp を用いて計算

---

## 6. 国(country)

### フィールド一覧

| フィールド              | 型     | 日本語             | require | default |
| ----------------------- | ------ | ------------------ | ------- | ------- |
| name                    | 文字列 | 名前               | true    |         |
| en_name                 | 文字列 | 英語名             |         |         |
| iso3                    | 文字列 | 英 3 文字コード    |         |         |
| fifa_code               | 文字列 | 英 3 文字コード    |         |         |
| area                    | 文字列 | 地域               |         |         |
| district                | 文字列 | 詳細地域           |         |         |
| confederation           | 文字列 | 所属地域協会       |         |         |
| sub_confederation       | 文字列 | 所属詳細地域協会   |         |         |
| established_year        | 数字   | 協会成立年         |         |         |
| fifa_member_year        | 数字   | FIFA 加入年        |         |         |
| association_member_year | 数字   | 地域協会加入年     |         |         |
| district_member_year    | 数字   | 詳細地域協会加入年 |         |         |

### ENUM

- **area**: `アジア` | `ヨーロッパ` | `アフリカ` | `オセアニア` | `北アメリカ` | `南極` | `南アメリカ` | `ミクロネシア`
- **district**:  
  `中央アジア` | `北ヨーロッパ` | `南ヨーロッパ` | `北アフリカ` | `ポリネシア` |  
  `南部アフリカ` | `カリブ海` | `南極大陸` | `南アメリカ大陸` | `西アジア` |  
  `オーストラリア大陸` | `中央ヨーロッパ` | `中東` | `南アジア` | `東ヨーロッパ` |  
  `西ヨーロッパ` | `中央アメリカ` | `西アフリカ` | `北大西洋` | `東南アジア` |  
  `東アフリカ` | `中央アフリカ` | `北アメリカ大陸` | `中部アフリカ` | `東アジア` |  
  `東部アフリカ` | `南大西洋` | `メラネシア` | `インド洋および南極大陸` |  
  `ミクロネシア` | `インド洋` | `東南アフリカ` | `オセアニア大陸` | `大西洋` | `北部アフリカ`
- **confederation**: `AFC` | `UEFA` | `CAF` | `OFC` | `CONCACAF` | `CONMEBOL` | `FSMFA`
- **sub_confederation**:  
  `CAFA` | `UNAF` | `COSAFA` | `CFU` | `AFF` | `WAFF` | `SAFF` |  
  `UNCAF` | `WAFU` | `CECAFA` | `UNIFFAC` | `NAFU` | `EAFF`

### 組み合わせ (Mongoose)

以下の組み合わせで **ユニーク** とする：

- `iso3`（任意）
- `name`

---

## 7. 代表試合シリーズ(National-Match-Series)

### フィールド一覧

| フィールド | 型                | 日本語     | require | default |
| ---------- | ----------------- | ---------- | ------- | ------- |
| name       | 文字列            | シリーズ名 | true    |         |
| abbr       | 文字列            | 略称       |         |         |
| country    | 外部キー(Country) | 国         | true    |         |
| age_group  | 文字列            | 年代       |         |         |
| matches    | [外部キー(Match)] | 試合       |         |         |
| joined_at  | 日付              | 合流日     |         |         |
| left_at    | 日付              | 離脱日     |         |         |
| urls       | [URL]             | URL        |         |         |

### ENUM

- **age_group**: `full` | `u17` ～ `u24` | `high_school` | `university` | `youth`

### 組み合わせ (Mongoose)

以下の組み合わせで **ユニーク** とする：

- `country`
- `age_group`（任意）
- `joined_at`（任意）

---

## 8. 代表召集リスト(National-Callup)

### フィールド一覧

| フィールド          | 型                            | 日本語         | require | default  |
| ------------------- | ----------------------------- | -------------- | ------- | -------- |
| series              | 外部キー(NationalMatchSeries) | 試合シリーズ   | true    |          |
| player              | 外部キー(Player)              | 選手           | true    |          |
| team                | 外部キー(Team)                | 所属チーム     |         |          |
| team_name           | 文字列                        | 所属チーム     |         |          |
| joined_at           | 日付                          | 合流日         |         |          |
| left_at             | 日付                          | 離脱日         |         |          |
| number              | 数字                          | 背番号         |         |          |
| position_group      | 文字列                        | ポジション     |         |          |
| is_captain          | 真偽値                        | キャプテン     | true    | false    |
| is_overage          | 真偽値                        | オーバーエイジ | true    | false    |
| is_backup           | 真偽値                        | バックアップ   | true    | false    |
| is_training_partner | 真偽値                        | パートナー     | true    | false    |
| is_additional_call  | 真偽値                        | 追加招集       | true    | false    |
| status              | 文字列                        | 招集状況       | true    | `joined` |
| left_reason         | 文字列                        | 離脱理由       |         |          |

### ENUM

- **position_group**: `GK` | `DF` | `MF` | `FW` | `MF/FW`
- **status**: `called` | `joined` | `declined` | `withdrawn`
- **left_reason**:
  `injury` | `personal` | `management` | `club` |
  `other` | `condition` | `suspension` | `transfer`

### 組み合わせ (Mongoose)

以下の組み合わせで **ユニーク** とする：

- `series`
- `player`

### バリデーション(zod)

- **team または team_name どちらかを入力**
- **status == decliend のときは joinjed_at と left_at は undefined**

---

## 9. 審判(referee)

### フィールド一覧

| フィールド  | 型                  | 日本語   | require | default |
| ----------- | ------------------- | -------- | ------- | ------- |
| name        | 文字列              | 名前     | true    |         |
| en_name     | 文字列              | 英名     |         |         |
| dob         | 日付                | 生年月日 |         |         |
| pob         | 文字列              | 出身地   |         |         |
| citizenship | [外部キー(Country)] | 国籍     |         |         |
| player      | 外部キー(Player)    | 選手     |         |         |
| transferurl | 文字列              | transfer |         |         |
| sofaurl     | 文字列              | sofa     |         |         |

### 組み合わせ (Mongoose)

- `transferurl` は **ユニーク**
- `sofaurl` は **ユニーク**

以下の組み合わせで **ユニーク** とする：

- `country`
- `age_group`（任意）
- `joined_at`（任意）

---

## 10. 大会(Competition)

### フィールド一覧

| フィールド       | 型                | 日本語     | require | default |
| ---------------- | ----------------- | ---------- | ------- | ------- |
| name             | 文字列            | 大会名     | true    |         |
| abbr             | 文字列            | 略称       |         |         |
| en_name          | 文字列            | 英名       |         |         |
| country          | 外部キー(Country) | 国         |         |         |
| competition_type | 文字列            | 大会規模   | true    |         |
| category         | 文字列            | 大会タイプ |         |         |
| level?           | 文字列            | 大会レベル |         |         |
| age_group?       | 文字列            | 年代       |         |         |
| official_match?  | 真偽値            | 公式戦     |         |         |
| transferurl?     | 文字列            | transfer   |         |         |
| sofaurl?         | 文字列            | sofa       |         |         |

### ENUM

- **competition_type**: `club` | `national` | `other`
- **category**: `league` | `cup` | `po` | `friendly` | `qualification`
- **level**:
  `1部` ~ `6部` | `リーグカップ` | `国内カップ戦` | `国内スーパーカップ` |
  `入れ替え` | `地域大会` | `地域予選`| `世界大会`
- **age_group**: `full` | `u17` ～ `u24` | `high_school` | `university` | `youth`

### 組み合わせ (Mongoose)

- `transferurl` は **ユニーク**
- `sofaurl` は **ユニーク**

以下の組み合わせで **ユニーク** とする：

- `name`
- `country`（任意）
- `joined_at`（任意）

---

## 11. シーズン(Season)

### フィールド一覧

| フィールド  | 型                    | 日本語           | require | default |
| ----------- | --------------------- | ---------------- | ------- | ------- |
| competition | 外部キー(Competition) | 大会             | true    |         |
| name        | 文字列                | 名称             | true    |         |
| start_date  | 日付                  | シーズン開始日   |         |         |
| end_date    | 日付                  | シーズン終了日   |         |         |
| current     | 真偽値                | 現在のシーズンか |         |         |
| note        | 文字列                | 備考             |         |         |

### 組み合わせ (Mongoose)

以下の組み合わせで **ユニーク** とする：

- `competition`
- `start_date`（任意）

### 備考

- `name` の 例 "2023","2023-2024"

---

## 12. チームの大会参加記録(Team-Competition-Season)

### フィールド一覧

| フィールド  | 型                    | 日本語   | require | default |
| ----------- | --------------------- | -------- | ------- | ------- |
| team        | 外部キー(Team)        | チーム   | true    |         |
| season      | 外部キー(Season)      | シーズン | true    |         |
| competition | 外部キー(Competition) | 大会     | true    |         |
| note        | 文字列                | 備考     |         |         |

### 組み合わせ (Mongoose)

以下の組み合わせで **ユニーク** とする：

- `team`
- `season`
- `competition`

### 自動入力(client)

- **client で入力させないフィールド**
  - `competiton`
- **competition の自動生成**
  - `season`モデルから取得

---

## 13. スタジアム(Stadium)

### フィールド一覧

| フィールド   | 型                | 日本語   | require | default |
| ------------ | ----------------- | -------- | ------- | ------- |
| name         | 文字列            | 名前     | true    |         |
| abbr         | 文字列            | 略称     |         |         |
| en_name      | 文字列            | 英語名   |         |         |
| alt_names    | [文字列]          | 別名     |         |         |
| alt_abbrs    | [文字列]          | 別略称   |         |         |
| alt_en_names | [文字列]          | 別英語名 |         |         |
| country      | 外部キー(Country) | 国       |         |         |
| transferurl  | 文字列            | transfer |         |         |
| sofaurl      | 文字列            | sofa     |         |         |

### 組み合わせ (Mongoose)

- `transferurl` は **ユニーク**
- `sofaurl` は **ユニーク**

以下の組み合わせで **ユニーク** とする：

- `name`
- `country`（任意）

---

## 14. 大会ステージ(Competition-Stage)

### フィールド一覧

| フィールド   | 型                         | 日本語               | require | default |
| ------------ | -------------------------- | -------------------- | ------- | ------- |
| competition  | 外部キー(Competition)      | 大会                 | true    |         |
| season       | 外部キー(Season)           | シーズン             | true    |         |
| stage_type   | 文字列                     | ステージタイプ       | true    |         |
| name         | 文字列                     | ステージ名           |         |         |
| round_number | 数字                       | 数字で表すラウンド   |         |         |
| leg          | 数字                       | 第 1 戦、第 2 戦など |         |         |
| order        | 数字                       | 表示順               |         |         |
| parent_stage | 外部キー(CompetitionStage) | 親ステージ           |         |         |
| notes        | 文字列                     | 備考                 |         |         |

### ENUM

- **stage_type**: `none` | `group_stage`| `round`| `quarter_final` | `semi_final`| `final` | `other`

### 組み合わせ (Mongoose)

以下の組み合わせで **ユニーク** とする：

- `competition`
- `season`
- `stage_type`
- `round_number`（任意）
- `leg`（任意）

### バリデーション(zod)

- **stage_type == none のときは name, round_number, leg, order, が undefined**

### 自動入力(client)

- **client で入力させないフィールド**
  - `competiton`
- **competition の自動生成**
  - `season`モデルから取得

### 備考

- `name` の例 (例: "準決勝", "決勝", "Group Stage A")
- `round_number` の例 (例: 1=1 回戦, 2=2 回戦)

※ parent_stage は 同じ competition/season 内のステージだけ親にできる

---

## 15. 試合フォーマット(Match-Format)

### フィールド一覧

| フィールド | 型   | 日本語 | require | default |
| ---------- | ---- | ------ | ------- | ------- |
| name       | 名前 | 名前   | true    |         |
| period     | 配列 |        |         |         |

### period の型

- {period_label : 文字列, start : 数字 , end : 数字}

### ENUM

- **period_label**: `1H` | `2H` | `ET1` | `ET2` | `3H` | `PK `| `GB`

- 例 1 "match_format": [
  { "period_label": "1H", "start": 0, "end": 45 },
  { "period_label": "2H", "start": 45, "end": 90 },
  { "period_label": "ET1", "start": 90, "end": 105 },
  { "period_label": "ET2", "start": 105, "end": 120 }
  ]

- 例 2 "match_format": [
  { "period_label": "1H", "start": 0, "end": 45 },
  { "period_label": "2H", "start": 45, "end": 90 },
  { "period_label": "PK", "start": null, "end": null }
  ]

- 例 3 "match_format": [
  { "period_label": "1H", "start": 0, "end": 30 },
  { "period_label": "2H", "start": 30, "end": 60 },
  { "period_label": "3H", "start": 60, "end": 90 }
  ]

### 組み合わせ (Mongoose)

- `name` は **ユニーク**
- `period` は **ユニーク**

---

## 16. 試合(Match)

### フィールド一覧

| フィールド        | 型                         | 日本語           | require | default |
| ----------------- | -------------------------- | ---------------- | ------- | ------- |
| competition       | 外部キー(Competition)      | 大会             | true    |         |
| competition-stage | 外部キー(CompetitionStage) | ステージ         | true    |         |
| season            | 外部キー(Season)           | シーズン         | true    |         |
| home_team         | 外部キー(Team)             | ホーム           | true    |         |
| away_team         | 外部キー(Team)             | アウェイ         | true    |         |
| match_format      | 外部キー(MatchFormat)      | 試合フォーマット |         |         |
| stadium           | 外部キー(Stadium)          | スタジアム       |         |         |
| play_time         | 数字                       | プレイ時間       |         |         |
| date              | 日付                       | 開催日           |         |         |
| audience          | 数字                       | 観客数           |         |         |
| home_goal         | 数字                       | ホーム得点       |         |         |
| away_goal         | 数字                       | アウェイ得点     |         |         |
| home_pk_goal      | 数字                       | ホーム PK 得点   |         |         |
| away_pk_goal      | 数字                       | アウェイ PK 得点 |         |         |
| result            | 文字列                     | 試合結果         |         |         |
| match_week        | 数字                       | 節               |         |         |
| weather           | 文字列                     | 天気             |         |         |
| temperature       | 数字                       | 気温             |         |         |
| humidity          | 数字                       | 湿度             |         |         |
| transferurl       | 文字列                     | transfer         |         |         |
| sofaurl           | 文字列                     | sofa             |         |         |
| urls              | [文字列]                   | urls             |         |         |
| old_id            | 文字列                     | 旧 match_id      |         |         |

### ENUM

- **result**: `home` | `away` | `draw`

### 組み合わせ (Mongoose)

- `transferurl` は **ユニーク**
- `sofaurl` は **ユニーク**
- `old_id` は **ユニーク**

以下の組み合わせで **ユニーク** とする：

- `competition`
- `competition_stage`
- `home_team`
- `away_team`
- `date`（任意）

以下の組み合わせで **ユニーク** とする：

- `competition`
- `competition_stage`
- `home_team`
- `away_team`
- `match_week`（任意）

### 自動入力(client)

- **client で入力させないフィールド**
  - `competiton`
  - `season`
  - `play_time`
  - `result`
- **competition の自動生成**
  - `competition_stage`モデルから取得
- **season の自動生成**
  - `competition_stage`モデルから取得
- **play_time の自動生成**
  - `※match_format`モデルから取得
- **result の自動生成**
  - `※goal, pk_goal`から計算

---

## 17. 選手登録(Player-Registration)

18. 選手登録履歴(Player-RegistrationHistory)から自動更新するモデル

### フィールド一覧

| フィールド           | 型                    | 日本語         | require | default |
| -------------------- | --------------------- | -------------- | ------- | ------- |
| date                 | 日付                  | 開催日         |         |         |
| season               | 外部キー(Season)      | シーズン       | true    |         |
| competition          | 外部キー(Competition) | 大会           | true    |         |
| player               | 外部キー(Player)      | 選手           | true    |         |
| team                 | 外部キー(Team)        | チーム         | true    |         |
| number               | 数字                  | 背番号         |         |         |
| position_group       | 文字列                | ポジション     |         |         |
| name                 | 文字列                | 名前           | true    |         |
| en_name              | 文字列                | 英語名         |         |         |
| registration_type    | 文字列                | 登録・抹消     | true    |         |
| height               | 数字                  | 身長           |         |         |
| weight               | 数字                  | 体重           |         |         |
| homegrown            | 真偽値                | ホームグロウン |         |         |
| registration_status  | 文字列                | 登録状況       | true    |         |
| isTypeTwo            | 真偽値                | 2 種登録       |         |         |
| isSpecialDesignation | 真偽値                | 特別指定       |         |         |
| note                 | 文字列                | 備考           |         |         |

### ENUM

- **position_group**: `GK` | `DF` | `MF` | `FW` | `MF/FW`
- **registration_type**: `register` | `deregister`
- **registration_status**: `active` | `terminated`

### 組み合わせ (Mongoose)

以下の組み合わせで **ユニーク** とする：

- `date`
- `season`
- `player`
- `team`
- `registration_type`

### 自動入力(client)

- **client で入力させないフィールド**
  - `competiton`
  - `registration_status`
- **competition の自動生成**
  - `season`モデルから取得
- **registration_status の自動生成**
  - `registration_type` === `register` がきたとき `season`, `player`, が一致する data を探す
    そのうち最新データの`registration_status` を `active`に, それ以外データは`terminated`
  - `registration_type` === `deregister` がきたとき `season`, `player`, が一致する data を探す
    そのうち送られてきた`date`より前のデータの`registration_status` を `terminated`に

[Player-RegistrationHistory] register ----→ [Player-Registration (registration_type === `register`)作成 + ※4]

[Player-RegistrationHistory] update ------→ [Player-Registration に差分適用]

[Player-RegistrationHistory] deregister --→ [Player-Registration (registration_type === `deregister`)作成 + ※5]

---

## 18. 選手登録履歴(Player-RegistrationHistory)

### フィールド一覧

| フィールド        | 型                    | 日本語           | require | default |
| ----------------- | --------------------- | ---------------- | ------- | ------- |
| date              | 日付                  | 開催日           |         |         |
| season            | 外部キー(Season)      | シーズン         | true    |         |
| competition       | 外部キー(Competition) | 大会             | true    |         |
| player            | 外部キー(Player)      | 選手             | true    |         |
| team              | 外部キー(Team)        | チーム           | true    |         |
| registration_type | 文字列                | 登録・抹消・変更 | true    |         |
| changes           | オブジェクト          | 変更点           |         |         |

- changes は以下の通り

| フィールド           | 型     | 日本語         | require | default |
| -------------------- | ------ | -------------- | ------- | ------- |
| number               | 数字   | 背番号         |         |         |
| position             | 文字列 | ポジション     |         |         |
| name                 | 文字列 | 名前           |         |         |
| en_name              | 文字列 | 英語名         |         |         |
| height               | 数字   | 身長           |         |         |
| weight               | 数字   | 体重           |         |         |
| homegrown            | 真偽値 | ホームグロウン |         |         |
| isTypeTwo            | 真偽値 | 2 種登録       |         |         |
| isSpecialDesignation | 真偽値 | 特別指定       |         |         |
| note                 | 文字列 | 備考           |         |         |

### ENUM

- **position_group**: `GK` | `DF` | `MF` | `FW` | `MF/FW`
- **registration_type**: `register` | `deregister`

### 組み合わせ (Mongoose)

以下の組み合わせで **ユニーク** とする：

- `date`
- `season`
- `player`
- `team`
- `registration_type`

### バリデーション(zod)

- **registration_type === register の時**
  → `name` は 必須
- **registration_type === change の時**
  → `changes` は 必須

### 自動入力(client)

- **client で入力させないフィールド**
  - `competiton`
- **competition の自動生成**
  - `season`モデルから取得
- **player , en_name の自動生成**
  - `player`モデルから取得
- **changes の自動生成**
  - `registration_type` === `deregister` 　の時 `season` , `team` , `player` が一致する直前データの `changes` を採用

---

## 19. 試合イベント(Match-Event-Type)

### フィールド一覧

| フィールド | 型     | 日本語         | require | default |
| ---------- | ------ | -------------- | ------- | ------- |
| name       | 文字列 | 名前           | true    |         |
| en_name    | 文字列 | 英名           | true    |         |
| abbr       | 文字列 | 略称           | true    |         |
| event_type | 文字列 | イベントタイプ | true    |         |

### ENUM

- **event_type**: `card` | `goal-assist` | `substitution`

### 組み合わせ (Mongoose)

- `name` は **ユニーク**
- `en_name` は **ユニーク**
- `abbr` は **ユニーク**

### 備考

- 例: イエロー,レッド, イエロー 2 枚退場, 途中出場 , 途中交代, 得点 , アシスト, オウンゴール

---

## 20. フォーメーション(Formation)

### フィールド一覧

| フィールド         | 型       | 日本語     | require | default |
| ------------------ | -------- | ---------- | ------- | ------- |
| name               | 文字列   | 名前       | true    |         |
| position_formation | [文字列] | ポジション | true    |         |

### ENUM

- **position_formation**:
  `GK` | `CB` | `LCB` | `RCB` | `RSB` | `LSB` | `LWB` | `RWB` |
  `DM` | `LCM` | `RCM` | `RIH` | `LIH` | `LSH` | `RSH` |
  `OM` | `LST` | `RST` | `RWG` | `LWG` | `RCF` | `LCF` | `CF`

### 組み合わせ (Mongoose)

- `position_formation` の **組み合わせユニーク**

### バリデーション(zod)

- `position_formation` の 組み合わせユニーク
- `position_formation`の長さ 11

---

## 21. 監督・コーチ(Staff)

### フィールド一覧

| フィールド  | 型                  | 日本語      | require | default |
| ----------- | ------------------- | ----------- | ------- | ------- |
| name        | 文字列              | 名前        | true    |         |
| en_name     | 文字列              | 英語名      |         |         |
| dob         | 日付                | 生年月日    |         |         |
| citizenship | [外部キー(Country)] | 国籍        |         |         |
| pob         | 文字列              | 出身地      |         |         |
| player      | 外部キー(Player)    | 選手        |         |         |
| old_id      | 文字列              | 旧 match_id |         |         |

### 組み合わせ (Mongoose)

- `player` は **ユニーク**
- `old_id` は **ユニーク**

### 自動入力(client)

- **client で入力させないフィールド**
  - `old_id`

---

## 22. 選手の出場履歴(Player-Appearance)

### フィールド一覧

| フィールド  | 型               | 日本語     | require | default |
| ----------- | ---------------- | ---------- | ------- | ------- |
| match       | 外部キー(Match)  | 試合       | true    |         |
| player      | 外部キー(Player) | 選手       | true    |         |
| team        | 外部キー(Team)   | チーム     | true    |         |
| number      | 数字             | 背番号     |         |         |
| play_status | 文字列           | ステータス |         |         |
| position    | 文字列           | ポジション |         |         |
| time        | 数字             | プレイ時間 |         |         |

### ENUM

- **play_status**: `start` | `sub` | `bench`
- **position**:
  `GK` | `DF` | `CB` | `RCB` | `LCB` | `SB` | `RSB` | `LSB` |
  `WB` | `RWB` | `LWB` | `MF` | `CM` | `DM` | `OM` |
  `WG` | `RSH` | `LSH` | `RWG` | `LWG` | `CF` | `FW`

### 組み合わせ (Mongoose)

以下の組み合わせで**ユニーク**とする:

- `match`
- `player`

---

## 23. 監督・コーチの出場履歴(Staff-Appearance)

### フィールド一覧

| フィールド | 型       | 日本語          | require | default |
| ---------- | -------- | --------------- | ------- | ------- |
| match      | 外部キー | 試合 (Match)    | true    |         |
| staff      | 外部キー | スタッフ(Staff) | true    |         |
| team       | 外部キー | チーム (Team)   | true    |         |
| role       | 文字列   | 役割            |         |         |

### 組み合わせ (Mongoose)

以下の組み合わせで**ユニーク**とする:

- `match`
- `staff`

### 備考

- `role`の例 監督・コーチ・通訳など

---

## 24. 選手の試合イベントログ(Player-Match-Event-Log)

### フィールド一覧

| フィールド     | 型                        | 日本語         | require | default |
| -------------- | ------------------------- | -------------- | ------- | ------- |
| match          | 外部キー(Match)           | 試合           | true    |         |
| team           | 外部キー (Team)           | チーム         | true    |         |
| matchEventType | 外部キー (MatchEventType) | イベントタイプ | true    |         |
| player         | 外部キー (Player)         | 選手           |         |         |
| player_name    | 文字列                    | 選手名         |         |         |
| time           | 数字                      | 時間           |         |         |
| add_time       | 数字                      | 追加タイム     |         |         |
| special_time   | 文字列(ENUM)              | 特別時間       |         |         |
| period_label   | 文字列(ENUM)              | 前後半         |         |         |
| time_name      | 文字列                    | 文字列時間     |         |         |
| order          | 数字                      | 順番           |         |         |

### ENUM

- **special_time**: `BT` | `HT` | `FT`
- **period_label**: `1H` | `2H` | `ET1` | `ET2` | `3H` | `PK `| `GB`

### 組み合わせ (Mongoose)

以下の組み合わせで **ユニーク** とする：

- `match`
- `player`
- `player_name`（任意）
- `time_name`（任意）
- `match_event`
- `order`（任意）

### バリデーション(zod)

- **order 入力時**  
  → `time`, `add_time`, `special_time` は `undefined`
- **special_time 入力時**  
  → `time`, `add_time`, `order` は `undefined`

### バリデーション(client)

- **player または player_name どちらかを入力** (matchEventType がオウンゴール以外のとき)
- **player 必須** (matchEventType がオウンゴール以外のとき)

### 自動入力(client)

- **client で入力させないフィールド**
  - `time_name`
  - `period_label`
- **time_name の自動生成**
  - `${time}` or `${time}+${add_time}`
- **period_label の自動生成**
  - match モデルの match_format フィールド内の periold フィールド から time が当てはまる periold_label を取得する
    (例: match から得られる match_format の period が
    `{"period": [{"period_label": "1H","order": 1,"start": 0,"end": 45},{"period_label": "2H","order": 2,"start": 45,"end": 90}],}`)
    ①：このとき time : 65 と入力されたら
    ②：start - end 間に 65 があるオブジェクトを探す
    ③：そのオブジェクトの periold_label を periold_label に入力
    ④：periold_label : `2H`

### 入力時注意

- オウンゴールについて `player` は失点した選手,　チームは得点したチームにする
- `time`は試合全体のうちの時間(後半 20 分は 65 と入力)

### 備考

- 今後 order を PK 系イベントだけ require にする（matchEventType に依存）

---

## 25. 監督・コーチの試合イベントログ(Staff-Match-Event-Log)

### フィールド一覧

| フィールド     | 型                       | 日本語         | require | default |
| -------------- | ------------------------ | -------------- | ------- | ------- |
| match          | 外部キー(Match)          | 試合           | true    |         |
| team           | 外部キー(Team)           | チーム         | true    |         |
| matchEventType | 外部キー(MatchEventType) | イベントタイプ | true    |         |
| staff          | 外部キー(Staff)          | 監督           |         |         |
| staff_name     | 文字列                   | 監督名         |         |         |
| time           | 数字                     | 時間           |         |         |
| add_time       | 数字                     | 追加タイム     |         |         |
| special_time   | 文字列                   | 特別時間       |         |         |
| period_label   | 文字列                   | 前後半         |         |         |
| time_name      | 文字列                   | 文字列時間     |         |         |

### ENUM

- **special_time**: `BT` | `HT` | `FT`
- **period_label**: `1H` | `2H` | `ET1` | `ET2` | `3H` | `PK `| `GB`

### 組み合わせ (Mongoose)

以下の組み合わせで **ユニーク** とする：

- `match`
- `staff`
- `staff_name`（任意）
- `time_name`（任意）
- `match_event`

### バリデーション(zod)

- **staff または staff_name どちらかを入力**
- **special_time 入力時**  
  → `time`, `add_time` は `undefined`

### バリデーション(client)

- `matchEventType`は card 系のみ入力可能

### 自動入力(client)

- **client で入力させないフィールド**
  - `time_name`
  - `period_label`
- **time_name の自動生成**
  - `${time}` or `${time}+${add_time}`
- **period_label の自動生成**
  - match モデルの match_format フィールド内の periold フィールド から time が当てはまる periold_label を取得する
    (例: match から得られる match_format の period が
    `{"period": [{"period_label": "1H","order": 1,"start": 0,"end": 45},{"period_label": "2H","order": 2,"start": 45,"end": 90}],}`)
    ①：このとき time : 65 と入力されたら
    ②：start - end 間に 65 があるオブジェクトを探す
    ③：そのオブジェクトの periold_label を periold_label に入力
    ④：periold_label : `2H`

### 入力時注意

- `time`は試合全体のうちの時間(後半 20 分は 65 と入力)

---

## 26. 試合でのフォーメーション(Match-Team-Formation)

### フィールド一覧

| フィールド | 型                  | 日本語           | require | default |
| ---------- | ------------------- | ---------------- | ------- | ------- |
| match      | 外部キー(Match)     | 試合             | true    |         |
| team       | 外部キー(Team)      | チーム           | true    |         |
| formation  | 外部キー(Formation) | フォーメーション | true    |         |

### 組み合わせ (Mongoose)

以下の組み合わせで **ユニーク** とする：

- `match`
- `team`

---

## 今後

## . 出場停止

## . 監督キャリア

## . ポジション
