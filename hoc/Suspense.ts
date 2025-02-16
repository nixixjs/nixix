import { createFragment } from "../dom/helpers";
import { LiveFragment } from "../live-fragment";
import { store, reaction } from "../primitives";
import { compFallback, createBoundary } from "./helpers";
import { raise } from "../shared";

export function Suspense(props: SuspenseProps) {
  let { children, onError, fallback } = props;
  if (!children) {
    raise(`The Suspense component must have children that return a promise.`);
  }
  fallback = fallback || (compFallback() as any);
  const [loading, setLoading] = store(
    {
      rejected: true,
    },
    { equals: true }
  );
  const commentBoundary = createBoundary(fallback as any, "suspense");
  let resolvedJSX: typeof fallback | null = null;
  const liveFragment: LiveFragment = new LiveFragment(
    commentBoundary.firstChild!,
    commentBoundary.lastChild!
  );
  reaction(
    function SuspenseEff() {
      liveFragment.replace(createFragment(resolvedJSX as any) as any);
    },
    [loading]
  );

  Promise.all(children!)
    ?.then((value) => {
      resolvedJSX = value;
      setLoading({
        rejected: false,
      });
    })
    ?.catch(() => {
      resolvedJSX = onError ? onError : fallback;
      onError && setLoading({ rejected: !loading.rejected });
    });
  return commentBoundary;
}
