import {
  give,
  guestCast,
  GuestType,
  sourceAll,
  SourceType,
  value,
} from "silentium";

export const styleInstalled = (
  documentSrc: SourceType<Document>,
  contentSrc: SourceType<string>,
) => {
  return (guest: GuestType<Document>) => {
    value(
      sourceAll([documentSrc, contentSrc]),
      guestCast(guest, ([document, content]) => {
        const styleEl = document.createElement("style");
        styleEl.textContent = content;
        document.head.appendChild(styleEl);
        give(document, guest);
      }),
    );
  };
};
