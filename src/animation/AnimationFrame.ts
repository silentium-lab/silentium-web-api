import { EventType } from "silentium";

/**
 * Presents animation frame and provides it as a callback
 * function that will be executed whenever the browser
 * is ready to render a new frame.
 */
export function AnimationFrame(): EventType<number> {
  return (u) => {
    requestAnimationFrame(() => {
      u(1);
    });
  };
}
