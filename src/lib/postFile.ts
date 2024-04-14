import { getAuth } from "firebase/auth";
import { paths } from "@/schema";

export const postFile = async (visibility: "private" | "public", file: File) => {
  const user = getAuth().currentUser;
  if (!user) {
    return;
  }
  const accessToken = await user.getIdToken();

  const body = new FormData();

  body.append("file", file);
  const response = await fetch(`${process.env.NEXT_PUBLIC_API_ENDPOINT}/files?visibility=${visibility}`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
    body: body,
  })
    .then(async (response) => {
      if (!response.ok) {
        const error = await response.json();
        throw error;
      }

      const json = await response.json();
      return json as paths["/files"]["post"]["responses"]["201"]["content"]["application/json"];
    })
    .catch((error) => {
      throw error;
    });

  return response;
};
