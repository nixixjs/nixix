import '../types/index';

// primitives
export type SetSignalDispatcher<S> = (newValue: S | (() => S)) => void;
export type SetStoreDispatcher<S> = (newValue: S | (() => S)) => void;

export interface SignalObject<S> {
  value: S;
}

export interface StoreObject<O> {
  readonly $$__value?: O;
  [index: string]: any;
}

export class Signal {
  'value': any;
  '$$__id': number;
}

export class Store {
  '$$__name': string;
  '$$__id': string | number;
  '$$__value': any;
}

export interface MutableRefObject<T> {
  current: T;
  refId?: number;
  nextElementSibling: Element;
  prevElementSibling: Element;
  parent: HTMLElement;
}

/**
 * Returns a tuple of the initial value and a setter function to update the values.
 *
 * @param initialValue initial value to be tracked: can be an object or an array.
 * @param config Do not use. Still Experimental.
 */
export function callSignal<S, C extends Signal>(
  initialValue: S,
  config?: C
): [SignalObject<S>, SetSignalDispatcher<S>];

/**
 * Returns a tuple of the initial value and a setter function to update the values.
 *
 * @param initialValue initial value to be tracked: can be an object or an array.
 */
export function callStore<O>(
  initialValue: O
): [O & StoreObject<O>, SetStoreDispatcher<O>];

/**
 * Tracks the closest (signal or store) and calls the callback function whenever the (signal or store)'s value changes.
 * If there is no signal or store, it does no tracking.
 *
 * @param callbackFn callback function to be called once all the synchronous code has finished running.
 */
export function effect(callbackFn: CallableFunction, config?: 'once', furtherDependents?: (SignalObject<any> | StoreObject<any>)[]): void;

/**
 * Tracks the closest (signal or store) and calls the callback function whenever the (signal or store)'s value changes.
 * If there is no signal or store, it does no tracking.
 *
 * @param callbackFn callback function to be called once the DOM content has loaded.
 */
export function renderEffect(callbackFn: CallableFunction, config?: 'once', furtherDependents?: (SignalObject<any> | StoreObject<any>)[]): void;

export function removeSignal(signals: Array<StoreObject<any> | SignalObject<any>> | StoreObject<any> | SignalObject<any>): void;

/**
     * ```jsx
     * This function is used to get a reference to a dom element. To get the element you want to manipulate, add the 'bind:ref' prop with it's value as the ref variable. 
     * import { callRef } from 'nixix';
     * 
     * function App() {
        const div = callRef();

        return (
          <div bind:ref={div} >I'm a div</div>
        )
     }
     * 
     * ```
     */
export function callRef<
  R extends Element | null =
    | any
    | HTMLElementTagNameMap[keyof HTMLElementTagNameMap]
>(ref?: R): MutableRefObject<R | null>;

