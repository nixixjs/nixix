export const SYMBOL_REACTIVE = Symbol.for("reactive");

export const SYMBOL_DEPS = Symbol.for("deps");

export const SYMBOL_SIGNALMAP = Symbol.for("signalMap");

export const SYMBOL_DELETEDPROPMAP = Symbol.for("deletedPropMap");

export const SYMBOL_TOPRIMITIVE = Symbol.toPrimitive;

/**
 * @dev wrapper for console.error
 */
export function raise(message: string) {
  return console.error(message);
}

/**
 * @dev wrapper for console warn
 */
export function warn(message: string) {
  return console.warn(message);
}

export function isNull(value: any) {
  return value === null || value === undefined;
}

export function entries(obj: object) {
  return Object.entries(obj);
}

/**
 * @dev doesn't allow null values, instead returns a fallback provided by caller.
 */
export function nonNull<V>(value: V, fallback: any) {
  return isNull(value) ? fallback : value;
}

export function isFunction(val: any): val is CallableFunction {
  return typeof val === "function";
}

type ForEachParams<T> = Parameters<Array<T>["forEach"]>;

export function forEach<T>(
  arr: Array<T>,
  cb: ForEachParams<T>[0],
  thisArg?: ForEachParams<T>[1]
) {
  arr?.forEach?.(cb, thisArg);
}

/**
 * @dev flattens arrays to infinity
 */
export function flatten(arr: Array<any>) {
  if (Array.isArray(arr)) return arr.flat(Infinity);
  else return [arr];
}
