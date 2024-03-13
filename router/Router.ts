import {
  AgnosticRouteMatch,
  AgnosticRouteObject,
  matchRoutes,
} from "@remix-run/router";
import { nixixStore } from "../dom/index";
import { warn } from "../shared";
import { handleLocation } from "./handleLoc";
import { getLink, isNull, pushState } from "./helpers";
import { agnosticRouteObjects } from "./utils";

export function transitionIfSupported(cb: CallableFunction) {
  // @ts-expect-error
  document.startViewTransition?.(cb) || cb()
}

export const Router = {
  push: (path: string) => {
    let { $$__routeStore } = nixixStore as Required<typeof nixixStore>;
    path = getLink(path);
    if ($$__routeStore.currentRoute?.path === path) return;
    const routeMatches = matchRoutes(agnosticRouteObjects, {
      pathname: path,
    })!;
    switch (true) {
      case routeMatches instanceof Array:
        const routeMatch: AgnosticRouteMatch<string, AgnosticRouteObject> =
          routeMatches[routeMatches.length - 1];
        pushState(path);
        nixixStore.$$__routeStore!.routeMatch = routeMatch as any;
        handleLocation();
        break;
      case isNull(routeMatches):
        const errorRoute = $$__routeStore?.errorRoute!;
        if (isNull(errorRoute)) {
          return warn(`Specify an not found route in your Routes component`);
        }
        if (errorRoute)
          pushState(errorRoute.path),
            (nixixStore.$$__routeStore!.routeMatch!.route = errorRoute),
            handleLocation();
        break;
    }
  },
};

export const redirect = (path: `/${string}`) => {
  typeof path === "string" && (nixixStore.$$__routeStore!.redirect = path);
  return;
};

export const navigate = (path: `/${string}`) => {
  // if nixixStore.viewTransitions 
  nixixStore.viewTransitions ? transitionIfSupported(() => Router.push(path)) : Router.push(path)
};
