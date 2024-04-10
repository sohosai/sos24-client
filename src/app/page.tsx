"use client";
import { assignType } from "@/lib/openapi";
import { useRouter } from "next/navigation";
import useSWR from "swr";

export default function Home() {
  const { data: userRes, isLoading, error } = useSWR("/users/me");
  const router = useRouter();
  const user = assignType("/users/me", userRes) ?? undefined;
  if (isLoading || !user) return;
  if (error) return <p>エラーが発生しました</p>;
  if (user.role !== "general") {
    router.push("/committee");
    return;
  }
  if (user.owned_project_id) {
    router.push("/dashboard");
    return;
  } else {
    router.push("/register");
    return;
  }
}
