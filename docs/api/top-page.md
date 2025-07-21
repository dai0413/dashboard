## 1. 概要

| メソッド | エンドポイント     | 説明                       | バリデーション | フロント |
| -------- | ------------------ | -------------------------- | -------------- | -------- |
| `GET`    | `/api/v1/top-page` | トップページ用のデータ配列 | なし           | /        |

## 2. リクエスト・レスポンス例

### 2.1 ``

- レスポンス

```json
{
  "transferData": [
    {
      "_id": "687dd3215c9211dd966e3254",
      "doa": "2025-07-21T00:00:00.000Z",
      "from_team": {
        "_id": "685fe9e1bdafffc53f471947",
        "team": "栃木SC",
        "abbr": "栃木",
        "enTeam": "Tochigi SC",
        "country": "日本",
        "genre": "club",
        "jdataid": 40,
        "labalph": "/toch/",
        "transferurl": "https://www.transfermarkt.jp/tochigi-sc/startseite/verein/22179",
        "sofaurl": ""
      },
      "to_team": {
        "_id": "685fe9e1bdafffc53f47196b",
        "team": "ラインメール青森",
        "abbr": "青森",
        "enTeam": "",
        "country": "日本",
        "genre": "club",
        "jdataid": null,
        "labalph": "",
        "transferurl": "https://www.transfermarkt.jp/reinmeer-aomori/startseite/verein/37315",
        "sofaurl": ""
      },
      "player": {
        "_id": "68516bd288294f93ffd0bf59",
        "name": "小堀　空",
        "en_name": "Sora KOBORI",
        "dob": "2002-12-16T15:00:00.000Z",
        "pob": "栃木県",
        "__v": 0
      },
      "position": ["CF"],
      "form": "育成型期限付き",
      "from_date": "2025-07-21T00:00:00.000Z",
      "to_date": "2026-01-31T00:00:00.000Z",
      "URL": ["https://www.tochigisc.jp/news/1035"],
      "__v": 0
    }
  ],
  "injuryData": [
    {
      "_id": "687dd1f35c9211dd966e3239",
      "doa": "2025-07-21T00:00:00.000Z",
      "now_team": "685fe9e1bdafffc53f47192a",
      "player": {
        "_id": "68516bd288294f93ffd0d1f8",
        "name": "渡邊　泰基",
        "en_name": "Taiki WATANABE",
        "dob": "1999-04-21T15:00:00.000Z",
        "pob": "新潟県",
        "__v": 0
      },
      "doi": "2025-07-12T00:00:00.000Z",
      "dos": "2025-07-18T00:00:00.000Z",
      "injured_part": ["左膝外側半月板損傷"],
      "is_injured": true,
      "ttp": ["6m"],
      "URL": ["https://www.f-marinos.com/news/team/8947"],
      "erd": "2026-01-12T00:00:00.000Z",
      "__v": 0,
      "team": {
        "_id": "685fe9e1bdafffc53f47192a",
        "team": "横浜F・マリノス",
        "abbr": "横浜FM",
        "enTeam": "Yokohama F･Marinos",
        "country": "日本",
        "genre": "club",
        "jdataid": 5,
        "labalph": "/y-fm/",
        "transferurl": "https://www.transfermarkt.jp/yokohama-f-marinos/startseite/verein/3828",
        "sofaurl": ""
      }
    }
  ]
}
```
