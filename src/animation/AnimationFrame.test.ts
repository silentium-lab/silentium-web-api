import { AnimationFrame } from "../animation/AnimationFrame";
import { expect, test, vi } from "vitest";

test("AnimationFrame.test", () => {
  global.requestAnimationFrame = (cb: FrameRequestCallback) => {
    return cb(1) as unknown as number;
  };
  const af = AnimationFrame();
  const g = vi.fn();
  af(g);

  expect(g).toHaveBeenCalledTimes(1);
});
