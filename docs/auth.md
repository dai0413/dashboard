# 認証

- [認証](#認証)
  - [アクセストークン](#アクセストークン)
  - [リフレッシュトークン](#リフレッシュトークン)
  - [フロントエンドでの認証フロー](#フロントエンドでの認証フロー)

認証許可されたユーザーはログイン状態となり詳細データ閲覧可能
アクセストークンの期限が切れるとリフレッシュトークンを送って新規発行

## アクセストークン

- **用途**: 各種 API リクエストにおいてユーザー認証を行うためのトークン
- **保存場所**:http リクエストのヘッダー
- **有効期限**:`.env` に `JWT_EXPIRATION="1h"`のように記載

```

{
   Authorization: Bearer {アクセストークン}
}

```

## リフレッシュトークン

- **用途**:アクセストークンが期限切れになったとき、新しいアクセストークンを発行するためのトークン
- **保存場所**:クライアントの HTTP-only cookie
- **有効期限**:`.env` に `JWT_REFRESH_EXPIRATION="30d"`ように記載

---

## フロントエンドでの認証フロー

1. `/login`, `/register` でログイン成功時
   - アクセストークン取得　[api 参照](/docs/api/auth.md/#42-post--apiv1authlogin)
   - このアクセストークンを `AuthContext` に保存
1. ユーザー制御ページにて
   - `AuthContext` のアクセストークンを使って認証チェック　 → 　 OK ならデータ表示
   - アクセストークン失効なら再取得 [api 参照](/docs/api/auth.md/#45-post--apiv1authrefresh)
1. `/logout` 成功時 [api 参照](/docs/api/auth.md/#43-post--apiv1authlogout)
   - サーバーにリクエスト [api 参照](/docs/api/auth.md/#43-post--apiv1authlogout)
   - `AuthContext` を初期化
