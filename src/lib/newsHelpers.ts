//import { components } from "@/schema";
export type newsStatus = "下書き" | "公開前" | "公開済" | "不明";

export const StateToJapanese = (status?: string): newsStatus => {
  switch (status) {
    case "draft":
      return "下書き";
    case "scheduled":
      return "公開前";
    case "published":
      return "公開済";
    default:
      return "不明";
  }
};
