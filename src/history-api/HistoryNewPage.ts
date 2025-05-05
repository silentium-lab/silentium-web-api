import { patron, sourceAll, SourceType, value } from "silentium";

type PushStateAwareType = {
  pushState(data: Record<string, unknown>, title: string, url: string): void;
};

/**
 * Apply content of new url to history API
 * https://developer.mozilla.org/en-US/docs/Web/API/History_API
 */
export const historyNewPate = (
  pushSrc: SourceType<PushStateAwareType>,
  urlSrc: SourceType<string>,
) => {
  value(
    sourceAll([urlSrc, pushSrc]),
    patron(([url, push]) => {
      push.pushState(
        {
          url,
          date: Date.now(),
        },
        "",
        url,
      );
    }),
  );

  return urlSrc;
};
