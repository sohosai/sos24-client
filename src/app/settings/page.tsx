"use client";

import { css, cx } from "@styled-system/css";
import { center, container, vstack } from "@styled-system/patterns";
import { NextPage } from "next";
import useSWR from "swr";
import { assignType, client } from "@/lib/openapi";
import { TableRow } from "@/common_components/TableRow";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { UpdateMeSchema, UpdateMeSchemaType } from "@/lib/valibot";
import { valibotResolver } from "@hookform/resolvers/valibot";
import { buttonStyle } from "@/recipes/button";
import { basicFormStyle } from "@/common_components/formFields/styles";
import toast from "react-hot-toast";

const MyPage: NextPage = () => {
  const { data: userRes, isLoading, error } = useSWR("/users/me");
  const [isEditMode, setEditMode] = useState(false);
  const {
    register,
    formState: { errors },
    handleSubmit,
  } = useForm<UpdateMeSchemaType>({ resolver: valibotResolver(UpdateMeSchema) });
  if (isLoading) return;
  if (error) return "エラーが発生しました";
  const user = assignType("/users/me", userRes);

  const submit = async (data: UpdateMeSchemaType) => {
    await client
      .PUT("/users/{user_id}", {
        params: {
          path: {
            user_id: user.id,
          },
        },
        body: Object.assign(Object.assign(user, { email: data.email, phoneNumber: data.phone_number })),
      })
      .then((res) => {
        if (res.error) {
          toast.error("更新に失敗しました");
          return;
        }
        toast.success("更新に成功しました");
        setEditMode(false);
      });
  };

  return (
    <main className={container({ padding: 5 })}>
      <h1
        className={css({
          fontSize: "2xl",
          fontWeight: "bold",
        })}>
        マイページ
      </h1>
      <div className={center({ flexDir: "column" })}>
        <div className={vstack({ width: "3xl" })}>
          {!isEditMode && (
            <button
              onClick={() => setEditMode(true)}
              className={cx(buttonStyle({ color: "blue", visual: "outline" }), css({ alignSelf: "end" }))}>
              編集
            </button>
          )}
        </div>
        <form className={vstack({ width: "3xl" })} onSubmit={handleSubmit(submit)}>
          <TableRow label="名前">{user.name}</TableRow>
          <TableRow label="名前（ふりがな）">{user.kana_name}</TableRow>
          <TableRow label="メールアドレス">
            {isEditMode ? (
              <>
                <input type="email" {...register("email", { value: user.email })} className={basicFormStyle()} />
                {errors.email?.message ?? ""}
              </>
            ) : (
              user.email
            )}
          </TableRow>
          <TableRow label="電話番号">
            {isEditMode ? (
              <input
                type="number"
                {...register("phone_number", { value: user.phone_number })}
                className={basicFormStyle()}
              />
            ) : (
              user.phone_number
            )}
            {errors.phone_number?.message ?? ""}
          </TableRow>
          {isEditMode && (
            <button type="submit" className={buttonStyle({ visual: "solid", color: "purple" })}>
              保存
            </button>
          )}
        </form>
      </div>
    </main>
  );
};

export default MyPage;
