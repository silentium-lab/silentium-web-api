import { of } from "silentium";
import { elements } from "../dom/Elements";
import { expect, test, vi } from "vitest";

test("Elements.test", () => {
  const mockQuerselector = vi.fn().mockReturnValue([{ id: "mock" }]);
  global.document = {
    querySelectorAll: mockQuerselector,
  } as unknown as Document;

  const el = elements(of(".test"));
  const g = vi.fn();
  el(g);

  expect(g).toHaveBeenLastCalledWith([{ id: "mock" }]);
});
