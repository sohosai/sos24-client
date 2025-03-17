import dayjs from "dayjs";

import { components } from "@/schema";


type Answer = components["schemas"]["FormAnswerSummary"];

export type newsStatus = "下書き" | "公開前" | "公開済" | "不明";
