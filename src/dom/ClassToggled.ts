import { SourceType, sourceCombined, GuestType, give } from "silentium";

/**
 * Gives ability to toggle classes of html element
 */
export const classToggled = (
  elementSrc: SourceType<HTMLElement>,
  classSrc: SourceType<string>,
) => {
  return sourceCombined(
    elementSrc,
    classSrc,
  )((g: GuestType<string>, element, theClass) => {
    element.classList.toggle(theClass);
    give(theClass, g);
  });
};

export const classAdded = (
  elementSrc: SourceType<HTMLElement>,
  classSrc: SourceType<string>,
) => {
  return sourceCombined(
    elementSrc,
    classSrc,
  )((g: GuestType<string>, element, theClass) => {
    element.classList.add(theClass);
    give(theClass, g);
  });
};

export const classRemoved = (
  elementSrc: SourceType<HTMLElement>,
  classSrc: SourceType<string>,
) => {
  return sourceCombined(
    elementSrc,
    classSrc,
  )((g: GuestType<string>, element, theClass) => {
    element.classList.remove(theClass);
    give(theClass, g);
  });
};
