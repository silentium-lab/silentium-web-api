import { expect, test, vi } from "vitest";
import { AnimationFrame } from "../animation/AnimationFrame";

test("AnimationFrame.test", () => {
  global.requestAnimationFrame = (cb: FrameRequestCallback) => {
    return cb(1) as unknown as number;
  };
  const af = AnimationFrame();
  const g = vi.fn();
  af.then(g);

  expect(g).toHaveBeenCalledTimes(1);
});
