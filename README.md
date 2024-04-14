# sos24-client

[![CD(beta)](https://github.com/sohosai/sos24-client/actions/workflows/cd-beta.yml/badge.svg)](https://github.com/sohosai/sos24-client/actions/workflows/cd-beta.yml)

雙峰祭オンラインシステムのクライアントです。

## 環境構築

### 環境変数
`.env.example`を参考にFirebase・バックエンドURLを設定します。

### セットアップ
`npm i`で依存関係がインストールされます。

`npm run dev`で開発用サーバが起動します。

### ビルド
`npm run build`でビルドできます

Cloudflare Pagesにデプロイする場合は`npx @cloudflare/next-on-pages@1`で静的アセットを生成できます。

## APIからのresponseにスキーマに応じた型を付ける方法
### SWRを使ってGETするとき編

```typescript
import { assignType } from "@/lib/openapi";
  
const newsId = "<uuid>"

const { data: newsRes, error: newsErr, isLoading } = useSWR(`/news/${newsId}`);
if (isLoading) {
  // 読み込み時の処理
}
if (newsErr) {
  // エラー時の処理
}
const news = assignType("/news/{news_id}", newsRes);
```

path parametersはurlに文字列として直接埋め込みます。

`assignType`には、openapiで定義されているパスと`newsRes`を渡します。

## APIを安全に叩く方法(post、putなど)

openapi-fetchを使います。

## ベータについて
[GitHub Actions](https://github.com/sohosai/sos24-client/actions/workflows/cd-beta.yml)を手動実行することでベータをデプロイできます。
