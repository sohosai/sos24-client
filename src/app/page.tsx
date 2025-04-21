"use client";

import { container, stack } from "@styled-system/patterns";
import { Title } from "@/common_components/Title";
import { css } from "@styled-system/css";
import Link from "next/link";
import { useAtomValue } from "jotai";
import { projectApplicationPeriodAtom } from "@/lib/projectApplicationPeriod";
import useSWR from "swr";
import { assignType } from "@/lib/openapi";
import { useRouter } from "next/navigation";

export default function Home() {
  const { isIn } = useAtomValue(projectApplicationPeriodAtom);
  const router = useRouter();
  const { data: userRes, isLoading: userIsLoading } = useSWR("/users/me");
  const userInfo = !userIsLoading ? assignType("/users/me", userRes) : undefined;
  if (userIsLoading) return;
  if (!isIn) {
    if (userInfo?.owned_project_id) router.push("/dashboard");
    else router.push("/register");
  }
  return (
    <div className={container()}>
      <div className={stack({ gap: 6, marginY: 8 })}>
        <div>
          <Title>第50回筑波大学学園祭 企画募集</Title>
        </div>
        <div className={stack({ gap: 3 })}>
          <div>
            <p>筑波大学学園祭「雙峰祭」の企画を募集いたします。</p>
            <p>企画に応募される方は、募集要項をご確認の上、企画募集期間中にご応募ください。</p>
          </div>
          <div>
            <p>募集要項は<a href="https://sohosai.com/news/#application-2025" target="_blank">公式ウェブサイトのお知らせ</a>をご覧ください。</p>
          </div>
          <div>
            <p>応募方法</p>
            <p>
              <Link
                href="/register"
                className={css({
                  color: "tsukuba.purple",
                  textDecoration: "underline",
                  cursor: "pointer",
                })}>
                こちら
              </Link>
              よりご応募いただけます。
            </p>
            <p>アカウント作成方法を以下のリンクにて動画でご案内しております。</p>
            <p>
              <Link
                href="/how-to-use"
                className={css({
                  color: "tsukuba.purple",
                  textDecoration: "underline",
                  cursor: "pointer",
                })}>
                使い方動画（参考）
              </Link>
            </p>
          </div>
          <div>
            <p>学園祭実行委員会一同、素晴らしい雙峰祭を皆様と築いていけることを心より楽しみにしております。</p>
            <p>ご応募お待ちしております。</p>
          </div>
        </div>
      </div>
    </div>
  );
}
