import { createFragment } from "../dom/helpers";
import { LiveFragment } from "../live-fragment";
import { renderEffect } from "../primitives";
import { compFallback, createBoundary, getShow } from "./helpers";

// first is that we want to call the when callback and then check what we should render.

export function Show(props: ShowProps): DocumentFragment {
  let { children, when, fallback } = props;
  fallback = createFragment(fallback || (compFallback() as any));
  children = createFragment(children);
  let bool: boolean | null = null;
  let commentBoundary: DocumentFragment | null = null;
  let liveFragment: LiveFragment | null = null;

  renderEffect(function ShowEff() {
    const nextBool = when();
    if (bool === null) {
      // first time checking here;
      bool = nextBool;
      commentBoundary = createBoundary(getShow(nextBool!, children, fallback), "show");
      liveFragment = new LiveFragment(
        commentBoundary.firstChild!,
        commentBoundary.lastChild!
      );
    } else {
      // subsequent times here
      if (nextBool === bool) return;
      switch (nextBool) {
        case true:
          fallback = liveFragment!.childNodes;
          liveFragment!.replace(createFragment(children));
          bool = nextBool;
          break;
        case false:
          children = liveFragment!.childNodes;
          liveFragment!.replace(createFragment(fallback));
          bool = nextBool;
          break;
      }
    }
  });

  return commentBoundary!;
}
