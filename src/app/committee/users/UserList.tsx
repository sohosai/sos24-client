import { css } from "@styled-system/css";
import { FC } from "react";
import Link from "next/link";
import { components } from "@/schema";
import { UserRoleFormatter } from "@/components/user/UserRoleFormatter";
import { NoResultNotice } from "@/components/NoResultNotice";

export const UserList: FC<{
  userList: components["schemas"]["UserSummary"][];
}> = ({ userList }) => {
  return (
    <div>
      <div
        className={css({
          display: "grid",
          alignItems: "center",
          gridTemplateColumns: "1fr 1fr 1fr",
          "& > * > *": {
            pl: 4,
            pr: 4,
            lineHeight: 3,
          },
        })}>
        <div
          className={css({
            display: "contents",
            "& > *": {
              borderColor: "gray.500",
              borderBottom: "1px solid",
            },
          })}>
          <div className={css({ fontSize: "sm", fontWeight: "bold" })}>名前</div>
          <div className={css({ fontSize: "sm", fontWeight: "bold" })}>メールアドレス</div>
          <div className={css({ fontSize: "sm", fontWeight: "bold" })}>権限</div>
        </div>
        {userList.length !== 0 && (
          <>
            {userList.map((user) => (
              <Link
                key={user.id}
                href={`/committee/users/${user.id}`}
                className={css({
                  display: "contents",
                  "& > *": {
                    borderColor: "gray.200",
                    borderBottom: "1px solid",
                  },
                })}>
                <div
                  className={css({
                    fontSize: "sm",
                  })}>
                  {user.name}
                </div>
                <div
                  className={css({
                    fontSize: "sm",
                  })}>
                  {user.email}
                </div>
                <div
                  className={css({
                    fontSize: "sm",
                  })}>
                  <UserRoleFormatter role={user.role} />
                </div>
              </Link>
            ))}
          </>
        )}
      </div>
      {userList.length === 0 && <NoResultNotice message="ユーザーが見つかりませんでした" />}
    </div>
  );
};
