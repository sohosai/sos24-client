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
    throw error;
  }
  return resObject;
};
