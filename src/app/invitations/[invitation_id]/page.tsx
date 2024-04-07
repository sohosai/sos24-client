"use client";

import useSWR from "swr";
import { assignType, client } from "@/lib/openapi";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { container, stack } from "@styled-system/patterns";
import { Title } from "@/_common_components/Title";
import { Button } from "@/_common_components/Button";

export const runtime = "edge";

const PositionFormatter = (
  { position }: { position: "owner" | "sub_owner" },
) => {
  switch (position) {
    case "owner":
      return <>企画責任者</>;
    case "sub_owner":
      return <>副企画責任者</>;
  }
};

const InvitationPage = ({ params }: { params: { invitation_id: string } }) => {
  const router = useRouter();
  const { data, error, isLoading } = useSWR(
    `/invitations/${params.invitation_id}`,
  );
  if (isLoading) {
    return;
  }
  if (error) {
    switch (error.name) {
      case "invitation/not-found":
        return <p>この招待リンクは存在しません。</p>;
      default:
        return <p>招待の読み込み中に不明なエラーが発生しました。</p>;
    }
  }

  const invitation = assignType("/invitations/{invitation_id}", data);

  const onClick = async () => {
    const { error } = await client.POST("/invitations/{invitation_id}", {
      params: { path: { invitation_id: params.invitation_id } },
    });
    if (error) {
      switch (error.code) {
        case "invitation/already-owner-or-subowner":
          toast.error(
            "すでに企画責任者または副企画責任者のため、招待を受けることができません。",
          );
          break;
        default:
          toast.error("招待の承諾中に不明なエラーが発生しました。");
          break;
      }
    } else {
      toast.success("企画に招待されました");
      router.push("/dashboard");
    }
  };

  return (
    <div className={container()}>
      <div
        className={stack({
          alignItems: "center",
          gap: 8,
          marginY: 8,
        })}
      >
        <Title>
          <PositionFormatter position={invitation.position} />
          登録
        </Title>
        {invitation.used_by
          ? <p>この招待リンクはすでに使用されています。</p>
          : (
            <>
              <p>
                {invitation.inviter_name}さんがあなたを企画「{invitation
                  .project_title}」の
                <PositionFormatter position={invitation.position} />
                に招待しています。
              </p>
              <Button color="primary" onClick={onClick}>
                承諾する
              </Button>
            </>
          )}
      </div>
    </div>
  );
};

export default InvitationPage;
