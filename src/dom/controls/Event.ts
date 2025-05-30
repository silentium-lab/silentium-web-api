import {
  give,
  patronOnce,
  sourceDestroyable,
  sourceOnce,
  sourceSync,
  SourceType,
  value,
} from "silentium";

/**
 * Creates a source that emits events from a DOM element.
 */
export const event = <T>(
  elementSrc: SourceType<HTMLElement>,
  eventNameSrc: SourceType<string>,
): SourceType<T> => {
  const elementOnceSrc = sourceOnce(elementSrc);
  const eventNameSync = sourceSync(eventNameSrc);
  return sourceDestroyable((g) => {
    let el: HTMLElement | null = null;
    const eventHandler = (e: Event) => {
      give(e as T, g);
    };
    value(
      elementOnceSrc,
      patronOnce((element) => {
        el = element;
        element.addEventListener(eventNameSync.syncValue(), eventHandler);
      }),
    );
    return () => {
      if (el !== null) {
        el.removeEventListener(eventNameSync.syncValue(), eventHandler);
      }
    };
  });
};
