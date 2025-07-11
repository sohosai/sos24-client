# 年度別タイトル機能 (Year-based Title Feature)

このドキュメントでは、環境変数を使ってアプリケーションのタイトルを年度や環境に応じて変更する機能について説明します。

## 概要

この機能により、以下のことが可能になります：
- ページタイトルに「2025年度版」「develop」「Beta」などのサフィックスを追加
- ヘッダーのロゴの下に年度情報を表示

## 環境変数

### NEXT_PUBLIC_APP_TITLE_SUFFIX

アプリケーションタイトルにサフィックスを追加します。

**例：**
```bash
# 年度版
NEXT_PUBLIC_APP_TITLE_SUFFIX=" - 2025年度版"
# 結果: "雙峰祭オンラインシステム - 2025年度版"

# 開発環境
NEXT_PUBLIC_APP_TITLE_SUFFIX=" - develop"
# 結果: "雙峰祭オンラインシステム - develop"

# ベータ版
NEXT_PUBLIC_APP_TITLE_SUFFIX=" - Beta"
# 結果: "雙峰祭オンラインシステム - Beta"

# サフィックスなし（デフォルト）
NEXT_PUBLIC_APP_TITLE_SUFFIX=""
# 結果: "雙峰祭オンラインシステム"
```

### NEXT_PUBLIC_APP_YEAR

ヘッダーのロゴの下に表示される年度情報を設定します。

**例：**
```bash
# 年度表示
NEXT_PUBLIC_APP_YEAR="2025年度"

# 和暦表示
NEXT_PUBLIC_APP_YEAR="令和7年度"

# 環境表示
NEXT_PUBLIC_APP_YEAR="開発環境"
NEXT_PUBLIC_APP_YEAR="ベータ版"

# 年度情報なし（デフォルト）
NEXT_PUBLIC_APP_YEAR=""
```

## 使用方法

### 1. 本番環境（2025年度版）
```bash
NEXT_PUBLIC_APP_TITLE_SUFFIX=" - 2025年度版"
NEXT_PUBLIC_APP_YEAR="2025年度"
```

### 2. 開発環境
```bash
NEXT_PUBLIC_APP_TITLE_SUFFIX=" - develop"
NEXT_PUBLIC_APP_YEAR="開発環境"
```

### 3. ベータ環境
```bash
NEXT_PUBLIC_APP_TITLE_SUFFIX=" - Beta"
NEXT_PUBLIC_APP_YEAR="ベータ版"
```

### 4. デフォルト（サフィックスなし）
```bash
# 環境変数を設定しないか空文字を設定
NEXT_PUBLIC_APP_TITLE_SUFFIX=""
NEXT_PUBLIC_APP_YEAR=""
```

## 技術的詳細

### 実装ファイル

- `src/lib/appTitle.ts` - タイトル生成のユーティリティ関数
- `src/app/layout.tsx` - ページメタデータのタイトル設定
- `src/common_components/header/Header.tsx` - ヘッダー表示

### 関数

- `getAppTitle()` - サフィックス付きのタイトルを取得
- `getBaseTitle()` - ベースタイトル「雙峰祭オンラインシステム」を取得  
- `getAppYear()` - 年度情報を取得

### テスト

```bash
# テスト実行
npm test src/lib/appTitle.test.ts
```

## 注意事項

- 環境変数は `NEXT_PUBLIC_` プレフィックスが必要（クライアントサイドで使用するため）
- 変更は再ビルド後に反映されます
- 両方の環境変数は独立して設定可能です

## 例

| 環境 | TITLE_SUFFIX | APP_YEAR | 結果タイトル | ヘッダー年度表示 |
|------|--------------|----------|-------------|---------------|
| 本番 | " - 2025年度版" | "2025年度" | "雙峰祭オンラインシステム - 2025年度版" | "2025年度" |
| 開発 | " - develop" | "開発環境" | "雙峰祭オンラインシステム - develop" | "開発環境" |
| ベータ | " - Beta" | "ベータ版" | "雙峰祭オンラインシステム - Beta" | "ベータ版" |
| デフォルト | "" | "" | "雙峰祭オンラインシステム" | （表示なし） |