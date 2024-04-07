"use client";

import { css } from "@styled-system/css";
import { Title } from "@/components/Title";
import { RegisterForm } from "@/app/register/RegisterForm";
import { container, stack } from "@styled-system/patterns";
import { RegistrationProgress } from "@/components/RegistrationProgress";
import useSWR from "swr";
import { useRouter } from "next/navigation";
import { assignType } from "@/lib/openapi";
import { useEffect } from "react";

const RegisterPage = () => {
  const { data: userRes } = useSWR("/users/me");
  const router = useRouter();

  const user = assignType("/users/me", userRes);
  useEffect(() => {
    if (!user) return;
    if (user.owned_project_id) {
      router.push("/");
    }
  }, [user]);
  return (
    <div
      className={container({
        maxWidth: "4xl",
      })}>
      <div
        className={stack({
          alignItems: "center",
          gap: 8,
          marginY: 8,
        })}>
        <Title>企画登録</Title>
        <div
          className={css({
            backgroundColor: "gray.700",
            textAlign: "center",
            width: "full",
            paddingY: 2,
          })}>
          <p
            className={css({
              fontSize: "sm",
              fontWeight: "bold",
              color: "white",
            })}>
            企画応募はすべて企画責任者が行ってください。副責任者が代理で行うことができません。
          </p>
        </div>
        <RegisterForm />
        <RegistrationProgress step={1} />
      </div>
    </div>
  );
};

export default RegisterPage;
