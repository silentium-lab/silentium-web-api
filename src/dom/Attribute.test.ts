import { expect, test } from "vitest";
import { jsDomElement, jsdomDocument } from "silentium-jsdom";
import { sourceSync } from "silentium";
import { attribute } from "../dom/Attribute";

test("Attribute.test", () => {
  const document = jsdomDocument(`<div class="menu"></div>`);
  const element = jsDomElement(
    document,
    "<div class='menu-link' data-name='Victor'>Link</div>",
  );
  const attr = sourceSync(attribute("data-name", element, "unknown"));
  expect(attr.syncValue()).toBe("Victor");

  const attrNotFound = sourceSync(attribute("data-none", element, "unknown"));
  expect(attrNotFound.syncValue()).toBe("unknown");
});
