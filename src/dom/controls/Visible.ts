import { patron, sourceAll, SourceType, value } from "silentium";

export const visible = (
  valueSrc: SourceType<boolean>,
  elementSrc: SourceType<HTMLElement>,
  visibilityTypeSrc: SourceType<string> = "block",
) => {
  value(
    sourceAll([valueSrc, elementSrc, visibilityTypeSrc]),
    patron(([v, el, vt]) => {
      el.style.display = v ? vt : "none";
    }),
  );

  return valueSrc;
};
