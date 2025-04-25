import { sourceOf, sourceSync } from "silentium";
import { historyNewPate } from "../history-api/HistoryNewPage";
import { expect, test } from "vitest";

test("HistoryPoppedPage.test.ts", () => {
  const url = sourceOf<string>("/current");
  const urlSynced = sourceOf<string>("");
  const pushAware = {
    pushState(data: Record<string, string>) {
      urlSynced.give(data.url);
    },
  };

  sourceSync(historyNewPate(url, pushAware));
  url.give("/new");

  const urlSync = sourceSync(urlSynced);

  expect(urlSync.syncValue()).toBe("/new");
});
