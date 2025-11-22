import { Of } from "silentium";
import { expect, test, vi } from "vitest";
import { Elements } from "../dom/Elements";

test("Elements.test", () => {
  const mockQuerySelector = vi.fn().mockReturnValue([{ id: "mock" }]);
  global.document = {
    querySelectorAll: mockQuerySelector,
  } as unknown as Document;

  const el = Elements(Of(".test"));
  const g = vi.fn();
  el.then(g);

  expect(g).toHaveBeenLastCalledWith([{ id: "mock" }]);
});
