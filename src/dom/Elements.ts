import { InformationType } from "silentium";

/**
 * Represents a collection of elements that match a given CSS selector.
 */
export const elements = (
  selectorSrc: InformationType<string>,
): InformationType<HTMLElement[]> => {
  return (o) => {
    selectorSrc((selectorContent) => {
      const element = document.querySelectorAll(selectorContent);
      if (element.length) {
        o(Array.from(element) as HTMLElement[]);
      } else {
        const targetNode = document.body;
        const config = { childList: true, subtree: true };

        const observer = new MutationObserver((mutationsList) => {
          for (const mutation of mutationsList) {
            if (mutation.type === "childList") {
              const element = document.querySelectorAll(selectorContent);
              if (element) {
                o(Array.from(element) as HTMLElement[]);
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
