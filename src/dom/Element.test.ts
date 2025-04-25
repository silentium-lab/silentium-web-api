import { sourceSync } from "silentium";
import { jsdomDocument } from "silentium-jsdom";
import { element } from "../dom/Element";
import { expect, test } from "vitest";

test("Element.test", () => {
  const document = jsdomDocument(
    `<div class="menu"><div class="target-selector">Content</div></div>`,
  );
  const el = sourceSync(element(".target-selector", document));

  expect(el.syncValue().textContent).toBe("Content");
});
