import { applyDiff, getDiff } from "../diff";
import { NonPrimitive } from "./types";

export function patchObj<T extends NonPrimitive, U extends NonPrimitive>(oldObj: T, newObj: U) {
  const patch = getDiff(oldObj, newObj);
  applyDiff(oldObj, patch);
}
