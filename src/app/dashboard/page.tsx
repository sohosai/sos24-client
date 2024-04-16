"use client";

import { NextPage } from "next";
import { NewsView } from "@/common_components/news/NewsView";
import { container, flex, stack } from "@styled-system/patterns";
import { Title } from "@/common_components/Title";
import Link from "next/link";
import Image from "next/image";

import pulldownIcon from "@/assets/Pulldown.svg";
import { css } from "@styled-system/css";
import { Project } from "./Project";
import { assignType } from "@/lib/openapi";
import useSWR from "swr";
import { useRouter } from "next/navigation";

const DashboardPage: NextPage = () => {
  const { data: userRes, isLoading, error } = useSWR("/users/me");
  const router = useRouter();
  const user = assignType("/users/me", userRes);
  if (isLoading) return;
  if (error) return <p>エラーが発生しました</p>;
  if (!user.owned_project_id) {
    router.push("/register");
    return;
  }
  return (
    <div className={container()}>
      <div className={stack({ gap: 8, marginY: 8 })}>
        <div className={stack({ gap: 6, alignItems: "center" })}>
          <div>
            <Title>お知らせ</Title>
          </div>
          <div className={flex({ position: "absolute", top: 24, justifyContent: "flex-end", width: "90%" })}>
            <Link
              href="/news"
              className={flex({
                backgroundColor: "sohosai.purple",
                borderRadius: 2,
                paddingX: 4,
                paddingY: 1,
                gap: 2,
              })}>
              <Image src={pulldownIcon} alt="" />
              <span
                className={css({
                  color: "white",
                  fontSize: "xs",
                  fontWeight: "bold",
                })}>
                お知らせ一覧へ
              </span>
            </Link>
          </div>
          <NewsView />
        </div>
        <div className={stack({ gap: 6, alignItems: "center" })}>
          <Project />
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
