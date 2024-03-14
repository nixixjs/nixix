import { AgnosticIndexRouteObject, AgnosticRouteMatch, matchPath } from "@remix-run/router";
import { NonPrimitive, Store, store } from "../primitives";
import { raise } from "../shared";
import type { EmptyObject } from "../types";
import { navigate } from "./Router";
import {
  ActionFunction,
  ActionProps,
  PathToRoute
} from "./types/index";

type ActionState = {
  data: EmptyObject,
  loading: boolean;
}

export class ActionHandler {
  static handlerMap = new Map<PathToRoute, ReturnType<typeof store<ActionState>>>()

  static setRouteAction(path: PathToRoute) {
    this.handlerMap.set(path, store<ActionState>({
      loading: true,
      data: {}
    }))
  }

  static getActionState(path: PathToRoute) {
    return this.handlerMap.get(path)
  }

}

type CallActionConfig = {
  actionPath: `/${string}`
  formData: FormData;
  routeMatch: AgnosticRouteMatch<string, AgnosticIndexRouteObject>
};

export async function callAction({ actionPath, formData, routeMatch }: CallActionConfig) {
  const { params, route: { action } } = routeMatch  
  const payLoad = {
    params: params || {},
    request: new Request(actionPath),
  } as ActionProps;
  payLoad.request.formData = async () => formData;
  const [actionState, setActionState] = ActionHandler.getActionState(actionPath!)! || [];
  setActionState?.({ ...actionState, loading: true });
  navigate(actionPath);
  (action as ActionFunction)?.(payLoad).then(data => {
    setActionState?.({ data, loading: false });
  })
}

export function actionData<T extends NonPrimitive>(path: `/${string}`, value: T) {
  let state = null as unknown as Store<ActionState>;
  ActionHandler.handlerMap.forEach(([loaderState, setLoaderState], key) => {
    if (matchPath(key, path)) {
      setLoaderState({
        ...loaderState,
        data: value
      })
      state = loaderState
    }
  })
  if (state === null) {
    raise(`No route actions were found for ${path}`)
  }
  return state;
}