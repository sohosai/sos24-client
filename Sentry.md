# Sentryを開発環境で利用するための準備等

## Setup

`.sentryclirc`と`.env`を作成し、必要な情報を記述する。

※ `.sentryclirc.example`と`.env.exmaple`を参考にしてください。

> [!CAUTION]
> `.sentryclirc`と`.env`は、絶対にpushしてはいけません。

## Sentryの通知について

Sentryの通知について、開発環境と本番環境の2つのプロジェクト(`sos24-client-dev`と`sos24-client-prod`)を用意しています。

[開発環境 (プロジェクト名: `sos24-client-dev`)]

`.env`ファイルにdsnとプロジェクト名を書き、`.sentryclirc`に適切な情報を書くと、Sentryが`sos24-client-dev`で通知をしてくれます。

[本番環境 (プロジェクト名: `sos24-client-prod`)]

確認はしていませんが、本番環境でSentryが`sos24-client-prod`で通知をしてくれるはずです。(未確認)
