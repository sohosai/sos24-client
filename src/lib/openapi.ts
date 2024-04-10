import type { paths } from "@/schema";
import type { PathsWithMethod } from "openapi-typescript-helpers";
import createClient, { Middleware } from "openapi-fetch";
import { getAuth } from "firebase/auth";

export const assignType = <P extends PathsWithMethod<paths, "get">>(path: P, response_json: any) => {
  type responses = paths[P]["get"]["responses"];

  return response_json as responses extends { "200": { content: { "application/json": {} } } }
    ? responses["200"]["content"]["application/json"]
    : any;
};

const authMiddleware: Middleware = {
  async onRequest(req) {
    const user = getAuth().currentUser;
    if (!user) {
      return;
    }

    const accessToken = await user.getIdToken();
    req.headers.set("Authorization", `Bearer ${accessToken}`);
    return req;
  },
};

export const client = createClient<paths>({ baseUrl: process.env.NEXT_PUBLIC_API_ENDPOINT });
client.use(authMiddleware);
