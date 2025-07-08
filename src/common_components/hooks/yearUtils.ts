"use client";
import { useEffect, useState } from "react";

/**
 * 現在の年度・バージョンを判定するユーティリティ関数群
 */

const YEAR_BASE = 2000; // サブドメインから年度を計算するための基準年
const DEVELOP_DISPLAY = "Develop";

// 開発環境のホスト名パターン
const DEVELOPMENT_HOSTNAMES = ["localhost", "127.0.0.1", "develop"];

/**
 * 年度情報をクライアントサイドでレンダリングするフック
 * ドメイン名、環境変数、開発環境の判定により適切な年度を決定する
 * @returns {Object} 年度データとローディング状態
 */
export const useCurrentYear = () => {
  const [year, setYear] = useState<number | string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const determineYear = () => {
      const hostname = window.location.hostname;

      const domainYearMatch = hostname.match(/sos(\d{2})\./);
      if (domainYearMatch) {
        const shortYear = parseInt(domainYearMatch[1], 10);
        return YEAR_BASE + shortYear;
      }

      if (DEVELOPMENT_HOSTNAMES.some((devHost) => hostname.includes(devHost))) {
        if (process.env.NEXT_PUBLIC_YEAR) {
          return parseInt(process.env.NEXT_PUBLIC_YEAR, 10);
        }
        return DEVELOP_DISPLAY;
      }

      if (process.env.NEXT_PUBLIC_YEAR) {
        return parseInt(process.env.NEXT_PUBLIC_YEAR, 10);
      }

      return DEVELOP_DISPLAY;
    };

    const currentYear = determineYear();
    setYear(currentYear);
    setIsLoading(false);
  }, []);

  return { year, isLoading };
};

/**
 * 年度表示文字列をクライアントサイドでレンダリングするフック
 * 開発環境では"Develop"、本番環境では"2024年度版"形式で表示
 * @returns {Object} フォーマットされた年度文字列とローディング状態
 */
export const useYearDisplayString = () => {
  const { year, isLoading } = useCurrentYear();
  const [displayString, setDisplayString] = useState<string>("");

  useEffect(() => {
    if (!isLoading && year !== null) {
      if (year === DEVELOP_DISPLAY) {
        setDisplayString(DEVELOP_DISPLAY);
      } else {
        setDisplayString(`${year}年度版`);
      }
    }
  }, [year, isLoading]);

  return { displayString, isLoading };
};

/**
 * 年度付きタイトルをクライアントサイドでレンダリングするフック
 * 雙峰祭オンラインシステムの固定タイトルに年度表示を追加
 * @returns {Object} 年度付きタイトルとローディング状態
 */
export const useTitleWithYear = () => {
  const { displayString, isLoading } = useYearDisplayString();
  const [title, setTitle] = useState<string>("");

  useEffect(() => {
    if (!isLoading && displayString) {
      setTitle(`雙峰祭オンラインシステム - ${displayString}`);
    }
  }, [displayString, isLoading]);

  return { title, isLoading };
};
