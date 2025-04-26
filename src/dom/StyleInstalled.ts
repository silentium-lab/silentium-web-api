import {
  give,
  guestCast,
  GuestType,
  sourceAll,
  SourceType,
  value,
} from "silentium";

/**
 * Render styles to document
 * https://developer.mozilla.org/en-US/docs/Web/API/HTML_DOM_API
 */
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
