import { all, DataType } from "silentium";

/**
 * Helps to print logs to somewhere
 * https://developer.mozilla.org/en-US/docs/Web/API/Console_API
 */
export const log = <T>(
  sourceSrc: DataType<T>,
  titleSrc: DataType<string>,
): DataType<T> => {
  return (u) => {
    all(
      sourceSrc,
      titleSrc,
    )(([source, title]) => {
      console.log("LOG:", title, source);
      u(source);
    });
  };
};
