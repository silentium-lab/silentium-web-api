import {
  give,
  guestCast,
  GuestType,
  sourceAll,
  SourceType,
  value,
} from "silentium";

export const documentTitle = (
  titleSrc: SourceType<string>,
  documentSrc: SourceType<Document>,
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
