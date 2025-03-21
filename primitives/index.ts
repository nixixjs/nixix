import { getSignalValue, onlyChild } from "../dom/helpers";
import { SYMBOL_DEPS, flatten, forEach, isFunction, raise } from "../shared";
import { Signal, Store } from "./classes";
import { ReactivityScope, deepCopy, isPrimitive, splitProps } from "./helpers";
import { patchObj } from "./patchObj";
import { EFFECT_STACK } from "./shared";
import type {
  NonPrimitive,
  Primitive,
  SetSignalDispatcher,
  Signal as TSignal,
  Store as TStore,
} from "./types";

function ref<R extends Element | HTMLElement>(ref: R): MutableRefObject {
  return {
    current: {} as Current,
    nextElementSibling: ref,
    prevElementSibling: ref,
    parent: ref ? (ref as HTMLElement) : null,
  };
}

function signal<S>(
  initialValue: S,
  config?: {
    equals: boolean;
  }
): [TSignal<S>, SetSignalDispatcher<S>] {
  let value: string | number | boolean = isFunction(initialValue)
    ? (initialValue as Function)()
    : initialValue;
  // value - in the worst case of it being an instance of object, throw an error.
  !isPrimitive(value) &&
    raise(`You must pass a primitve to the signal function`);
  const initValue = new Signal(value);
  const setter: SetSignalDispatcher<S> = function (newState) {
    let oldState = initValue.value;
    let newStatePassed = isFunction(newState)
      ? (newState as Function)(oldState)
      : newState;
    switch (true) {
      case config?.equals:
      case String(oldState) !== String(newStatePassed):
        initValue.value = newStatePassed;
    }
  };
  return [initValue as any, setter];
}

function store<S extends NonPrimitive>(
  initialValue: S,
  config?: {
    equals: boolean;
  }
): any[] {
  let value = 
    isFunction(initialValue) ? initialValue() : initialValue
  const initValue = new Store({ value: deepCopy(value) });
  const setter = (newValue: (prev?: any) => any) => {
    let newValuePassed = isFunction(newValue)
      ? newValue(value)
      : newValue;
    value = newValuePassed;
    switch (true) {
      case config?.equals:
      default:
        ReactivityScope.runInClosed(() => patchObj(initValue, newValuePassed));
    }
  };

  return [initValue, setter];
}

function getValueType<T>(value: any) {
  if (isFunction(value)) raise(`Cannot pass a function as a reactive value.`);
  if (isPrimitive(value)) return signal<Primitive>(value);
  if (typeof value === "object") return store<NonPrimitive>(value);
}

function memo<T>(fn: () => T, deps: any[]) {
  const value = fn();
  const [state, setState] = getValueType<T>(value)!;
  reaction(() => {
    setState(fn());
  }, deps);
  return state;
}

function concat<T extends Signal>(
  ...templ: Array<T | TemplateStringsArray | Primitive>
) {
  // ['', 'jjdj', '']
  // [_Signal2, _Signal2]
  const templates = templ[0] as TemplateStringsArray;
  const expressions = templ.splice(1) as T[];
  return memo(() => {
    return templates.reduce((p, v, i) => {
      const expression = expressions[i - 1];
      let returnedVal: Primitive = "";
      if (expression) {
        if (expression[SYMBOL_DEPS]) returnedVal = getSignalValue(expression);
        else if (isPrimitive(expression)) returnedVal = expression as any;
      }
      return p + returnedVal + v;
    });
  }, expressions);
}

function subscribeDeps(
  callbackFn: CallableFunction,
  furtherDependents?: (Signal | Store)[]
) {
  if (furtherDependents)
    resolveImmediate(() => {
      forEach(furtherDependents, (dep) => {
        dep?.[SYMBOL_DEPS] && addDep(callbackFn, dep as Signal);
      });
    });
}

function addDep(cb: CallableFunction, dep: Signal | Store) {
  dep?.[SYMBOL_DEPS]?.add(cb);
}

function resolveImmediate(fn: CallableFunction) {
  queueMicrotask(fn as () => void);
}

function effect(callbackFn: CallableFunction) {
  resolveImmediate(() => {
    try {
      EFFECT_STACK.push(callbackFn);
      callbackFn();
    } finally {
      EFFECT_STACK.pop();
    }
  });
}

function reaction(callbackFn: CallableFunction, deps?: (Signal | Store)[]) {
  subscribeDeps(callbackFn, deps);
}

function renderEffect(callbackFn: CallableFunction) {
  try {
    EFFECT_STACK.push(callbackFn);
    callbackFn();
  } finally {
    EFFECT_STACK.pop();
  }
}

type ContextProviderProps<T> = {
  children: () => Nixix.NixixNode;
  value: T;
};

function createContext<T extends TStore<NonPrimitive>>() {
  const contextCountMap = new Map<number, T>();
  let count = 0;
  return {
    context: () => contextCountMap.get(count) || ({} as T),
    Provider: (props: ContextProviderProps<T>) => {
      const validatedChildren = onlyChild(flatten(props.children as any));
      count += 1;
      contextCountMap.set(count, props.value);
      return validatedChildren();
    },
  };
}

export {
  Signal,
  Store,
  concat,
  createContext,
  effect,
  getSignalValue,
  getValueType,
  memo,
  reaction,
  ref,
  renderEffect,
  signal,
  splitProps,
  store,
};
