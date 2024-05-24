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

const newsId = "<uuid>";

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

## スキーマの更新

schema.ymlを更新したのち、以下のコマンドを実行してください

```shell
npm run gen
npm run format
```

現在はopenapi-typescriptのバグ（ https://github.com/drwpow/openapi-typescript/issues/1464
）により、正しい型定義が生成されません。そのため、以下のコマンドを実行して型定義を修正してください。

```shell
sed -i '/type: "FormItem";/d' ./src/schema.d.ts
sed -i '/type: "NewFormItem";/d' ./src/schema.d.ts
sed -i 's/Omit<components\["schemas"\]\["FormItemKind"\], "type">/components["schemas"]["FormItemKind"]/' ./src/schema.d.ts
```

```mermaid
classDiagram
  SOSに存在するエンティティ --|> ユーザー
  SOSに存在するエンティティ --|> 企画
  SOSに存在するエンティティ --|> 申請
  SOSに存在するエンティティ --|> 申請回答
  SOSに存在するエンティティ --|> お知らせ
  SOSに存在するエンティティ --|> 招待
  SOSに存在するエンティティ --|> ファイル
  class SOSに存在するエンティティ {
    ※持っているフィールドはOpenAPIのスキーマを参照のこと
    ・ユーザー
    ・企画
    ・申請
    ・申請回答
    ・お知らせ
    ・招待
    ・ファイル
  }

  class ユーザー {
    ・募集要項に準拠
    ・筑波大学の学群生・大学院生・教員のみ
    ・ID
    ・名前
    ・名前-ふりがな-
    ・メールアドレス
    ・電話番号
    ・権限
    ・作成日
    ・更新日
  }

  class 企画 {
    ・募集要項に準拠
    ・ID
    ・企画番号
    ・企画名
    ・企画名-ふりがな-
    ・企画団体名
    ・企画団体名-ふりがな-
    ・企画区分
    ・企画属性
    ・企画責任者
    ・副企画責任者
    ・作成日
    ・更新日
  }

  class 申請 {
    ・ID
    ・申請名
    ・説明
    ・回答開始日時
    ・回答終了日時
    ・対象企画区分
    ・対象企画属性
    ・通知済みかどうか
    ・項目
    ・添付ファイル
    ・作成日
    ・更新日
  }

  class 申請回答 {
    ・ID
    ・回答企画ID
    ・申請ID
    ・回答項目
    ・作成日
    ・更新日
  }

  class お知らせ {
    ・ID
    ・タイトル
    ・本文
    ・添付ファイル
    ・対象企画区分
    ・対象企画属性
    ・作成日
    ・更新日
  }

  class 招待 {
    ・ID
    ・招待者
    ・招待先の企画
    ・招待祭のポジション
    ・招待を受け取ったユーザー
    ・作成日
    ・更新日
  }

  class ファイル {
    ・ID
    ・ファイル名
    ・S3におけるオブジェクトキー
    ・作成企画
    ・作成日
    ・更新日
  }
```

```mermaid
classDiagram
  %% ユーザー　%%
  ユーザー --|>ID
  ユーザー --|>名前
  ユーザー --|>名前-ふりがな-
  ユーザー --|>メールアドレス
  ユーザー --|>電話番号
  ユーザー --|>権限
  ユーザー --|>作成日
  ユーザー --|>更新日
  class ユーザー {
    ・募集要項に準拠
    ・筑波大学の学群生・大学院生・教員のみ
    ・ID
    ・名前
    ・名前-ふりがな-
    ・メールアドレス
    ・電話番号
    ・権限
    ・作成日
    ・更新日
  }

  class ID {
    ・UUID
  }

  class 名前 {
    ・文字列
    ・制約なし
  }

  class 名前-ふりがな- {
    ・文字列
    ・制約なし
  }

  class メールアドレス {
    ・文字列
    ・@*.tsukuba.ac.jpのメールアドレスで、かつ有効なフォーマットでなければならない
  }

  class 電話番号 {
    ・文字列
    ・本来は
  }

  class 権限 {
    ・enum
  }

  権限 --|>enum
  class enum {
    ・一般人
    ・実委人
    ・実委人-管理者-
    ・SOS管理者
  }

  class 作成日 {
    ・datetime
  }

  class 更新日 {
    ・datetime
  }
```

