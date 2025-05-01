import { source, sourceAll, sourceOf, SourceType, value } from "silentium";

/**
 * Represents link what when it will be clicked, then source will be
 * filled with clicked href value
 */
export const link = (
  wrapperSrc: SourceType<HTMLElement>,
  elementSelectorSrc: SourceType<string>,
  attributeSrc = source<string>("href"),
): SourceType<string> => {
  const result = sourceOf<string>();

  value(
    sourceAll([wrapperSrc, elementSelectorSrc, attributeSrc]),
    ([wrapper, elementSelector, attribute]) => {
      wrapper.addEventListener("click", (e) => {
        if (
          e.target !== null &&
          "matches" in e.target &&
          typeof e.target.matches == "function" &&
          e.target.matches(elementSelector)
        ) {
          e.preventDefault();
          const href = (e?.target as HTMLElement)?.getAttribute(attribute);
          if (href) {
            result.give(href);
          }
        }
      });
    },
  );

  return result;
};
