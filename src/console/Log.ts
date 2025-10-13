import { All, EventType } from "silentium";

/**
 * Helps to print logs to somewhere
 * https://developer.mozilla.org/en-US/docs/Web/API/Console_API
 */
export function Log<T>(
  sourceSrc: EventType<T>,
  titleSrc: EventType<string>,
): EventType<T> {
  return (u) => {
    All(
      sourceSrc,
      titleSrc,
    )(([source, title]) => {
      console.log("LOG:", title, source);
      u(source);
    });
  };
}
