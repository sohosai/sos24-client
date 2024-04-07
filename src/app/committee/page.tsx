"use client";
import { assignType } from "@/lib/openapi";
import { useRouter } from "next/navigation";
import { FC, useEffect } from "react";
import useSWR from "swr";

const Committee: FC = () => {
  const { data: userRes } = useSWR("/users/me");
  const router = useRouter();
  console.log(userRes);
  const user = assignType("/users/me", userRes);
  useEffect(() => {
    if (!user) return;
    if (user.role === "general") {
      router.push("/");
      return;
    } else {
      //TODO: projectsのページにリダイレクト
      //router.push("/committee/projects");
    }
  }, [user]);
  return <></>;
};
export default Committee;
