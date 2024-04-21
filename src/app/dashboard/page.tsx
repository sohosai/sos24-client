"use client";

import { NextPage } from "next";
import { NewsView } from "@/common_components/news/NewsView";
import { container, flex, stack } from "@styled-system/patterns";
import { Title } from "@/common_components/Title";
import Link from "next/link";
import Image from "next/image";

import pulldownIcon from "@/assets/Pulldown.svg?url";
import { css } from "@styled-system/css";
import { Project } from "./Project";
import { assignType } from "@/lib/openapi";
import useSWR from "swr";
import { useRouter } from "next/navigation";

const DashboardPage: NextPage = () => {
  const {
    data: rawProjectData,
    error: projectErr,
    isLoading: projectIsLoading,
    // mutate: mutateProject,
  } = useSWR("/projects/me");
  const projectData = assignType("/projects/me", rawProjectData);

  const router = useRouter();
  if (projectIsLoading) return;
  if (projectErr) return <p>エラーが発生しました</p>;
  if (!projectData.id) {
    router.push("/register");
    return;
  }

  return (
    <>
      {/* <div */}
      {/*   className={css({ */}
      {/*     color: "white", */}
      {/*     background: "error", */}
      {/*     width: "100%", */}
      {/*     maxWidth: "40rem", */}
      {/*     marginInline: "auto", */}
      {/*     textAlign: "center", */}
      {/*     paddingY: 4, */}
      {/*   })}> */}
      {/*   まだ企画応募は完了していません */}
      {/* </div> */}
      <div className={container()}>
        <div className={stack({ gap: 8, marginY: 8 })}>
          <div className={stack({ gap: 6, alignItems: "center" })}>
            <div>
              <Title>企画応募</Title>
            </div>
            <Project />
          </div>
          <div className={stack({ gap: 6, alignItems: "center" })}>
            <div>
              <Title>お知らせ</Title>
            </div>
            <div className={flex({ position: "relative", top: 14, justifyContent: "flex-end", width: "90%" })}>
              <Link
                href="/news"
                className={flex({
                  backgroundColor: "tsukuba.purple",
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
        </div>
      </div>
    </>
  );
};

export default DashboardPage;
