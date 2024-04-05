"use client";

import { NextPage } from "next";
import { NewsView } from "@/components/news/NewsView";
import { container, flex, stack } from "@styled-system/patterns";
import { Title } from "@/components/Title";
import Link from "next/link";
import Image from "next/image";

import pulldownIcon from "../../components/assets/Pulldown.svg";
import { css } from "@styled-system/css";
import { ProjectView } from "@/app/dashboard/ProjectView";

const DashboardPage: NextPage = () => {
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
        <Title>企画情報</Title>
        <ProjectView />
      </div>
    </div>
  );
};

export default DashboardPage;
