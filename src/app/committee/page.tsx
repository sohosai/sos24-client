"use client";
import { assignType } from "@/lib/openapi";
import { NextPage } from "next";
import { useRouter } from "next/navigation";
import useSWR from "swr";

const CommitteePage: NextPage = () => {
  const { data: userRes, isLoading, error } = useSWR("/users/me");
  const router = useRouter();
  const user = assignType("/users/me", userRes);
  if (isLoading) return;
  if (error) return <p>エラーが発生しました</p>;
  if (user.role === "general") {
    router.push("/");
  } else {
    //TODO: projectsのページにリダイレクト
    //router.push("/committee/projects");
  }

  return <></>;
};
export default CommitteePage;
