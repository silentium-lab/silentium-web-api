import {
  give,
  guestCast,
  GuestType,
  sourceAll,
  SourceType,
  value,
} from "silentium";

export const documentTitle = (
  documentSrc: SourceType<Document>,
  titleSrc: SourceType<string>,
) => {
  return (g: GuestType<string>) => {
    value(
      sourceAll([titleSrc, documentSrc]),
      guestCast(g, ([title, document]) => {
        document.title = title;
        give(title, g);
      }),
    );
  };
};
