"use client";

import { LoadingUI } from "@/components/LoadingUI";
import { assignType } from "@/lib/openapi";
import { css } from "@styled-system/css";
import { useRouter } from "next/navigation";
import useSWR from "swr";

export default function Home() {
  const { data: userRes, isLoading, error } = useSWR("/users/me");
  const router = useRouter();
  const user = assignType("/users/me", userRes);
  if (isLoading) return <LoadingUI />;
  if (error) return <p>エラーが発生しました</p>;
  if (user.role !== "general") {
    //TODO: projectsのページにリダイレクト
    //router.push("/committee/projects");
  }
  if (user.owned_project_id) {
    router.push("/dashboard");
  } else {
    router.push("/register");
  }

  return (
    <div
      className={css({
        padding: 5,
      })}>
      Hello, World!
    </div>
  );
}
