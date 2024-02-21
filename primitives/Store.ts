import { nixixStore } from "../dom/index";
import { signal } from "../primitives";
import { DEPS, REACTIVE } from "../shared";
import { EmptyObject } from "../types";
import { Signal } from "./Signal";
import { entries, forEach, isPrimitive } from "./helpers";

type StoreProps<T extends object | any[]> = {
  value?: T;
};

type StoreProxyHandler<T extends object> = ProxyHandler<T> & {
  signalMap: Map<string | symbol, ReturnType<typeof signal>>;
};

const arrayPropNames: (keyof Array<any>)[] = ["length"];

function isArrayPropName(target: object | any[], p: any) {
  return Array.isArray(target) && arrayPropNames.includes(p);
}

function createStoreProxy<T = EmptyObject>(obj: object | any[]): T {
  // there are levels to each proxy; so we can use a Map to store the names and signals for each;
  const proxy = new Proxy<EmptyObject>(obj, {
    signalMap: new Map(),
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
        isArrayPropName(target, p)
      )
        returnedValue = val;
      else {
        let signalMap = this.signalMap;
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
      target[p] = newValue;
      const [, setSignal] = this.signalMap.get(p) || [];
      setSignal?.(newValue);
      return true;
    },
    deleteProperty(_, p) {
      const [signal, setSignal] = this.signalMap.get(p) || [];
      if (signal) {
        setSignal?.(null);
        !(signal as Signal).hasEffects &&
          this.signalMap.delete(p)
      }
      return true;
    },
  } as StoreProxyHandler<EmptyObject>);

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
    const proxyvalue = createStoreProxy<Store>(value!);
    proxyvalue[DEPS] = new Set();
    proxyvalue[REACTIVE] = true;
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
    const proxyvalue = createStoreProxy<Store>(value!);
    proxyvalue[DEPS] = new Set();
    proxyvalue[REACTIVE] = true;
    return proxyvalue;
  }
}

export interface Store {
  [REACTIVE]: true;
  [DEPS]: Set<CallableFunction>;
}
