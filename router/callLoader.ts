import {
  AgnosticRouteMatch,
  AgnosticRouteObject,
  matchPath
} from "@remix-run/router";
import { Store, store, type NonPrimitive } from "../primitives";
import { EmptyObject } from "../types";
import { getWinPath } from "./helpers";
import type { LoaderFunction, LoaderProps, PathToRoute } from "./types/index";

type LoaderState = {
  loading: boolean;
  data: EmptyObject;
}

export class LoaderHandler {
  static handlerMap = new Map<PathToRoute, ReturnType<typeof store<LoaderState>>>()
  
  static setRouteLoader(path: PathToRoute) {
    this.handlerMap.set(path, store<LoaderState>({
      loading: false,
      data: {}
    }))
  }

  static getLoaderState(path: PathToRoute) {
    return this.handlerMap.get(path)
  }
}

export function callLoader({
  route,
  params
}: Partial<AgnosticRouteMatch<string, AgnosticRouteObject>>) {
  const loader = route?.loader as LoaderFunction
  if (!loader) return undefined;
  const loaderArgs = {
    params: params || {},
    request: new Request(getWinPath()),
  } as LoaderProps;
   loader(loaderArgs).then(data => {
    const [, setLoadingState] = LoaderHandler.getLoaderState(route?.path as PathToRoute) || [];
    setLoadingState?.({
      loading: false,
      data: data || {}
    })
   })
}

export function loaderData<T extends NonPrimitive>(path: `/${string}`, value: T) {
  let state = null as unknown as Store<LoaderState>;
  LoaderHandler.handlerMap.forEach(([loaderState, setLoaderState], key) => {
    if (matchPath(key, path)) {
      setLoaderState({
        ...loaderState,
        data: value
      })
      state = loaderState
    }
  })
  return state;
}
