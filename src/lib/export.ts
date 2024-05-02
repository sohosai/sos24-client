import { captureException } from "@sentry/nextjs";
import { User } from "firebase/auth";

export const handleExport = async ({ path, user, fileName }: { path: string; user: User | null; fileName: string }) => {
  // OpenAPI FetchでやるとJSONとしてパースされてエラーが出るのでfetchを利用している
  if (!user) throw "Not Authorized";
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_ENDPOINT}${path}`, {
    headers: { Authorization: `Bearer ${await user.getIdToken()}` },
  });
  if (!res.ok) {
    const error = new Error(res.statusText);
    if (res.status != 404 && res.status != 403 && res.status != 401) {
      captureException(error);
    }
    throw error;
  }
  const file = new File([await res.blob()], fileName, { type: "text/csv" });
  window.location.href = URL.createObjectURL(file);
};
