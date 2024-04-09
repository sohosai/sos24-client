import { atomWithStorage } from "jotai/utils";

export const hiddenFormIdsAtom = atomWithStorage<string[]>("hiddenFormIds", []);