"use client";
import { useAtom } from "jotai";
import { projectApplicationPeriodAtom } from "@/lib/projectApplicationPeriod";
import useSWR from "swr";
import { assignType } from "@/lib/openapi";
import dayjs from "dayjs";

export const ApplicationPeriodProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [_, setProjectApplicationPeriod] = useAtom(projectApplicationPeriodAtom);
  // OpenApiFetchやSWRを使うと認証がないときにエラーが出るのでfetchを使っている
  const { data: _applicationPeriod, isLoading } = useSWR("/project-application-period", (url) =>
    fetch(`${process.env.NEXT_PUBLIC_API_ENDPOINT}${url}`).then(async (res) => {
      if (!res.ok) {
        throw await res.json();
      }
      return await res.json();
    }),
  );

  const applicationPeriod = assignType("/project-application-period", _applicationPeriod);
  const startsAt = isLoading ? null : dayjs(applicationPeriod.start_at);
  //const endsAt = isLoading ? null : dayjs(applicationPeriod.end_at);
  const endsAt = startsAt;
  setProjectApplicationPeriod((prev) =>
    Object.assign(
      prev,
      {
        isLoading,
      },
      isLoading
        ? {}
        : {
            startsAt: startsAt,
            endsAt: endsAt,
            isIn: dayjs().isAfter(startsAt) && dayjs().isBefore(endsAt),
          },
    ),
  );
  return children;
};
