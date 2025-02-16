import { nixixStore } from "../dom/index";
import { NonPrimitive, signal, type Primitive } from "../primitives";
import {
  SYMBOL_DELETEDPROPMAP,
  SYMBOL_DEPS,
  SYMBOL_REACTIVE,
  SYMBOL_SIGNALMAP,
  forEach,
} from "../shared";
import { EmptyObject } from "../types";
import { ReactivityScope, entries, isPrimitive } from "./helpers";
import { patchObj } from "./patchObj";
import { queueStoreEffects } from "./shared";

type StoreProps<T extends object | any[]> = {
  value?: T;
};

const arrayPropNames: (keyof Array<any>)[] = ["length"];

const jsInternalPropNames = ["toJSON"];

function isSkippableProp(target: object | any[], p: any) {
  return jsInternalPropNames.includes(p) || isArrayPropName(target, p);
}

function isArrayPropName(target: object | any[], p: any) {
  return Array.isArray(target) && arrayPropNames.includes(p);
}

function createStoreProxy<T = EmptyObject>(obj: Store): T {
  obj[SYMBOL_DEPS] = new Set();
  obj[SYMBOL_REACTIVE] = true;
  obj[SYMBOL_SIGNALMAP] = new Map();
  obj[SYMBOL_DELETEDPROPMAP] = new Map();

  const proxy = new Proxy<EmptyObject>(obj, {
    get(target, p) {
      if (!nixixStore.reactiveScope) {
        if (!(p in target)) return null;
        else return target[p];
      }
      const val = target[p];
      let returnedValue: any = null;
      if (
        !isPrimitive(val) ||
        typeof p === "symbol" ||
        isSkippableProp(target, p)
      )
        returnedValue = val;
      else {
        let signalMap = obj[SYMBOL_SIGNALMAP];
        if (signalMap.has(p)) returnedValue = signalMap.get(p)?.[0];
        else {
          const valueSignal = signal(val);
          signalMap.set(p, valueSignal);
          returnedValue = valueSignal![0];
        }
      }
      return returnedValue;
    },
    set(target, p, newValue) {
      if (!isPrimitive(newValue)) {
        if (!(p in target)) {
          const deletedPropMap = obj[SYMBOL_DELETEDPROPMAP];
          if (deletedPropMap.has(p)) {
            const oldValue = deletedPropMap.get(p);
            target[p] = oldValue;
            ReactivityScope.runInClosed(() => patchObj(oldValue!, newValue));
            deletedPropMap.delete(p);
          } else target[p] = new Store({ value: newValue });
        }
      } else {
        target[p] = newValue;
        if (isArrayPropName(target, p)) return true;
        const [, setSignal] = obj[SYMBOL_SIGNALMAP].get(p) || [];
        setSignal?.(newValue);
      }
      if (obj[SYMBOL_DEPS].size) queueStoreEffects(obj);
      return true;
    },

    deleteProperty(target, p) {
      const value = target[p];
      if (!isPrimitive(value)) {
        obj[SYMBOL_DELETEDPROPMAP].set(p, value);
      } else {
        const [, setSignal] = obj[SYMBOL_SIGNALMAP].get(p) || [];
        setSignal?.(null);
      }
      if (obj[SYMBOL_DEPS].size) queueStoreEffects(obj);
      return true;
    },
  });

  return proxy as T;
}
export class Store {
  constructor({ value }: StoreProps<object | any[]>) {
    // @ts-expect-error
    return Array.isArray(value)
      ? new Store_Array({ value })
      : new Store_Object({ value });
  }
}

class Store_Object {
  constructor({ value }: StoreProps<object>) {
    const allValues = entries(value!);
    forEach(allValues, ([k, v]) => {
      // loop and get non primitives properties and proxy them;
      switch (isPrimitive(v)) {
        case false:
          // @ts-expect-error
          value[k] = new Store({ value: v });
          break;
      }
    });
    const proxyvalue = createStoreProxy<Store>(value as Store);
    return proxyvalue;
  }
}

class Store_Array {
  constructor({ value }: StoreProps<object>) {
    forEach(value as any[], (el, i) => {
      // loop and get non primitives properties and proxy them;
      switch (isPrimitive(el)) {
        case false:
          // @ts-expect-error
          value[i] = new Store({ value: el });
          break;
      }
    });
    const proxyvalue = createStoreProxy<Store>(value as Store);
    return proxyvalue;
  }
}

export interface Store {
  [SYMBOL_REACTIVE]: true;
  [SYMBOL_DEPS]: Set<CallableFunction>;
  [SYMBOL_SIGNALMAP]: Map<
    string | symbol,
    ReturnType<typeof signal<Primitive>>
  >;
  [SYMBOL_DELETEDPROPMAP]: Map<string | symbol, NonPrimitive>;
}
