import { Event, EventType, Transport } from "silentium";

/**
 * Represents an element that matches a given CSS selector.
 * If the element exists immediately, returns it.
 * If not, waits for it to appear in the DOM.
 */
export function Element<T extends HTMLElement>(
  $selector: EventType<string>,
): EventType<T | null> {
  return Event((t) => {
    $selector.event(
      Transport((selector) => {
        const element = document.querySelector(selector) as T | null;
        if (element) {
          t.use(element);
        } else {
          const targetNode = document;
          const config = {
            childList: true,
            subtree: true,
            attributes: true,
            attributeFilter: ["class", "id"],
          };

          const observer = new MutationObserver((mutationsList) => {
            for (const mutation of mutationsList) {
              if (mutation.type === "childList") {
                // Check added nodes and their descendants
                const checkNodes = (nodes: NodeList) => {
                  for (const node of Array.from(nodes)) {
                    if (node.nodeType === Node.ELEMENT_NODE) {
                      const element = node as Element;
                      if (element.matches && element.matches(selector)) {
                        t.use(element as T);
                        observer.disconnect();
                        return true;
                      }
                      // Check descendants
                      if (
                        element.querySelector &&
                        element.querySelector(selector)
                      ) {
                        const found = element.querySelector(selector) as T;
                        t.use(found);
                        observer.disconnect();
                        return true;
                      }
                    }
                  }
                  return false;
                };

                if (checkNodes(mutation.addedNodes)) {
                  break;
                }
              } else if (mutation.type === "attributes") {
                // Check if the mutated element now matches the selector
                const target = mutation.target as Element;
                if (target.matches && target.matches(selector)) {
                  t.use(target as T);
                  observer.disconnect();
                  break;
                }
              }
            }
          });

          observer.observe(targetNode, config);
        }
      }),
    );
  });
}
