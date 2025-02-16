export const REACTIVE = Symbol.for('reactive')

export const DEPS = Symbol.for('deps')

export const SIGNALMAP = Symbol.for('signalMap')

export const DELETEDPROPMAP = Symbol.for('deletedPropMap');

export const TOPRIMITIVE = Symbol.toPrimitive;

export function raise(message: string) {
  return console.error(message);
}

export function warn(message: string) {
  return console.warn(message);
}

export function isNull(value: any) {
  return value === null || value === undefined;
}

export function entries(obj: object) {
  return Object.entries(obj);
}

export function nonNull<V>(value: V, fallback: any) {
  return isNull(value) ? fallback : value;
}

export function isFunction(val: any): val is CallableFunction {
  return typeof val === "function";
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

/**
 * @dev flattens arrays to infinity
 */
export function flatten(arr: Array<any>) {
  if (Array.isArray(arr)) return arr.flat(Infinity);
  else return [arr];
}
