import { patron, sourceAll, SourceType, value } from "silentium";

export const html = (
  elementSrc: SourceType<HTMLElement>,
  valueSrc: SourceType<string>,
) => {
  value(
    sourceAll([valueSrc, elementSrc]),
    patron(([v, el]) => {
      el.innerHTML = v;
    }),
  );

  return valueSrc;
};
