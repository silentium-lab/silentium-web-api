import { expect, test, vi } from "vitest";
import { Elements } from "./Elements";
import { From, Of } from "silentium";

test("Elements.test", () => {
  const mockQuerselector = vi.fn().mockReturnValue([{ id: "mock" }]);
  global.document = {
    querySelectorAll: mockQuerselector,
  } as unknown as Document;

  const el = new Elements(new Of(".test"));
  const g = vi.fn();
  el.value(new From(g));

  expect(g).toHaveBeenLastCalledWith([{ id: "mock" }]);
});
