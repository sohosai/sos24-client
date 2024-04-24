import { captureException } from "@sentry/nextjs";

export const fetcherWithToken = async (url: string, token?: string, _init?: RequestInit) => {
  if (!token) {
    const error = new Error("Not Authorized");
    throw error;
  }

  const res = await fetch(`${process.env.NEXT_PUBLIC_API_ENDPOINT}${url}`, {
    headers: { Authorization: `Bearer ${token}` },
  });

  const resObject = await res.json();
  if (!res.ok) {
    const error = new Error(res.statusText);
    error.name = resObject.code;
    error.message = resObject.message;
    if (res.status != 404 && res.status != 403 && res.status != 401) {
      captureException(error);
    }
    throw error;
  }
  return resObject;
};
