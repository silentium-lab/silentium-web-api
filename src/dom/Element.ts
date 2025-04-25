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
 */
export const element = (
  selectorSrc: SourceType<string>,
  documentSrc: SourceType<Document>,
  createObserver?: PersonalType<MutationAware>,
): SourceType<HTMLElement> => {
  const all = sourceAll([selectorSrc, documentSrc]);

  return (guest: GuestType<HTMLElement>) => {
    value(
      all,
      guestCast(guest, ([selector, document]) => {
        const element = document.querySelector(selector);
        if (element) {
          give(element as HTMLElement, guest);
        } else if (createObserver) {
          const targetNode = document.body;
          const config = { childList: true, subtree: true };

          const observer = createObserver.get((mutationsList: MutationList) => {
            for (const mutation of mutationsList) {
              if (mutation.type === "childList") {
                const element = document.querySelector(selector);
                if (element) {
                  give(element as HTMLElement, guest);
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
