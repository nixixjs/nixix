import { getSignalValue } from "../dom/helpers";
import { DEPS, forEach, isFunction, raise } from "../shared";
import { Signal, Store } from "./classes";
import {
  ReactivityScope,
  cloneObject,
  isPrimitive,
  splitProps,
} from "./helpers";
import { patchObj } from "./patchObj";
import { EFFECT_STACK } from "./shared";
import type {
  NonPrimitive,
  Primitive,
  SetSignalDispatcher,
  Signal as Signal2,
} from "./types";

function callRef<R extends Element | HTMLElement>(ref: R): MutableRefObject {
  return {
    current: {} as Current,
    nextElementSibling: ref,
    prevElementSibling: ref,
    parent: ref ? (ref as HTMLElement) : null,
  };
}

function callSignal<S>(
  initialValue: S,
  config?: {
    equals: boolean;
  }
): [Signal2<S>, SetSignalDispatcher<S>] {
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

function callStore<S extends NonPrimitive>(
  initialValue: S,
  config?: {
    equals: boolean;
  }
): any[] {
  let value = cloneObject(
    isFunction(initialValue) ? (initialValue as Function)() : initialValue
  );
  const initValue = new Store({ value });
  const setter = (newValue: (prev?: any) => any) => {
    let newValuePassed = isFunction(newValue)
      ? newValue(cloneObject(value))
      : newValue;
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
  callReaction(() => {
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
        if (expression[DEPS]) returnedVal = getSignalValue(expression);
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
        dep?.[DEPS] && addDep(callbackFn, dep as Signal);
      });
    });
}

function addDep(cb: CallableFunction, dep: Signal | Store) {
  dep?.[DEPS]?.add(cb);
}

function resolveImmediate(fn: CallableFunction) {
  queueMicrotask(fn as () => void);
}

function callEffect(callbackFn: CallableFunction) {
  resolveImmediate(() => {
    try {
      EFFECT_STACK.push(callbackFn);
      callbackFn();
    } finally {
      EFFECT_STACK.pop();
    }
  });
}

function callReaction(callbackFn: CallableFunction, deps?: (Signal | Store)[]) {
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

// This is only for simplicity
const signal = callSignal;

const store = callStore;

const effect = callEffect;

const reaction = callReaction;

export {
  Signal,
  Store,
  callEffect,
  callReaction,
  callRef,
  callSignal,
  callStore,
  concat,
  effect,
  getSignalValue,
  getValueType,
  memo,
  reaction,
  renderEffect,
  signal,
  splitProps,
  store
};

