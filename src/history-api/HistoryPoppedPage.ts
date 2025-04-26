import {
  destroy,
  give,
  patronOnce,
  sourceOf,
  SourceType,
  value,
} from "silentium";

type WindowListener<T> = {
  addEventListener: (name: string, handler: (e: T) => void) => void;
  removeEventListener: (name: string, handler: (e: T) => void) => void;
};

/**
 * Get source of new page popped from historyAPI
 * https://developer.mozilla.org/en-US/docs/Web/API/History_API
 */
export const historyPoppedPage = (
  destroyedSrc: SourceType<void>,
  listenSrc: SourceType<WindowListener<PopStateEvent>>,
) => {
  const result = sourceOf<string>();

  const handler = (e: PopStateEvent) => {
    const { state } = e;
    if (state?.url) {
      give(String(state.url), result);
    }
  };

  value(
    listenSrc,
    patronOnce((listen) => {
      listen.addEventListener("popstate", handler);
    }),
  );

  value(
    destroyedSrc,
    patronOnce(() => {
      destroy([result]);

      value(listenSrc, (listen) => {
        listen.removeEventListener("popstate", handler);
      });
    }),
  );

  return result;
};
