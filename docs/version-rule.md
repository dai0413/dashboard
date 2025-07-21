## バージョン更新ルール

- PATCH：バグ修正や UI 調整など微細な変更
- MINOR：新機能を追加（後方互換性あり）
- MAJOR：破壊的変更（互換性なし）

更新のたびに `package.json` と `CHANGELOG.md` を更新し、必要なら Git tag を打つ。
