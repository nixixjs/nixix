import {
  AgnosticIndexRouteObject,
  AgnosticRouteMatch,
  matchPath,
} from "@remix-run/router";
import { NonPrimitive, Signal, Store, store } from "../primitives";
import { raise } from "../shared";
import type { EmptyObject } from "../types";
import { navigate } from "./Router";
import { ActionFunction, ActionProps, PathToRoute } from "./types/index";

type ActionState = {
  data: EmptyObject;
  error: string | null | undefined;
};

export class ActionHandler {
  static handlerMap = new Map<
    PathToRoute,
    ReturnType<typeof store<ActionState>>
  >();

  static setRouteAction(path: PathToRoute) {
    this.handlerMap.set(
      path,
      store<ActionState>({
        error: null,
        data: {},
      })
    );
  }

  static getActionState(path: PathToRoute) {
    return this.handlerMap.get(path);
  }
}

type CallActionConfig = {
  actionPath: `/${string}`;
  formData: FormData;
  routeMatch: AgnosticRouteMatch<string, AgnosticIndexRouteObject>;
  status: Signal<true | false> | null | undefined;
};

export async function callAction({
  actionPath,
  formData,
  routeMatch,
  status,
}: CallActionConfig) {
  const {
    params,
    route: { action },
  } = routeMatch;
  const payLoad = {
    params: params || {},
    request: new Request(actionPath),
  } as ActionProps;
  payLoad.request.formData = async () => formData;
  const [, setActionState] = ActionHandler.getActionState(actionPath!)! || [];
  status && (status.value = true);
  (action as ActionFunction)?.(payLoad)
    .then((data) => setActionState?.({ data, error: null }))
    .catch((error) => setActionState?.({ data: {}, error }))
    .finally(() => {
      // @ts-expect-error
      status && (status.value = false);
      navigate(actionPath);
    });
}

export function actionData<T extends NonPrimitive>(
  path: `/${string}`,
  value: T
) {
  let state = null as unknown as Store<ActionState>;
  ActionHandler.handlerMap.forEach(([loaderState, setLoaderState], key) => {
    if (matchPath(key, path)) {
      // @ts-expect-error
      setLoaderState({
        ...loaderState,
        data: value,
      });
      state = loaderState;
    }
  });
  if (state === null) {
    raise(`No route actions were found for ${path}`);
  }
  return state;
}