```mermaid
classDiagram
  %% 企画 %%
  企画 --|>ID
  企画 --|>企画番号
  企画 --|>企画名
  企画 --|>企画名-ふりがな-
  企画 --|>企画団体名
  企画 --|>企画団体名-ふりがな-
  企画 --|>企画区分
  企画 --|>企画属性
  企画 --|>企画責任者
  企画 --|>副企画責任者
  企画 --|>作成日
  企画 --|>更新日
  class 企画 {
    ・募集要項に準拠
    ・ID
    ・企画番号
    ・企画名
    ・企画名-ふりがな-
    ・企画団体名
    ・企画団体名-ふりがな-
    ・企画区分
    ・企画属性
    ・企画責任者
    ・副企画責任者
    ・作成日
    ・更新日
  }

  class ID {
    ・UUID
  }

  class 企画番号 {
    ・数値
    ・一意
  }

  class 企画名 {
    ・文字列
    ・最大20文字
    ・半角英数字、半角記号、全角数字、全角英語は3文字で2文字として扱う
    ・絵文字を含んではいけない
  }

  class 企画名-ふりがな- {
    ・文字列
    ・制約なし
  }

  class 企画団体名 {
    ・文字列
    ・最大20文字
    ・半角英数字、半角記号、全角数字、全角英語は3文字で2文字として扱う
    ・絵文字を含んではいけない
  }
  class 企画団体名-ふりがな- {
    ・文字列
    ・制約なし
  }

  class 企画区分 {
    ・enum
    ・1つの企画が1つのみ持つ
  }

  企画区分 --|>enum
  class enum {
    ・普通企画
    ・調理企画-仕込場必要-
    ・調理企画-仕込場不要-
    ・既製食品販売企画
    ・ステージ企画-UNITEDステージ-
    ・ステージ企画-1Aステージ-
    ・ステージ企画-大学会館ステージ-
  }

  class 企画属性 {
    ・enum配列
    ・1つの企画が1つ以上持ちうる
  }

  企画属性 --|>enum配列
  class enum配列 {
    ・学術認定企画
    ・委員会開催企画
    ・芸術祭参加企画
    ・屋内企画
    ・屋外企画
  }

  class 企画責任者 {
    ・UUID
    ・ユーザーID
  }

  class 副企画責任者 {
    ・UUID (nullable)
    ・ユーザーID
  }

  class 作成日 {
    ・datetime
  }

  class 更新日 {
    ・datetime
  }

  class enum {
  }
```




```mermaid
classDiagram
招待--|>ID
招待--|>招待者
招待--|>招待先の企画
招待--|>招待先のポジション
招待--|>招待を受け取ったユーザー
招待--|>作成日
招待--|>更新日
招待先のポジション--|>enum

 class 招待 {
 ・ID
 ・招待者
 ・招待先の企画
 ・招待先のポジション
 ・招待を受け取ったユーザー
 ・作成日
 ・更新日
  }
 class ID {
　・UUID
 }

 class 招待者 {
 ・UUID
 ・ユーザーID
 }

 class 招待先の企画 {
 ・UUID
 ・企画ID
 }

 class 招待先のポジション{
 ・enum
 }

 class 招待を受け取ったユーザー{
 ・UUID(nullable)
 ・ユーザーID
 }

 class 作成日{
 ・datetime
 }
 
 class 更新日{
 ・datetime
 }

 class enum{
 ・企画責任者
 ・副企画責任者
 }

```
