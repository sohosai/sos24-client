import React, { FC } from "react";
import { components } from "@/schema";
import { grid, hstack, stack } from "@styled-system/patterns";
import { css } from "@styled-system/css";
import Link from "next/link";
import { UserRoleFormatter } from "@/common_components/user/UserRoleFormatter";
import dayjs from "dayjs";
import { Button } from "@/common_components/Button";
import { useRouter } from "next/navigation";

export const User: FC<{
  user: components["schemas"]["User"];
}> = ({ user }) => {
  const router = useRouter();

  return (
    <div
      className={stack({
        gap: 3,
        marginY: 8,
      })}>
      <Link
        href="/committee/users"
        className={css({
          color: "sohosai.purple",
          fontSize: "xs",
        })}>
        ←ユーザー一覧に戻る
      </Link>
      <div
        className={hstack({
          justifyContent: "space-between",
        })}>
        <h2
          className={css({
            fontSize: "2xl",
            fontWeight: "bold",
          })}>
          ユーザー情報
        </h2>
      </div>
      <div
        className={hstack({
          justifyContent: "flex-end",
        })}>
        <Button color="blue" className={hstack()} onClick={() => router.push(`/committee/users/${user.id}/edit`)}>
          <span
            className={css({
              fontSize: "xs",
              fontWeight: "bold",
            })}>
            編集
          </span>
        </Button>
      </div>
      <div
        className={grid({
          marginTop: 4,
          gridTemplateColumns: "1fr 1fr",
          gap: 0,
          "& > * > *": {
            paddingInline: 4,
            lineHeight: 3,
            _odd: {
              backgroundColor: "gray.100",
            },
            _even: {
              backgroundColor: "white",
            },
          },
        })}>
        <div
          className={css({
            fontWeight: "bold",
          })}>
          <div>名前</div>
          <div>なまえ</div>
          <div>メールアドレス</div>
          <div>電話番号</div>
          <div>権限</div>
          <div>企画</div>
          <div>登録日</div>
        </div>
        <div>
          <div>{user.name}</div>
          <div>{user.kana_name}</div>
          <div>{user.email}</div>
          <div>{user.phone_number}</div>
          <div>
            <UserRoleFormatter role={user.role} />
          </div>
          <div>
            {user.owned_project_id ? (
              <Link
                href={`/committee/projects/${user.owned_project_id}`}
                className={css({
                  color: "sohosai.purple",
                  fontWeight: "bold",
                  textDecoration: "underline",
                })}>
                {user.owned_project_title}
              </Link>
            ) : (
              "企画責任者または副企画責任者ではありません"
            )}
          </div>
          <div>{dayjs(user.created_at).format("YYYY/MM/DD")}</div>
        </div>
      </div>
    </div>
  );
};
