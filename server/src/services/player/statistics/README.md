# Player Statistics

Player Statistics API の集計仕様と処理フローをまとめたドキュメント。

## 1. API の目的

指定された条件から対象選手・対象試合・対象グループを決定し、以下の情報を統合した `PlayerStatistic[]` を返す。

```text
PlayerStatistic
├─ player
├─ group
├─ teams
├─ appearances
├─ starts
├─ subs
├─ bench
├─ minutes
├─ goals
├─ assists
├─ mainPosition
└─ positionCounts
```

基本の集計単位は `player`。

`groupBy` が指定された場合は、`player + group` 単位で集計する。

---

## 2. Request

現在の API は大量の `player` ID を扱うため POST を使用する。

例:

```json
{
  "player": ["playerId1", "playerId2"],
  "season": "seasonId",
  "competition": "competitionId",
  "team": "teamId",
  "groupBy": "season"
}
```

### `player` の有無

#### `player` 未指定

`season` が必須。

対象選手は以下の Union で決定する。

```text
PlayerRegistration
        ∪
PlayerAppearance
        ↓
対象 playerIds
```

登録されているが出場していない選手も対象になる。

#### `player` 指定あり

指定された player ID を対象とする。

`groupBy` を指定できる。

---

## 3. `groupBy` のルール

```ts
enum PlayerStatisticsGroupBy {
  SEASON = "season",
  COMPETITION = "competition",
  TEAM = "team",
}
```

### groupBy 未指定

```text
player
```

### `groupBy = season`

```text
player + season
```

### `groupBy = competition`

```text
player + competition
```

### `groupBy = team`

```text
player + team
```

### 制約

`groupBy` は `player` が指定されている場合のみ使用する。

```text
playerなし + groupByあり
→ BadRequest
```

---

## 4. 対象 Match の決定

### player 指定時

まず、player に関連する Match の候補を作る。

```text
PlayerRegistration
        +
PlayerAppearance
        ↓
playerMatchIds
        ↓
Match filter
        ↓
最終 matchIds
```

`PlayerRegistration` は `match` を持たないため、主に `season` で絞る。

`PlayerAppearance` は `match` を持つため、Appearance から直接候補 Match を取得する。

その後、`buildMatchStage()` / `matchQueryConfig` による Match 条件を適用する。

### player 未指定時

`season` を基準に対象選手を決定し、その後 Match filter を適用する。

---

## 5. Match 情報

対象 Match から以下を作る。

### `matchIds`

Statistics の対象となる Match ID 一覧。

### `matchGroupMap`

```ts
Map<string, MatchGroupInfo>;
```

```ts
type MatchGroupInfo = {
  season?: Types.ObjectId;
  competition?: Types.ObjectId;
};
```

`matchId -> season / competition` を解決するために使用する。

### `seasonObjectIds`

今回の統計対象となる Season ID 一覧。

`season` が明示された場合だけでなく、対象 `matchIds` の `match.season` からも補完する。

これにより、player 指定時でも対象 Season が正しく取得できる。

---

## 6. Statistics のデータソース

| 項目           | Source                                |
| -------------- | ------------------------------------- |
| appearances    | PlayerAppearance                      |
| starts         | PlayerAppearance                      |
| subs           | PlayerAppearance                      |
| bench          | PlayerAppearance                      |
| minutes        | PlayerAppearance                      |
| goals          | PlayerMatchEventLog                   |
| assists        | PlayerMatchEventLog                   |
| mainPosition   | PlayerAppearance / Transfer           |
| positionCounts | PlayerAppearance                      |
| teams          | PlayerRegistration + PlayerAppearance |
| group.data     | Season / Competition / Team           |

---

## 7. Appearance 集計

`PlayerAppearance` はまず `player + match + team` 単位で集計する。

```text
PlayerAppearance
      ↓
player + match + team
      ↓
groupBy に応じて再集約
      ↓
player + group
```

集計値:

```text
starts
subs
bench
minutes
positions
```

`groupBy` に応じた group ID は以下から取得する。

```text
season
  → matchGroupMap.season

competition
  → matchGroupMap.competition

team
  → PlayerAppearance.team
```

---

## 8. Match Event Log 集計

`PlayerMatchEventLog` も Appearance と同じ粒度で集計する。

```text
PlayerMatchEventLog
      ↓
player + match + team
      ↓
groupBy に応じて再集約
      ↓
player + group
```

集計値:

```text
goals
assists
```

これにより Appearance / EventLog の key を共通化できる。

---

## 9. Statistics Key

統計結果を結合するため、以下のキーを共通利用する。

```ts
createStatisticsKey(playerId, groupId);
```

概念上は次の通り。

```text
groupByなし
→ playerId

season
→ playerId + seasonId

competition
→ playerId + competitionId

team
→ playerId + teamId
```

この key を以下で共通利用する。

```text
Appearance
EventLog
Position
Teams
Result
```

---

## 10. Position Resolution

Position は単純集計ではなく fallback 方式で解決する。

