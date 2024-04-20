"use client";

import { center, container, stack } from "@styled-system/patterns";
import { css } from "@styled-system/css";
import { NewsView } from "@/common_components/news/NewsView";
import { NextPage } from "next";
import { useAtomValue } from "jotai";
import { projectApplicationPeriodAtom } from "@/lib/projectApplicationPeriod";
import { useRouter } from "next/navigation";

const NewsPage: NextPage = () => {
  const router = useRouter();
  const applicationPeriod = useAtomValue(projectApplicationPeriodAtom);
  if (applicationPeriod.isIn) {
    router.push("/dashboard");
    return;
  }

  return (
    <div className={container()}>
      <div className={stack({ gap: 8, marginY: 8 })}>
        <h2 className={css({ fontSize: "2xl", fontWeight: "bold" })}>お知らせ一覧</h2>
        <div className={center()}>
          <div className={css({ width: "90%" })}>
            <NewsView />
          </div>
        </div>
      </div>
    </div>
  );
};

export default NewsPage;
