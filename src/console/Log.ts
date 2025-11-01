import { All, Event, EventType, Transport } from "silentium";

/**
 * Helps to print logs to somewhere
 * https://developer.mozilla.org/en-US/docs/Web/API/Console_API
 */
export function Log<T>(
  sourceSrc: EventType<T>,
  titleSrc: EventType<string>,
): EventType<T> {
  return Event((t) => {
    All(sourceSrc, titleSrc).event(
      Transport(([source, title]) => {
        console.log("LOG:", title, source);
        t.use(source);
      }),
    );
  });
}
