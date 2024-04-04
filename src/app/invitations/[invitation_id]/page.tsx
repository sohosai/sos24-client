"use client";

import useSWR from "swr";
import { assignType } from "@/lib/openapi";
import toast from "react-hot-toast";
import { redirect } from "next/navigation";

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
  const { data, error, isLoading } = useSWR(`/invitations/${params.invitation_id}`);
  console.log(data, error, isLoading);
  const invitation = data ? assignType("/invitations/{invitation_id}", data) : undefined;

  const onClick = async () => {
    const resp = await fetch(
      `${process.env.NEXT_PUBLIC_API_ENDPOINT}/invitations/${params.invitation_id}`,
      {
        method: "POST",
      },
    )
    const resp = await fetch(`${process.env.NEXT_PUBLIC_API_ENDPOINT}/invitations/${params.invitation_id}`, {
      method: "POST",
    })
      .then((res) => res.status)
      .catch((err) => console.error(err));

    if (resp == 200) {
      toast.success("企画に招待されました");
      redirect("/dashboard");
    }
  };

  return (
    <div>
      <h1></h1>
      <p>
        {invitation?.inviter_name}さんがあなたを企画「{invitation
          ?.project_title}」の
        {invitation && <PositionFormatter position={invitation.position} />}
        に招待しています。
      </p>
      <button onClick={onClick}>承諾する</button>
    </div>
  );
};

export default InvitationPage;
