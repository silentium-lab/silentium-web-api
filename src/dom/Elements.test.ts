import { expect, test, vi } from "vitest";
import { elements } from "./Elements";
import { i } from "silentium";

test("Elements.test", () => {
  const mockQuerselector = vi.fn().mockReturnValue([{ id: "mock" }]);
  global.document = {
    querySelectorAll: mockQuerselector,
  } as unknown as Document;

  const el = elements(i(".test"));
  const g = vi.fn();
  el(g);

  expect(g).toHaveBeenLastCalledWith([{ id: "mock" }]);
});
