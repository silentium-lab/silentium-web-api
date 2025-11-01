import { Event, EventType, Transport } from "silentium";

/**
 * Represents a collection of elements that match a given CSS selector.
 */
export function Elements<T extends HTMLElement>(
  $selector: EventType<string>,
): EventType<T[]> {
  return Event((t) => {
    $selector.event(
      Transport((selector) => {
        const element = document.querySelectorAll(selector);
        if (element.length) {
          t.use(Array.from(element) as T[]);
        } else {
          const targetNode = document.body;
          const config = { childList: true, subtree: true };

          const observer = new MutationObserver((mutationsList) => {
            for (const mutation of mutationsList) {
              if (mutation.type === "childList") {
                const element = document.querySelectorAll(selector);
                if (element) {
                  t.use(Array.from(element) as T[]);
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
