import {
  give,
  guestCast,
  GuestType,
  sourceAll,
  SourceType,
  value,
} from "silentium";

type PushStateAwareType = {
  pushState(data: Record<string, unknown>, title: string, url: string): void;
};

/**
 * Apply content of new url to history API
 * https://developer.mozilla.org/en-US/docs/Web/API/History_API
 */
export const historyNewPate = (
  urlSrc: SourceType<string>,
  pushSrc: SourceType<PushStateAwareType>,
) => {
  return (guest: GuestType<string>) => {
    value(
      sourceAll([urlSrc, pushSrc]),
      guestCast(guest, ([url, push]) => {
        push.pushState(
          {
            url,
            date: Date.now(),
          },
          "",
          url,
        );
        give(url, guest);
      }),
    );
  };
};
