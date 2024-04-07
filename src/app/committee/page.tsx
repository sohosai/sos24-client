"use client";
import { assignType } from "@/lib/openapi";
import { useRouter } from "next/navigation";
import { FC } from "react";
import useSWR from "swr";

const Committee: FC = () => {
  const { data: userRes, isLoading } = useSWR("/users/me");
  const router = useRouter();
  const user = assignType("/users/me", userRes);
  if (!isLoading) {
    if (!user) return;
    if (user.role === "general") {
      router.push("/");
      return;
    } else {
      //TODO: projectsのページにリダイレクト
      //router.push("/committee/projects");
    }
  }

  return <></>;
};
export default Committee;
