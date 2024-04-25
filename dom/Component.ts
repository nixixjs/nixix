import { getValueType } from "../primitives/index";

export default class Component {
  static State<S>(value: S) {
    const [val, setValue] = getValueType(value)!;
    return {
      get() {
        return val;
      },
      set(newValue: S | ((prev: S) => S)) {
        setValue(newValue);
      },
    };
  }
}

export const bind: MethodDecorator = (target, key, descriptor) => {
  let fn = descriptor.value;

  if (typeof fn !== "function") {
    throw new TypeError(
      `@bind decorator can only be applied to methods not: ${typeof fn}`
    );
  }

  // In IE11 calling Object.defineProperty has a side-effect of evaluating the
  // getter for the property which is being replaced. This causes infinite
  // recursion and an "Out of stack space" error.
  let definingProperty = false;

  return {
    configurable: true,
    get() {
      if (
        definingProperty ||
        // @ts-expect-error
        this === target.prototype ||
        this.hasOwnProperty(key) ||
        typeof fn !== "function"
      ) {
        return fn;
      }

      const boundFn = fn.bind(this);
      definingProperty = true;
      Object.defineProperty(this, key, {
        configurable: true,
        get() {
          return boundFn;
        },
        set(value) {
          fn = value;
          delete this[key];
        },
      });
      definingProperty = false;
      return boundFn;
    },
    set(value) {
      fn = value;
    },
  };
};
