import { sourceSync } from "silentium";
import { jsDomElement, jsdomDocument } from "silentium-jsdom";
import { classToggled } from "../dom/ClassToggled";
import { expect, test } from "vitest";

test("ClassToggled.test", () => {
  const document = jsdomDocument(`<div class="menu"></div>`);
  const element = sourceSync(
    jsDomElement(
      document,
      "<div class='menu-link' data-name='Victor'>Link</div>",
    ),
  );
  sourceSync(classToggled(element, "visited"));

  expect(element.syncValue().outerHTML).toContain(`class="menu-link visited"`);
});
