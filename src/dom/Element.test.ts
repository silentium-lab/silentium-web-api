import { Of, Tap } from "silentium";
import { Element } from "../dom/Element";
import { expect, test, vi } from "vitest";

test("Element.test", () => {
  const mockQuerySelector = vi.fn().mockReturnValue({ id: "mock" });
  global.document = {
    querySelector: mockQuerySelector,
  } as unknown as Document;

  const el = Element(Of(".test"));
  const g = vi.fn();
  el.pipe(Tap(g));

  expect(g).toHaveBeenLastCalledWith({ id: "mock" });
});
