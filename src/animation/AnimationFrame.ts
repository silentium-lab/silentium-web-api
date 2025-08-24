import { OwnerType, TheInformation } from "silentium";

/**
 * Presents animation frame and provides it as a callback
 * function that will be executed whenever the browser
 * is ready to render a new frame.
 */
export class AnimationFrame extends TheInformation<number> {
  public value(o: OwnerType<number>): this {
    requestAnimationFrame(() => {
      o.give(1);
    });

    return this;
  }
}
