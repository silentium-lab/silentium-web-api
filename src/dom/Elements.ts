import { From, TheInformation, TheOwner } from "silentium";

/**
 * Represents a collection of elements that match a given CSS selector.
 */
export class Elements extends TheInformation<HTMLElement[]> {
  public constructor(private selectorSrc: TheInformation<string>) {
    super(selectorSrc);
  }

  public value(o: TheOwner<HTMLElement[]>): this {
    this.selectorSrc.value(
      new From((selectorContent) => {
        const element = document.querySelectorAll(selectorContent);
        if (element.length) {
          o.give(Array.from(element) as HTMLElement[]);
        } else {
          const targetNode = document.body;
          const config = { childList: true, subtree: true };

          const observer = new MutationObserver((mutationsList) => {
            for (const mutation of mutationsList) {
              if (mutation.type === "childList") {
                const element = document.querySelectorAll(selectorContent);
                if (element) {
                  o.give(Array.from(element) as HTMLElement[]);
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

    return this;
  }
}
