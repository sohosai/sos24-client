"use client";

import { css } from "@styled-system/css";
import { Title } from "@/common_components/Title";
import { stack } from "@styled-system/patterns";
import { RegistrationProgress } from "@/common_components/RegistrationProgress";
import useSWR from "swr";
import { useRouter } from "next/navigation";
import { assignType } from "@/lib/openapi";
import { useAtomValue } from "jotai";
import { projectApplicationPeriodAtom } from "@/lib/projectApplicationPeriod";
import dynamic from "next/dynamic";

const RegisterPage = () => {
  const { data: userRes, isLoading: userIsLoading, error: userError } = useSWR("/users/me");
  const router = useRouter();
  const user = assignType("/users/me", userRes);
  const applicationPeriod = useAtomValue(projectApplicationPeriodAtom);
  if (userIsLoading) return;
  if (userError) return <p>エラーが発生しました</p>;
  if (user.owned_project_id) {
    router.push("/dashboard");
  }
  const RegisterForm = dynamic(() => import("@/app/register/RegisterForm"));
  return (
    <div>
      <div
        className={stack({
          alignItems: "center",
          gap: 8,
          marginY: 8,
        })}>
        <Title>企画登録</Title>
        {applicationPeriod.isIn ? (
          <>
            <div
              className={css({
                backgroundColor: "gray.700",
                width: "full",
                paddingY: 2,
                paddingX: 2,
                fontSize: "sm",
                fontWeight: "bold",
                color: "white",
                textAlign: "center",
                sm: {
                  display: "flex",
                  justifyContent: "center",
                  maxWidth: "4xl",
                },
              })}>
              <p>企画応募はすべて企画責任者が行ってください。</p>
              <p>副責任者が代理で行うことができません。</p>
            </div>
            <div
              className={css({
                maxWidth: "4xl",
                mx: "auto",
                display: "flex",
                flexDir: "column",
                alignItems: "center",
                gap: "8",
              })}>
              <RegisterForm />
              <RegistrationProgress step={1} />
            </div>
          </>
        ) : (
          <p
            className={css({
              color: "gray.400",
              fontSize: "lg",
              fontWeight: "bold",
              marginTop: 24,
              textAlign: "center",
            })}>
            募集期間外です
          </p>
        )}
      </div>
    </div>
  );
};

export default RegisterPage;
