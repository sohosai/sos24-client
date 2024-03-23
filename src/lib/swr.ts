import createClient from "openapi-fetch";
import type { MaybeOptionalInit } from "openapi-fetch";
import type { paths } from "../schema";
import type { PathsWithMethod } from "openapi-typescript-helpers";

export const fetcherWithToken = async <
  P extends PathsWithMethod<paths, "get">,
  I extends paths[P]["get"] extends { parameters: any } ? paths[P]["get"]["parameters"] : void,
>(
  url: P,
  params: I,
  token?: string,
  init?: RequestInit,
) => {
  const client = createClient<paths>({ baseUrl: process.env.NEXT_PUBLIC_API_ENDPOINT });
  if (!token) {
    //throw new Error("Unauthorized");
  }

  const paramsWithToken = [{
      ...params,
      headers: {
          Authorization: `Bearer ${token}`,
        },
  }] as MaybeOptionalInit<paths[P], "get">;
  console.log("↓")
  console.log(paramsWithToken)

  return await client.GET(url, ...paramsWithToken);
};

