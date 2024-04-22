import { Dayjs } from "dayjs";
import { atom } from "jotai";

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
