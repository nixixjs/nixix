import { createFragment } from "../dom/helpers";
import { LiveFragment } from "../live-fragment";
import { reaction } from "../primitives";
import {
  arrayOfJSX,
  createBoundary,
  removeNodes,
  numArray,
  getIncrementalNodes,
  compFallback,
} from "./helpers";

/**
 * A higher-order component that renders a list of items using the provided `each` array and a callback function to generate the child elements.
 * 
 * @param props - An object containing the following properties:
 *   - `fallback`: An optional JSX element to render when the `each` array is empty.
 *   - `children`: An array containing a single callback function that will be used to generate the child elements.
 *   - `each`: An array of items to be rendered.
 * 
 * @returns A comment boundary that wraps the rendered list of items.
 */
export function For(props: ForProps) {
  let { fallback, children: childrenCallback, each } = props;
  fallback = fallback || (compFallback() as any);
  let children = arrayOfJSX(each, childrenCallback);
  const commentBoundary = createBoundary(createFragment(children), "for");
  const liveFragment: LiveFragment = new LiveFragment(
    commentBoundary.firstChild!,
    commentBoundary.lastChild!
  );

  reaction(
    function ForEff() {
      const eachLen = each.length;
      if (eachLen === 0) {
        return liveFragment.replace(
          (removeNodes(eachLen, liveFragment), createFragment(fallback))
        );
      } else {
        if (fallback?.[0]?.isConnected || (fallback as Element)?.isConnected) {
          liveFragment.empty();
        }
        let childnodesLength = liveFragment.childNodes.length;
        if (childnodesLength === eachLen) return;
        if (childnodesLength > eachLen) {
          removeNodes(eachLen, liveFragment);
        } else if (childnodesLength < eachLen) {
          // nodes -> 3, eachLen -> 6 --> create new nodes and append
          const indexArray = numArray(childnodesLength, eachLen);
          children = getIncrementalNodes(indexArray, each, childrenCallback);
          liveFragment.append(createFragment(children));
        }
      }
    },
    [each]
  );

  return commentBoundary;
}
