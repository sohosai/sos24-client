"use client";

import { NextPage } from "next";
import useSWR from "swr";
import { assignType } from "@/lib/openapi";
import { container } from "@styled-system/patterns";
import { User } from "@/app/committee/users/[user_id]/User";
import { notFound } from "next/navigation";

const UserDetailsPage: NextPage<{
  params: { user_id: string };
}> = ({ params }) => {
  const { data, error, isLoading } = useSWR(`/users/${params.user_id}`);
  if (isLoading) {
    return;
  }
  if (error) {
    switch (error.name) {
      case "user/not-found":
        notFound();
      default:
        return <p>ユーザーの読み込み中に不明なエラーが発生しました。</p>;
    }
  }

  const user = assignType("/users/{user_id}", data);

  return (
    <div className={container({ maxWidth: "4xl" })}>
      <User user={user} />
    </div>
  );
};

export default UserDetailsPage;
