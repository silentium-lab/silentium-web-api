import { Message } from "silentium";

/**
 * Presents animation frame and provides it as a callback
 * function that will be executed whenever the browser
 * is ready to render a new frame.
 */
export function AnimationFrame() {
  return Message<number>((t) => {
    requestAnimationFrame(() => {
      t.use(1);
    });
  });
}
