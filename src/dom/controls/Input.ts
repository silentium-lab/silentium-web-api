import {
  patron,
  sourceAll,
  SourceChangeableType,
  SourceType,
  value,
} from "silentium";

type InputValue = number | string;

export const input = (
  valueSrc: SourceChangeableType<InputValue>,
  elementSrc: SourceType<HTMLInputElement>,
) => {
  const setValue = () => {
    value(elementSrc, (element) => {
      valueSrc.give(element.value);
    });
  };

  let prevElement: HTMLInputElement | null = null;

  value(
    elementSrc,
    patron((element) => {
      if (prevElement) {
        element.removeEventListener("keyup", setValue);
        element.removeEventListener("change", setValue);
      }

      element.addEventListener("keyup", setValue);
      element.addEventListener("change", setValue);
      prevElement = element;
    }),
  );

  value(
    sourceAll([valueSrc, elementSrc]),
    patron(([value, element]) => {
      element.value = String(value);
    }),
  );

  return valueSrc;
};
