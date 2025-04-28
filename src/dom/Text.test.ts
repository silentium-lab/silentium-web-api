import { sourceOf, sourceSync } from "silentium";
import { jsdomDocument } from "silentium-jsdom";
import { text } from "../dom/Text";
import { expect, test } from "vitest";

test("Text.test", () => {
  const valueSrc = sourceOf<string>("hello");
  const document = sourceSync(
    jsdomDocument(
      `<div class="menu"><div class="target-selector">Content</div></div>`,
    ),
  );
  const element = document
    .syncValue()
    .querySelector(".target-selector") as HTMLElement;
  sourceSync(text(valueSrc, element));

  expect(element.outerHTML).toContain(">hello<");

  valueSrc.give("changed!!!");

  expect(element.outerHTML).toContain(">changed!!!<");
});
