import { SYMBOL_REACTIVE, forEach } from "../shared";
import { type EmptyObject } from "../dom";
import { nixixStore } from "../dom/index";
import { Signal, Store } from "./classes";
import { Primitive, type NonPrimitive } from "./types";

/**
 * @dev splitProps works like a pick function, but removes the prop from the target and puts it in the new object
 */
export function splitProps<T extends EmptyObject<any>>(
  obj: T,
  ...props: (keyof T)[]
) {
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

type DeepCopyable = any;

/**
 * @dev deep copies any javascript value
 */
export function deepCopy<T extends DeepCopyable>(value: T): T {
  // Handle null and undefined
  if (value === null || value === undefined) {
    return value;
  }

  // Handle functions
  if (typeof value === "function") {
    return function (this: any, ...args: any[]) {
      return value.apply(this, args);
    } as T;
  }

  // Handle Dates
  if (value instanceof Date) {
    return new Date(value.getTime()) as T;
  }

  // Handle RegExp
  if (value instanceof RegExp) {
    return new RegExp(value.source, value.flags) as T;
  }

  // Handle Arrays
  if (Array.isArray(value)) {
    return value.map((item) => deepCopy(item)) as T;
  }

  // Handle Sets
  if (value instanceof Set) {
    const newSet = new Set();
    value.forEach((item) => newSet.add(deepCopy(item)));
    return newSet as T;
  }

  // Handle Maps
  if (value instanceof Map) {
    const newMap = new Map();
    value.forEach((val, key) => newMap.set(deepCopy(key), deepCopy(val)));
    return newMap as T;
  }

  // Handle Objects
  if (typeof value === "object") {
    const result: Record<string, any> = {};

    Object.entries(value).forEach(([key, val]) => {
      result[key] = deepCopy(val);
    });

    return result as T;
  }

  // Handle primitives (strings, numbers, booleans)
  return value;
}

export function removeChars(str: string | number) {
  return String(str).replace(/_/g, "");
}

export function isNull(val: any) {
  return val === null || val === undefined;
}

/**
 * @dev checks the type of value if it is boolean, number or string;
 */
export function checkType(value: string | number | boolean) {
  const types = {
    boolean: Boolean,
    string: String,
    number: Number,
  };

  const type = types[typeof value as keyof typeof types];
  return type;
}

export function isPrimitive(
  value: Primitive | NonPrimitive
): value is Primitive {
  return (
    ["string", "boolean", "number", "bigint"].includes(typeof value) ||
    isNull(value)
  );
}

export function isReactive(value: any) {
  return (value as Signal | Store)?.[SYMBOL_REACTIVE] as boolean;
}

export class ReactivityScope {
  /**
   * @dev Calls a callback when the reactive scope is closed, i.e nixixStore.reactiveScope is false.
   * This is done so as to not create and return signals on store access by the diffing algorithm used by the `patchObj` function.
   */
  static runInClosed(fn: () => void) {
    nixixStore.reactiveScope = false;
    fn();
    nixixStore.reactiveScope = true;
    return true;
  }

  /**
   * Calls a callback function when the reactive scope is open, i.e nixixStore.reactiveScope is true.
   * This is done so as to create and return signals or retrieve signals when stores are accessed. Should be used by state setter functions.
   */
  static runInOpen(fn: () => void) {
    nixixStore.reactiveScope = true;
    fn();
    nixixStore.reactiveScope = false;
    return false;
  }
}
