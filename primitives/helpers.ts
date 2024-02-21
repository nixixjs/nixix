import { REACTIVE } from "../shared";
import { type EmptyObject } from "../dom";
import { nixixStore } from "../dom/index";
import { Signal, Store } from "./classes";
import { type NonPrimitive } from "./types";

export function splitProps<T extends EmptyObject<any>>(obj: T, ...props: (keyof T)[]) {
  const splittedProps: Record<any, any> = {};
  forEach(props, (p) => {
    if (p in obj) {
      splittedProps[p] = obj[p];
      delete obj[p];
    }
  });
  return splittedProps;
}

export function entries(obj: object) {
  return Object.entries(obj);
}

export function cloneObject<T extends NonPrimitive>(object: T) {
  return JSON.parse(JSON.stringify(object)) as T;
}

export function removeChars(str: string | number) {
  return String(str).replace(/_/g, "");
}

export function isNull(val: any) {
  return val === null || val === undefined;
}

export function checkType(value: string | number | boolean) {
  const types = {
    boolean: Boolean,
    string: String,
    number: Number,
  };

  const type = types[typeof value as keyof typeof types];
  return type;
}

export function isPrimitive(value: any) {
  return (
    ["string", "boolean", "number", "bigint"].includes(typeof value) ||
    isNull(value)
  );
}

type ForEachParams<T> = Parameters<Array<T>["forEach"]>;

/**
 * Returns void, to be used when you want to mutate some outside code in an array
 */
export function forEach<T>(
  arr: Array<T>,
  cb: ForEachParams<T>[0],
  thisArg?: ForEachParams<T>[1]
) {
  arr?.forEach?.(cb, thisArg);
}

export function isReactive(value: any) {
  return (value as Signal | Store)?.[REACTIVE] as boolean;
}


export class ReactivityScope {
  /**
   * Runs a specified function when the reactive scope is closed, i.e nixixStore.reactiveScope is false.
   * This is done so as to not create and return signals on store access by the diffing algorithm used by the `patchObj` function.
   */
  static runInClosed(fn: () => void) {
    nixixStore.reactiveScope = false;
    fn();
    nixixStore.reactiveScope = true;
    return true;
  }
  
  /**
   * Runs a specified function when the reactive scope is open, i.e nixixStore.reactiveScope is true.
   * This is done so as to create and return signals or retrieve signals when stores are accessed. Should be used by state setter functions.
   */
  static runInOpen(fn: () => void) {
    nixixStore.reactiveScope = true;
    fn();
    nixixStore.reactiveScope = false;
    return false;
  }
}