```text
① 指定 Match + Team の Appearance
        ↓ 未解決
② Team の全 Appearance
        ↓ 未解決
③ 全 Appearance
        ↓ 未解決
④ 最新 Transfer
```

### Position の解決単位

`groupBy` 対応後は `player` 単位ではなく、

```text
player + groupId
```

単位で解決する。

### `PositionResolveTarget`

```ts
type PositionResolveTarget = {
  playerId: Types.ObjectId;
  groupId?: Types.ObjectId;
};
```

`createPositionResolveTargets()` で対象 `player × group` を先に作成する。

`getRemainingTargets()` は `createStatisticsKey(playerId, groupId)` を使って未解決の target を判定する。

### Transfer の扱い

Transfer 由来の Position は実績値ではないため、以下のみ設定する。

```text
mainPosition
```

`positionCounts` には含めない。

---

## 11. Teams

`teams` は `PlayerRegistration` と `PlayerAppearance` の両方から取得する。

```text
PlayerRegistration
       +
PlayerAppearance
       ↓
player + group
       ↓
unique Team IDs
       ↓
Team data を一括取得
       ↓
Team[]
```

### Registration

Registration は `season` を持つ。

```text
season
  → Registration.season

tam
  → Registration.team
```

### Appearance

Appearance は `match` と `team` を持つ。

```text
season
  → matchGroupMap.season

competition
  → matchGroupMap.competition

team
  → Appearance.team
```

### 重要

`teams` は `player` 全体ではなく、`player + group` 単位で作る。

例:

```text
player A + season 2025
  → [Team A, Team B]

player A + season 2026
  → [Team C]
```

また、出場がなくても Registration に Team が存在すれば `teams` に含まれる。

---

## 12. Group Data

Frontend で group の種類・ID・表示情報を扱いやすくするため、返却値は以下の構造を想定する。

```ts
type StatisticsGroup = {
  by: PlayerStatisticsGroupBy;
  id: string;
  data: Season | Competition | Team;
};
```

例:

```json
{
  "group": {
    "by": "season",
    "id": "seasonId",
    "data": {
      "_id": "seasonId",
      "name": "2026-2027"
    }
  }
}
```

`data` は `getNest(false, POPULATE_PATHS)` を利用した aggregate で関連データも取得する。

---

## 13. Result の生成

最終結果は `appearanceStats` を基準にはせず、**`playerObjectIds × groupIds` を基準に生成する**。

これにより、出場機会がない選手でも結果を返せる。

```text
playerObjectIds
      ×
groupIds
      ↓
statisticsKey
      ↓
Appearance Map
EventLog Map
Position Map
PlayerTeams Map
      ↓
PlayerStatistic
```

出場実績がない場合は以下のように 0 で返す。

```text
appearances = 0
starts = 0
subs = 0
bench = 0
minutes = 0
goals = 0
assists = 0
```

---

## 14. 処理フロー全体

```text
Request
  │
  ├─ playerあり
  │    └─ Registration + Appearance → player関連 Match
  │
  └─ playerなし
       └─ season → Registration + Appearance → playerIds
  │
  ↓
playerObjectIds
  │
  ↓
playerMatchIds
  │
  ↓
Match filter
  │
  ├─ matchIds
  ├─ matchGroupMap
  └─ seasonObjectIds
  │
  ├───────────────┬──────────────┬──────────────┐
  ↓               ↓              ↓              ↓
Appearance      EventLog      Position        Teams
  │               │              │              │
  └───────┬───────┴──────────────┴──────────────┘
          ↓
   player + group key
          ↓
       Group Data
          ↓
 playerObjectIds × groupIds
          ↓
   PlayerStatistic[]
```

---

## 15. 設計上の重要ポイント

### GET ではなく POST

大量の `player` ID を query string に含めると URL が長くなり、一定件数を超えると HTTP リクエスト自体が失敗する可能性がある。

そのため、本 API は大量 ID を request body で受け取る POST とする。

### DB で不要な全件データを Frontend に渡さない

`PlayerAppearance` の全レコードを取得して Frontend 側で `playerId` を重複排除するのではなく、`distinct()` 等を利用して server 側で ID を解決する。

### group の key を統一する

Appearance / EventLog / Position / Teams / Result はすべて、

```ts
createStatisticsKey(playerId, groupId);
```

を使って同じ粒度で扱う。

### 出場実績0の選手も返す

統計結果は appearance の存在を基準にせず、対象 `playerObjectIds × groupIds` を基準に生成する。

---

## 16. 今後の拡張

`PlayerStatisticsGroupBy` に新しい group を追加する場合は、主に以下を確認する。

```text
1. PlayerStatisticsGroupBy に追加
2. getStatisticsGroupIds に group の解決方法を追加
3. group.data の取得 Model を追加
4. Appearance の groupId 解決を追加
5. EventLog の groupId 解決を追加
6. Position の group 解決を追加
7. Teams の group 解決を追加
8. Frontend の group 表示 / link を追加
```

現在の実装では `season` / `competition` / `team` をサポートしている。
