import { createFragment } from "../dom/helpers";
import { LiveFragment } from "../live-fragment";
import { renderEffect } from "../primitives";
import { createBoundary } from "./helpers";

// first is that we want to call the when callback and then check what we should render.

export function Show(props: ShowProps): DocumentFragment {
  let { children: childrenCallback, when } = props;
  let children = null as any;
  let bool: boolean | null = null;
  let commentBoundary: DocumentFragment | null = null;
  let liveFragment: LiveFragment | null = null;

  renderEffect(function ShowEff() {
    const nextBool = when();
    if (bool === null) {
      // first time checking here, we create the real content to show here
      bool = nextBool;
      children = createFragment(childrenCallback(nextBool));
      commentBoundary = createBoundary(children, "show");
      liveFragment = new LiveFragment(
        commentBoundary.firstChild!,
        commentBoundary.lastChild!
      );
    } else {
      // subsequent times here
      if (nextBool === bool) return;
      switch (nextBool) {
        case true:
          liveFragment!.replace(createFragment(childrenCallback(true)));
          bool = nextBool;
          break;
        case false:
          liveFragment!.replace(createFragment(childrenCallback(false)));
          bool = nextBool;
          break;
      }
    }
  });

  return commentBoundary!;
}
