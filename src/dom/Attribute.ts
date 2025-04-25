import {
  give,
  patron,
  sourceAll,
  sourceChangeable,
  SourceType,
  subSourceMany,
  value,
} from "silentium";

export const attribute = (
  elementSrc: SourceType<HTMLElement>,
  attrNameSrc: SourceType<string>,
  defaultValueSrc: SourceType<string> = "",
) => {
  const all = sourceAll([elementSrc, attrNameSrc, defaultValueSrc]);
  const result = sourceChangeable<string>();
  subSourceMany(result, [elementSrc, attrNameSrc, defaultValueSrc]);

  value(
    all,
    patron(([el, attrName, defaultValue]) => {
      give(el.getAttribute(attrName) || defaultValue, result);
    }),
  );

  return result;
};
