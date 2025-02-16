import { SYMBOL_DEPS } from "../shared";
import { type Store } from "./Store";
import { ReactivityScope } from "./helpers";
import { NonPrimitive } from "./types";

export const EFFECT_STACK: CallableFunction[] = [];

export function queueStoreEffects(obj: Store) {
  if (STORE_EFFECT_SET.has(obj)) return;
  else {
    STORE_EFFECT_SET.add(obj);
    queueMicrotask(
      () => (
        ReactivityScope.runInOpen(() =>
          obj[SYMBOL_DEPS]?.forEach?.((eff) => eff?.())
        ),
        STORE_EFFECT_SET.delete(obj)
      )
    );
  }
}

const STORE_EFFECT_SET: Set<NonPrimitive> = new Set();
