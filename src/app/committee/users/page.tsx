"use client";

import { NextPage } from "next";
import { center, container, stack } from "@styled-system/patterns";
import { css } from "@styled-system/css";
import useSWR from "swr";
import { assignType } from "@/lib/openapi";
import { UserList } from "@/app/committee/users/UserList";

const UserPage: NextPage = () => {
  const { data, error, isLoading } = useSWR("/users");
  if (isLoading) {
    return;
  }
  if (error) {
    return <p>ユーザーの読み込み中に不明なエラーが発生しました。</p>;
  }

  const userList = assignType("/users", data);

  return (
    <div className={container({ maxWidth: "4xl" })}>
      <div className={stack({ gap: 8, marginY: 8 })}>
        <h2 className={css({ fontSize: "2xl", fontWeight: "bold" })}>ユーザー一覧</h2>
        <div className={center()}>
          <div className={css({ width: "90%" })}>
            <UserList userList={userList} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserPage;
