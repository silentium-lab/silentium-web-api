import { Actual, MaybeMessage, Message } from "silentium";

/**
 * Represents a collection of elements that match a given CSS selector.
 */
export function Elements<T extends HTMLElement>(
  _selector: MaybeMessage<string>,
) {
  const $selector = Actual(_selector);
  return Message<T[]>(function ElementsImpl(r) {
    $selector.then((selector) => {
      const element = document.querySelectorAll(selector);
      if (element.length > 0) {
        r(Array.from(element) as T[]);
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
              // Check if any added nodes match the selector or contain matching elements
              const checkNodes = (nodes: NodeList) => {
                for (const node of Array.from(nodes)) {
                  if (node.nodeType === Node.ELEMENT_NODE) {
                    const element = node as Element;
                    if (element.matches && element.matches(selector)) {
                      const allElements = document.querySelectorAll(selector);
                      if (allElements.length > 0) {
                        r(Array.from(allElements) as T[]);
                        observer.disconnect();
                        return true;
                      }
                    }
                    // Check if this node contains matching elements
                    if (
                      element.querySelector &&
                      element.querySelector(selector)
                    ) {
                      const allElements = document.querySelectorAll(selector);
                      if (allElements.length > 0) {
                        r(Array.from(allElements) as T[]);
                        observer.disconnect();
                        return true;
                      }
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
                const allElements = document.querySelectorAll(selector);
                if (allElements.length > 0) {
                  r(Array.from(allElements) as T[]);
                  observer.disconnect();
                  break;
                }
              }
            }
          }
        });

        observer.observe(targetNode, config);
      }
    });
  });
}
