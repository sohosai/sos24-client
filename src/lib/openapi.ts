import type { paths } from "@/schema";
import type { PathsWithMethod } from "openapi-typescript-helpers";
import createClient, { Middleware } from "openapi-fetch";
import { getAuth } from "firebase/auth";
import { captureException } from "@sentry/nextjs";

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

const sentryMiddleware: Middleware = {
  async onResponse(res) {
    if (res.status !== 404 && res.status !== 403 && res.status !== 401 && !res.ok) {
      try {
        const resErr = await res.clone().json();
        const err = new Error(resErr.message);
        err.name = resErr.code;
        captureException(err);
      } catch {
        captureException(res);
      }
    }
    return res;
  },
};

export const client = createClient<paths>({ baseUrl: process.env.NEXT_PUBLIC_API_ENDPOINT });
client.use(authMiddleware);
client.use(sentryMiddleware);
