import { DataType } from "silentium";

/**
 * Represents a collection of elements that match a given CSS selector.
 */
export const elements = <T extends HTMLElement>(
  selectorSrc: DataType<string>,
): DataType<T[]> => {
  return (u) => {
    selectorSrc((selectorContent) => {
      const element = document.querySelectorAll(selectorContent);
      if (element.length) {
        u(Array.from(element) as T[]);
      } else {
        const targetNode = document.body;
        const config = { childList: true, subtree: true };

        const observer = new MutationObserver((mutationsList) => {
          for (const mutation of mutationsList) {
            if (mutation.type === "childList") {
              const element = document.querySelectorAll(selectorContent);
              if (element) {
                u(Array.from(element) as T[]);
                observer.disconnect();
                break;
              }
            }
          }
        });

        observer.observe(targetNode, config);
      }
    });
  };
};
