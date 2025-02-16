import { SYMBOL_DEPS, SYMBOL_REACTIVE, SYMBOL_TOPRIMITIVE } from "../shared";
import { ReactivityScope } from "./helpers";
import { EFFECT_STACK } from "./shared";
import { type Primitive } from "./types";

export class Signal {
  [SYMBOL_REACTIVE] = true;

  [SYMBOL_DEPS] = new Set<CallableFunction>();

  constructor(private _value: Primitive) {}

  [SYMBOL_TOPRIMITIVE]() {
    return this.value;
  }

  public toJSON() {
    return this.value;
  }

  get value() {
    const RUNNING = EFFECT_STACK[EFFECT_STACK.length - 1];
    if (RUNNING) this[SYMBOL_DEPS]?.add(RUNNING);
    return this._value;
  }

  set value(newVal: Primitive) {
    this._value = newVal;
    ReactivityScope.runInOpen(() => this[SYMBOL_DEPS]?.forEach((fn) => fn?.()));
  }

  removeEffect(fn: CallableFunction) {
    if (this[SYMBOL_DEPS]?.has(fn)) {
      this[SYMBOL_DEPS]?.delete(fn);
      return true;
    } else return false;
  }

  get hasEffects() {
    return Boolean(this[SYMBOL_DEPS]?.size);
  }
}
