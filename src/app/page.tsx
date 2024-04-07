"use client";
import { assignType } from "@/lib/openapi";
import { css } from "@styled-system/css";
import { useRouter } from "next/navigation";
import useSWR from "swr";

export default function Home() {
  const { data: userRes, isLoading } = useSWR("/users/me");
  const router = useRouter();
  const user = assignType("/users/me", userRes);
  if (isLoading) return;
  if (!user) return;
  if (user.role !== "general") {
    //TODO: projectsのページにリダイレクト
    //router.push("/committee/projects");
    return;
  }
  if (user.owned_project_id) {
    router.push("/dashboard");
    return;
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
