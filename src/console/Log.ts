import { all, InformationType } from "silentium";

/**
 * Helps to print logs to somewhere
 * https://developer.mozilla.org/en-US/docs/Web/API/Console_API
 */
export const log = <T>(
  sourceSrc: InformationType<T>,
  titleSrc: InformationType<string>,
): InformationType<T> => {
  return (o) => {
    all(
      sourceSrc,
      titleSrc,
    )(([source, title]) => {
      console.log("LOG:", title, source);
      o(source);
    });
  };
};
