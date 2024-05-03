import dayjs, { Dayjs } from "dayjs";
import { atom } from "jotai";
import { assignType } from "./openapi";

type ApplicationPeriodType = {
  isLoading: boolean;
  startsAt: null | Dayjs;
  endsAt: null | Dayjs;
  isIn: null | boolean;
};

export const projectApplicationPeriodAtom = atom<ApplicationPeriodType>({
  isLoading: true,
  startsAt: null,
  endsAt: null,
  isIn: null,
});

projectApplicationPeriodAtom.onMount = (setAtom) => {
  fetch(`${process.env.NEXT_PUBLIC_API_ENDPOINT}/project-application-period`)
    .then(async (res) => {
      if (!res.ok) {
        throw await res.json();
      }
      return await res.json();
    })
    .then((data) => {
      const applicationPeriod = assignType("/project-application-period", data);
      const startsAt = dayjs(applicationPeriod.start_at);
      const endsAt = dayjs(applicationPeriod.end_at);
      setAtom((prev) =>
        Object.assign(prev, {
          startsAt: startsAt,
          endsAt: endsAt,
          // isIn: false,
          isIn: dayjs().isAfter(startsAt) && dayjs().isBefore(endsAt),
        }),
      );
    });
};
