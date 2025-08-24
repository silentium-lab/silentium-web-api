import { expect, test, vi } from "vitest";
import { AnimationFrame } from "./AnimationFrame";
import { From } from "silentium";

test("AnimationFrame.test", () => {
  global.requestAnimationFrame = (cb: FrameRequestCallback) => {
    return cb(1) as unknown as number;
  };
  const af = new AnimationFrame();
  const g = vi.fn();
  af.value(new From(g));

  expect(g).toHaveBeenCalledTimes(1);
});
