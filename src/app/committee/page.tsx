"use client";
import { assignType } from "@/lib/openapi";
import { NextPage } from "next";
import { useRouter } from "next/navigation";
import useSWR from "swr";

const CommitteePage: NextPage = () => {
  const { data: userRes, isLoading } = useSWR("/users/me");
  const router = useRouter();
  const user = assignType("/users/me", userRes);
  if (isLoading) return;
  if (!user) return;
  if (user.role === "general") {
    router.push("/");
    return;
  } else {
    //TODO: projectsのページにリダイレクト
    //router.push("/committee/projects");
  }

  return <></>;
};
export default CommitteePage;
