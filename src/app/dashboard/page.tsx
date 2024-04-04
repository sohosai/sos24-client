"use client";

import {NextPage} from "next";
import {NewsView} from "@/components/news/NewsView";
import {container, stack} from "@styled-system/patterns";
import {Title} from "@/components/Title";

const DashboardPage: NextPage = () => {
  return (
    <div className={container()}>
      <div className={stack({gap: 8, marginY: 8})}>
        <div className={stack({gap: 6})}>
          <div>
            <Title>お知らせ</Title>
          </div>
          <NewsView/>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
