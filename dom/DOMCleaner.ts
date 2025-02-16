export type NodeCleanupMap = WeakMap<Node, () => void>;

export default class DOMCleaner {
  private static instance: DOMCleaner;
  private observer: MutationObserver;
  private cleanupMap: NodeCleanupMap;

  private constructor() {
    this.cleanupMap = new WeakMap();
    this.observer = new MutationObserver(this.handleMutations.bind(this));
  }

  public static getInstance(): DOMCleaner {
    if (!DOMCleaner.instance) {
      DOMCleaner.instance = new DOMCleaner();
    }
    return DOMCleaner.instance;
  }

  private handleMutations(mutations: MutationRecord[]): void {
    for (const mutation of mutations) {
      if (mutation.removedNodes.length > 0) {
        this.processRemovedNodes(mutation.removedNodes);
      }
    }
  }

  private processRemovedNodes(nodes: NodeList): void {
    nodes.forEach(node => {
      this.cleanupNode(node);
      if (node instanceof Element) {
        this.processChildNodes(node);
      }
    });
  }

  private processChildNodes(element: Element): void {
    const children = element.querySelectorAll('*');
    children.forEach(child => {
      this.cleanupNode(child);
    });
  }

  private cleanupNode(node: Node): void {
    if (this.cleanupMap.has(node)) {
      const cleanup = this.cleanupMap.get(node);
      cleanup?.();
      this.cleanupMap.delete(node);
    }
  }

  public registerCleanup(node: Node, cleanup: () => void): void {
    this.cleanupMap.set(node, cleanup);
  }

  public observe(rootNode: Node): void {
    this.observer.observe(rootNode, {
      childList: true,
      subtree: true
    });
  }

  public disconnect(): void {
    this.observer.disconnect();
  }

  public clearAllCleanups(): void {
    this.cleanupMap = new WeakMap();
  }
}