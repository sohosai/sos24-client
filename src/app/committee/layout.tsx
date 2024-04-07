import { assignType } from "@/lib/openapi";
import { useRouter } from "next/navigation";
import useSWR from "swr";

const CommitteeLayout = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  const { data: userRes, isLoading, error } = useSWR("/users/me");
  const router = useRouter();
  const user = assignType("/users/me", userRes);
  if (isLoading) return;
  if (error) return <p>エラーが発生しました</p>;
  if (user.role === "general") {
    router.push("/dashboard");
  }

  return <div>{children}</div>;
};

export default CommitteeLayout;
