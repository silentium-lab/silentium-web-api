import { patron, sourceAll, SourceType, value } from "silentium";

type LogAware = { log: (...args: unknown[]) => unknown };

/**
 * Helps to print logs to somewhere
 * https://developer.mozilla.org/en-US/docs/Web/API/Console_API
 */
export const log = <T>(
  source: SourceType<T>,
  title: SourceType<string> = "",
  consoleLike: SourceType<LogAware> = console,
): SourceType<T> => {
  const all = sourceAll([source, title, consoleLike]);

  value(
    all,
    patron(([s, title, console]) => {
      console.log("LOG:", title, s);
    }),
  );

  return source;
};
