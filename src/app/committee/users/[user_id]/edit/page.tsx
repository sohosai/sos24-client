"use client";

import { container, stack } from "@styled-system/patterns";
import Link from "next/link";
import { css } from "@styled-system/css";
import { NextPage } from "next";
import { EditUserForm } from "@/app/committee/users/[user_id]/edit/EditUserForm";

export const runtime = "edge";

const EditUserPage: NextPage<{ params: { user_id: string } }> = ({ params }) => {
  return (
    <div className={container({ maxWidth: "4xl" })}>
      <div className={stack({ gap: 8, marginY: 8 })}>
        <Link
          href="/committee/users"
          className={css({
            color: "sohosai.purple",
            fontSize: "xs",
          })}>
          ←ユーザー一覧に戻る
        </Link>
        <EditUserForm user_id={params.user_id} />
      </div>
    </div>
  );
};

export default EditUserPage;
