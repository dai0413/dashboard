# CHANGELOG

### v2.2.0

#### 新規モデル追加

- [27. スタッフ登録(Staff-Registration)]
- [28. スタッフ登録履歴(Staff-RegistrationHistory)]

### v2.1.0

#### フィールド追加

- match モデル
  - name フィールド追加
- team モデル
  - normalized_name フィールド追加
- player モデル , staff モデル , referee モデル
  - normalized_en_name フィールド追加

### v1.1.0

#### 新規モデル追加

- [19. 試合イベント(Match-Event-Type)]
- [20. フォーメーション(Formation)]
- [21. 監督・コーチ(Manager)]
- [22. 選手の出場履歴(Player-Appearance)]
- [23. 監督・コーチの出場履歴(Manager-Appearance)]
- [24. 選手の試合イベントログ(Player-Match-Event-Log)]
- [25. 監督・コーチの試合イベントログ(Staff-Match-Event-Log)]
- [26. 試合でのフォーメーション(Team-Match-Formation)]

### v1.0.10

#### README.md, CHANGELOG.md 追加

### v1.0.8

#### types/field.ts 拡張

- FilterField に filterKey を追加, key と異なる文字列で filter を操作
