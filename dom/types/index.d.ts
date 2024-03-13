import { AgnosticRouteObject } from "@remix-run/router";
import { LiveFragment } from "../../live-fragment/types";
import Nixix from "../../types/index";

type RouteObject = {
  element?: any;
  path?: `/${string}`;
} & AgnosticRouteObject;

interface $$__NixixStore {
  commentForLF: boolean;
  $$__routeStore?: {
    errorRoute?: RouteType;
    provider?: LiveFragment;
    routeMatch?: {
      route: RouteObject;
    };
    redirect?: string | null;
    currentRoute?: RouteObject;
  };
}

declare module '../../types/index.d.ts' {
  const nixixStore: $$__NixixStore;
  /**
   * @deprecated PLEASE DO NOT USE THIS FUNCTION
   */
  function getStoreValue(store: any): any;

  type Tagname = | keyof HTMLElementTagNameMap
  | keyof SVGElementTagNameMap
  | JSXElementConstructor<EmptyObject>
  | 'fragment';

  function create<T extends Tagname>(
    tagNameFC: T,
    // @ts-ignore
    props: JSX.IntrinsicElements[T],
    ...children: NixixNode[]
  ): NixixNode

  type RenderConfig = {
    commentForLF: boolean;
  };

  /**
   * render function
   * @param element JSX.Element to render | preferably a function to return the jsx.element
   * @param root element which element will be appended to
   */
  function render(
    element: NixixNode | (() => NixixNode),
    root: HTMLElement,
    { commentForLF }?: RenderConfig
  ): void;

  /**
   * This function should be used to remove nodes, it also removes reactions and signals from the nodes, thereby helping in garbage collection of dom nodes.
   */
  function removeNode(node: Element | Text): boolean;

}

export as namespace Nixix;
export = Nixix;