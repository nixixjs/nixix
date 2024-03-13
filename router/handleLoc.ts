import { nixixStore } from "../dom";
import { createFragment } from "../dom/helpers";
import { buildComponent } from "../dom/index";
import { isFunction } from "../shared";
import { LoaderHandler, callLoader } from "./callLoader";

export function handleLocation() {
  const {
    $$__routeStore: { provider, routeMatch },
  } = nixixStore as Required<typeof nixixStore>;
  switchRoutes({ provider, routeMatch });
  callLoader(routeMatch!)
}

export function switchRoutes({
  provider,
  routeMatch,
}: Required<typeof nixixStore>["$$__routeStore"]) {
  const route = routeMatch!.route;
  const element = route.element;
  switch (element) {
    case null:
    case undefined:
      break;
    default:
      nixixStore.$$__routeStore!.currentRoute! = route;
      let routePage: any;
      if (isFunction(element)) {
        routePage = buildComponent(element, {}, []);
        route.element = routePage;
      } else routePage = element;
      provider?.replace(createFragment(routePage));
      const [loadingState, setLoadingState] =
        LoaderHandler.getLoaderState(route.path!)! || [];
      setLoadingState?.({ ...loadingState, loading: true });
      break;
  }
}

export function changeTitle(title: string) {
  document.title = title;
}
