import { sourceOf, sourceSync } from "silentium";
import { historyNewPate } from "../history-api/HistoryNewPage";
import { expect, test } from "vitest";

test("HistoryNewPage.test", () => {
  const url = sourceOf<string>("/current");
  const urlSynced = sourceOf<string>("");
  const pushAware = {
    pushState(data: Record<string, string>) {
      urlSynced.give(data.url);
    },
  };

  sourceSync(historyNewPate(pushAware, url));
  url.give("/new");

  const urlSync = sourceSync(urlSynced);

  expect(urlSync.syncValue()).toBe("/new");
});
