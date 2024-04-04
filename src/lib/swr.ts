export const fetcherWithToken = async (url: string, token?: string, _init?: RequestInit) => {
  if (!token) {
    const error = new Error("Not Authorized");
    throw error;
  }

  return await fetch(`${process.env.NEXT_PUBLIC_API_ENDPOINT}${url}`, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  })
    .then(async (res) => {
      const resObject  = await res.json();
      if (!res.ok) {
        const error = new Error(res.statusText);
        error.name = resObject.code;
        error.message = resObject.message;
        throw error;
      }
      return { ok: res.ok, statusCode: res.status, json: await resObject };
    })
    .catch((error) => {
      throw new Error(error);
    });
};
