import { InformationType } from "silentium";

/**
 * Presents animation frame and provides it as a callback
 * function that will be executed whenever the browser
 * is ready to render a new frame.
 */
export const animationFrame = (): InformationType<number> => {
  return (o) => {
    requestAnimationFrame(() => {
      o(1);
    });
  };
};
