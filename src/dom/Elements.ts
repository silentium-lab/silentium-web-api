import {
  give,
  guestCast,
  GuestType,
  PersonalType,
  sourceAll,
  SourceType,
  value,
} from "silentium";

type MutationAware = {
  observe(
    node: HTMLElement,
    config: { childList: boolean; subtree: boolean },
  ): void;
  disconnect(): void;
};

type MutationList = { type: string }[];

/**
 * Helps to find element by selector
 * https://developer.mozilla.org/en-US/docs/Web/API/HTML_DOM_API
 */
export const elements = <T extends HTMLElement[]>(
  createObserver: PersonalType<MutationAware>,
  documentSrc: SourceType<Document>,
  selectorSrc: SourceType<string>,
): SourceType<T> => {
  return (guest: GuestType<T>) => {
    value(
      sourceAll([selectorSrc, documentSrc]),
      guestCast(guest, ([selector, document]) => {
        const element = document.querySelectorAll(selector);
        if (element) {
          give(Array.from(element) as T, guest);
        } else if (createObserver) {
          const targetNode = document.body;
          const config = { childList: true, subtree: true };

          const observer = createObserver.get((mutationsList: MutationList) => {
            for (const mutation of mutationsList) {
              if (mutation.type === "childList") {
                const element = document.querySelectorAll(selector);
                if (element) {
                  give(Array.from(element) as T, guest);
                  observer.disconnect();
                  break;
                }
              }
            }
          });

          observer.observe(targetNode, config);
        } else {
          throw new Error(`Element with selector=${selector} was not found!`);
        }
      }),
    );
  };
};
