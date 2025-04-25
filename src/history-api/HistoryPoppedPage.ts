import {
  destroy,
  give,
  GuestType,
  patronOnce,
  sourceOf,
  SourceType,
  value,
} from "silentium";

type WindowListener<T> = {
  addEventListener: (name: string, handler: (e: T) => void) => void;
  removeEventListener: (name: string, handler: (e: T) => void) => void;
};

export const historyPoppedPage = (
  pageGuest: GuestType<string>,
  destroyedSrc: SourceType<void>,
  listenSrc: SourceType<WindowListener<PopStateEvent>>,
) => {
  const result = sourceOf<string>();
  result.value(pageGuest);

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
