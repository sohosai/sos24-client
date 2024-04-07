"use client";

import { css } from "@styled-system/css";
import { Title } from "@/components/Title";
import { RegisterForm } from "@/app/register/RegisterForm";
import { container, stack } from "@styled-system/patterns";
import { RegistrationProgress } from "@/components/RegistrationProgress";

const RegisterPage = () => {
  return (
    <div>
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
          className={container({
            maxWidth: "4xl",
          })}>
          <RegisterForm />
          <RegistrationProgress step={1} />
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
