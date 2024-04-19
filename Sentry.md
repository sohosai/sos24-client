# Sentryを開発環境で利用するための準備等

## Setup

1. `.sentryclirc`を作成し、必要な情報を記述する。

- `.sentryclirc.example`を参考にしてください。

> [!CAUTION]
> `.sentryclirc`は、絶対にpushしてはいけません。

2. 正常にエラーが通知できているかの確認をする。

- `npm run dev`でローカルサーバーを起動し、`/sentry-example-page`のパスにアクセスします。

- `Throw error!`と書かれたボタンを押します。

- 正常に通知できていたら成功です。

## 注意事項

> [!IMPORTANT]
> ブラウザの拡張機能である`uBlock Origin`を入れている人は、無効にしてから開発を始めてください。無効にしない場合、正常に通知ができない可能性があります。
