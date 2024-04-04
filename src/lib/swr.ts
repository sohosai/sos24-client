export const fetcherWithToken = async (url: string, token?: string, _init?: RequestInit) => {
  if (!token) {
    return { ok: false, statusCode: 401, json: "" };
  }

  return await fetch(`${process.env.NEXT_PUBLIC_API_ENDPOINT}${url}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })
    .then(async (res) => {
      return { ok: res.ok, statusCode: res.status, json: await res.json() };
    })
    .catch((error) => {
      throw new Error(error);
    });
};
