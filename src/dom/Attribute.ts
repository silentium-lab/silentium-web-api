import {
  give,
  patron,
  sourceAll,
  sourceOf,
  SourceType,
  subSourceMany,
  value,
} from "silentium";

export const attribute = (
  elementSrc: SourceType<HTMLElement>,
  attrNameSrc: SourceType<string>,
  defaultValueSrc: SourceType<string> = "",
) => {
  const result = sourceOf<string>();
  subSourceMany(result, [elementSrc, attrNameSrc, defaultValueSrc]);

  value(
    sourceAll([elementSrc, attrNameSrc, defaultValueSrc]),
    patron(([el, attrName, defaultValue]) => {
      give(el.getAttribute(attrName) || defaultValue, result);
    }),
  );

  return result;
};
