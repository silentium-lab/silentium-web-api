import { sourceOf, sourceSync } from "silentium";
import { historyPoppedPage } from "../history-api/HistoryPoppedPage";
import { expect, test } from "vitest";

test("HistoryPoppedPage.test.ts", () => {
  const destroyed = sourceOf<void>();
  const handlers = new Map();
  const fakeWindowListener = {
    addEventListener(name: string, handler: (e: PopStateEvent) => void) {
      handlers.set(handler, 1);
    },
    removeEventListener(name: string, handler: (e: PopStateEvent) => void) {
      handlers.delete(handler);
    },
  };
  const page = sourceSync(historyPoppedPage(fakeWindowListener, destroyed));

  const iterator = handlers.keys();
  for (const handler of iterator) {
    handler({ state: { url: "/new-iterator" } });
  }

  expect(page.syncValue()).toBe("/new-iterator");
});
