import { Of } from "silentium";
import { Elements } from "../dom/Elements";
import { expect, test, vi } from "vitest";

test("Elements.test", () => {
  const mockQuerySelector = vi.fn().mockReturnValue([{ id: "mock" }]);
  global.document = {
    querySelectorAll: mockQuerySelector,
  } as unknown as Document;

  const el = Elements(Of(".test"));
  const g = vi.fn();
  el(g);

  expect(g).toHaveBeenLastCalledWith([{ id: "mock" }]);
});
