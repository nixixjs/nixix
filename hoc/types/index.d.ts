import { EffectCallback, Signal, Store } from '../../primitives/types';
import {
  ExoticComponent,
  ImgHTMLAttributes,
  type NixixNode,
} from '../../types/index';

interface ComponentWithFallback {
  fallback?: someView | null | undefined;
}

/**
 * @deprecated
 */
export const Img: ExoticComponent<ImgHTMLAttributes<HTMLImageElement>>;

interface SuspenseProps extends ComponentWithFallback {
  onError?: NixixNode;
  children: Promise<someView> | someView;
}
/**
   * ```jsx
   * When you have a Functional Compoonent that handles some asynchronous tasks before it returns a value, you should use this Component to to show a fallback and when the asynchronous task is done, it will replace the fallback with that Functional Component.
   * 
   * import { Suspense } from 'nixix';
   * function App() {
      return (
        <div>
          <Suspense fallback={<div>Loading...</div>} >
            <AsynchronousTasksToReturnSomeJSX />
          </Suspense>
        </div>
      )
   }
   * ```
   */
export const Suspense: ExoticComponent<SuspenseProps>;

type Props = {
  [index: string]: any;
};
type AsyncComponent<T extends Props> = (
  FC: (props?: T) => Promise<someView>
) => (props?: T) => someView;
/**
 * @deprecated
 *
 * ```jsx
 * For IDEs not to show errors when you use a component that has the return type 'Promise<JSX.Element>', you should use this function.
 *
 * This function simply returns the function passed as an argument to it. It is used to override the return type 'Promise<JSX.Element>' of async components to 'JSX.Element'.
 *
 * Example:
 *
 * function Product() {
 *    return new Promise((resolve, reject) => {
 *       resolve(<div>Product</div>);
 *    })
 * }
 *
 * 👆 The above function has a return type of 'Promise<JSX.Element>' and IDEs show errors when you call the function in a JSX scope. To stop this, use the function like this:
 *
 * import { asyncComponent } from 'nixix';
 *
 * const Product = asyncComponent(function () {
 *    return new Promise((resolve, reject) => {
 *       resolve(<div>Product</div>);
 *    })
 * })
 *
 *
 * Now, you can call this function anywhere in your component tree without your IDE showing any errors. Obviously, this would not return the expected value, so you need to wrap it in a Suspense Component.
 *
 * ```
 */
export const asyncComponent: AsyncComponent<Props>;

interface ForProps<T extends Store<any[]>> extends ComponentWithFallback {
  each: T;
  children: (item: T[number], i: number) => someView;
}

interface IndexProps<T extends Store<any[]>> extends ForProps<T> {} 

/**
 * Destroys nodes when they are removed from the DOM
 */
export declare function For<T extends any[]>(props?: ForProps<T>): someView;

/**
 * Stores nodes in memory to be reused when needed.
 * Use the `For` component if you don't want this behaviour.
 */
export declare function Index<T extends any[]>(props?: IndexProps<T>): someView; 

interface ShowProps {
  when: EffectCallback<boolean>;
  /**
   * @deprecated just access a signals value in the when callback
   */
  switch?: any;
  /**
   * @deprecated the children callback can return a fallback now
   * DO NOT USE
   */
  fallback?: any;
  children: (boolean: boolean) => someView;
}

export declare function Show(
  props?: ShowProps
): someView;
export declare function Show(
  props?: ShowProps
): someView;

export const lazy: AsyncComponent<Props>;
