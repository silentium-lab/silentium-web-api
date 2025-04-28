import { patron, sourceAll, SourceType, value } from "silentium";

export const text = (
  valueSrc: SourceType<string>,
  elementSrc: SourceType<HTMLElement>,
) => {
  value(
    sourceAll([valueSrc, elementSrc]),
    patron(([v, el]) => {
      el.textContent = v;
    }),
  );

  return valueSrc;
};
