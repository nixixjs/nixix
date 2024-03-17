import { MemoStore, NonPrimitive, Signal } from "../../primitives/types";
import {
  AnchorHTMLAttributes,
  Component,
  EmptyObject,
  ExoticComponent,
  FormHTMLAttributes,
  NixixNode,
  RouteExoticComponent,
} from "../../types";

export interface LoaderProps {
  params: EmptyObject<string | undefined>;
  /**
   * Experimental *use at your own risk*
   */
  request: Request;
}

export interface ActionProps extends LoaderProps {}

export interface LoaderFunction {
  (config: LoaderProps): Promise<any>;
}

export type ActionFunction<T = Promise<object>> = (config: ActionProps) => T;

export type RoutePath = string;
export interface RouteLink<T extends string>
  extends AnchorHTMLAttributes<HTMLAnchorElement> {
  children?: NixixNode;
  to: T;
}
export interface RouteConfig<T extends string> {
  /**
   * element should be called only when we hit a route match
   */
  element: (() => NixixNode) | typeof Component;
  children?: NixixNode;
  path?: T;
  errorRoute?: boolean;
  loader?: LoaderFunction;
  action?: ActionFunction;
}

export type FormActionProps = {
  action: `/${string}`;
  method: "put" | "post" | "delete" | "patch";
  "bind:isSubmitting"?: Signal<boolean>
} & FormHTMLAttributes<HTMLFormElement>;

export type PathToRoute = `/${string}`;
declare const Link: <T extends Signal<string> | PathToRoute>(props: RouteLink<T>) => someView;
declare const Routes: ExoticComponent<{
  children?: NixixNode;
  viewTransitions?: boolean;
}>;
declare const Route: <T extends PathToRoute>(props: RouteConfig<T>) => someView;
declare const Form: (props: FormActionProps) => someView;
/**
 * ```jsx
 *  Should be used to programmatically switch routes.
 *
 *  import { Router } from 'nixix/router';
 *  function signUp() {
      // code goes here
      Router.push('/home')
}
 * ```
 */
declare const Router: RouteExoticComponent<{
  push: <P extends PathToRoute>(path: P) => void;
}>;

type PathFunction<T> = (path: PathToRoute) => T;

/**
 * To be used to navigate the pages
 */
declare const navigate: PathFunction<void>;

/**
 * To be used within a loader or action context to redirect to new pages
 * Can be used to protect routes
 * @example
 * ```jsx
 *  <Route
 *    path='/users/:id'
 *    loader={async ({params}) => {
 *      const user = fakeDb().get(params.user)
 *      if (user === null) {
 *        return redirect('/sign-in')
 *      }
 *    }}
 *    element={Users}>
 *  </Route>
 * ```
 */
declare const redirect: PathFunction<{}>;

declare const changeTitle: (title: string) => void;

declare type LoaderState<T extends NonPrimitive> = {
  data: MemoStore<T>;
  loading: Signal<boolean>;
};

declare type ActionState<T extends NonPrimitive> = {
  data: MemoStore<T>;
  error: Signal<string | null>;
}

/**
 * Should be called inside a Component only once;
 * @param path path which to get
 * @param value an object which is converted into a store for use.
 */
declare function actionData<T extends EmptyObject>(
  path: PathToRoute,
  value: T
): ActionState<T>

/**
 * Should be called inside a Component only once;
 * @param path path which to get
 * @param value an object which is converted into a store for use.
 */
declare function loaderData<T extends EmptyObject>(
  path: PathToRoute,
  value: T
): LoaderState<T>;

export {
  Form,
  Link,
  Route,
  Router,
  Routes,
  actionData,
  changeTitle,
  loaderData,
  navigate,
  redirect
};

