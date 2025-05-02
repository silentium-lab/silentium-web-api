import { sourceOf, sourceSync } from "silentium";
import { jsdomDocument } from "silentium-jsdom";
import { expect, test } from "vitest";
import { html } from "../dom/Html";

test("Html.test", () => {
  const valueSrc = sourceOf<string>("hello");
  const document = sourceSync(
    jsdomDocument(
      `<div class="menu"><div class="target-selector">Content</div></div>`,
    ),
  );
  const element = document
    .syncValue()
    .querySelector(".target-selector") as HTMLElement;
  sourceSync(html(element, valueSrc));

  expect(element.outerHTML).toContain(">hello<");

  valueSrc.give("<b class='inserted'>changed!!!</b>");

  expect(element.outerHTML).toContain('<b class="inserted">changed!!!</b>');
});
