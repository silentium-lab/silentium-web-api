import { lazyClass, sourceSync } from "silentium";
import { jsdomDocument } from "silentium-jsdom";
import { element } from "../dom/Element";
import { expect, test } from "vitest";
import partial from "lodash.partial";

test("Element.test", () => {
  class Mutation {
    constructor(fn: () => void) {
      fn();
    }
    observe() {}
    disconnect() {}
  }

  const document = jsdomDocument(
    `<div class="menu"><div class="target-selector">Content</div></div>`,
  );
  const docElement = partial(element, lazyClass(Mutation), document);
  const el = sourceSync(docElement(".target-selector"));

  expect(el.syncValue().textContent).toBe("Content");
});
