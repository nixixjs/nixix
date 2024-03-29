import { DEPS, REACTIVE, TOPRIMITIVE } from "../shared";
import { ReactivityScope } from "./helpers";
import { EFFECT_STACK } from "./shared";
import { type Primitive } from "./types";

export class Signal {
  [REACTIVE] = true;
  
  [DEPS] = new Set<CallableFunction>();

  constructor(private _value: Primitive) {}

  [TOPRIMITIVE]() {
    return this.value;
  }

  public toJSON() {
    return this.value;
  }

  get value() {
    const RUNNING = EFFECT_STACK[EFFECT_STACK.length - 1];
    if (RUNNING) this[DEPS]?.add(RUNNING);
    return this._value
  }

  set value(newVal: Primitive) {
    this._value = newVal;
    ReactivityScope.runInOpen(() => this[DEPS]?.forEach(fn => fn?.()))
  }

  removeEffect(fn: CallableFunction) {
    if (this[DEPS]?.has(fn)) {
      this[DEPS]?.delete(fn) 
      return true;
    } else return false;
  }

  get hasEffects() {
    return Boolean(this[DEPS]?.size);
  } 
}



