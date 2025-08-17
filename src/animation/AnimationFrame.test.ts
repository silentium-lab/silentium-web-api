import { expect, test, vi } from "vitest";
import { animationFrame } from "./AnimationFrame";

test("AnimationFrame.test", () => {
  global.requestAnimationFrame = (cb: FrameRequestCallback) => {
    return cb(1) as unknown as number;
  };
  const af = animationFrame();
  const g = vi.fn();
  af(g);

  expect(g).toHaveBeenCalledTimes(1);
});
