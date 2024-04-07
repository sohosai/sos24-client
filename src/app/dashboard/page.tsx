"use client";

import { NextPage } from "next";
import { NewsView } from "@/components/news/NewsView";
import { container, flex, stack, vstack } from "@styled-system/patterns";
import { Title } from "@/components/Title";
import Link from "next/link";
import Image from "next/image";

import pulldownIcon from "../../components/assets/Pulldown.svg";
import { css } from "@styled-system/css";
import { useState } from "react";
import { Button } from "@/components/Button";
import { ProjectView } from "./ProjectView";

const Project: React.FC = () => {
  const [editable, setEditable] = useState(false);
  return (
    <>
      <Title>企画情報</Title>
      <div className={vstack({})}>
        {!editable && (
          <Button color="blue" className={css({ alignSelf: "end" })} onClick={() => setEditable((e) => !e)}>
            {editable ? "保存" : "編集"}する
          </Button>
        )}
        <ProjectView isEditMode={editable} onSubmit={() => setEditable(false)} />
      </div>
    </>
  );
};

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
        <div className={stack({ gap: 6, alignItems: "center" })}>
          <Project />
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
