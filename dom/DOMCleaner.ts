export type NodeCleanupMap = WeakMap<Node, () => void>;

export default class NixixDOMCleaner {
  private static instance: NixixDOMCleaner;
  private observer: MutationObserver;
  private cleanupMap: NodeCleanupMap;

  private constructor() {
    this.cleanupMap = new WeakMap();
    this.observer = new MutationObserver(this.handleMutations.bind(this));
  }

  public static getInstance(): NixixDOMCleaner {
    if (!NixixDOMCleaner.instance) {
      NixixDOMCleaner.instance = new NixixDOMCleaner();
    }
    return NixixDOMCleaner.instance;
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
      // Handle the current node
      this.cleanupNode(node);

      // Recursively handle all child nodes if this is an element
      if (node instanceof Element) {
        this.processChildNodes(node);
      }
    });
  }

  private processChildNodes(element: Element): void {
    // Use querySelectorAll to get ALL descendant elements
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

  // Optional: method to clear all cleanups
  public clearAllCleanups(): void {
    this.cleanupMap = new WeakMap();
  }
}

// Export a single instance
export const domCleaner = NixixDOMCleaner.getInstance();

// Example usage in NixixJS
// Now anywhere in your code, you can use it like this:
function registerNodeWithNixix(node: Node, someReference: any) {
  domCleaner.registerCleanup(node, () => {
    console.log('Cleaning up node:', node);
    someReference = null;
  });
}

// Start observing
domCleaner.observe(document.body);