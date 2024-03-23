import type { paths } from "../schema";
import type { PathsWithMethod } from "openapi-typescript-helpers";

export const assignType = <P extends PathsWithMethod<paths, "get">>(path: P, response_json: any) => {
  type responses = paths[P]["get"]["responses"];

  return response_json as responses extends { "200": { content: { "application/json": {} } } }
    ? responses["200"]["content"]["application/json"]
    : any;
};
