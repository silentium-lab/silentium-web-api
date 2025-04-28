import { sourceOf, sourceSync } from "silentium";
import { jsdomDocument } from "silentium-jsdom";
import { visible } from "../controls/Visible";
import { expect, test } from "vitest";

test("Visible.test", () => {
  const visibilitySrc = sourceOf<boolean>(true);
  const visibleTypeSrc = sourceOf<string>("block");
  const document = sourceSync(
    jsdomDocument(
      `<div class="menu"><div class="target-selector">Content</div></div>`,
    ),
  );
  const element = document
    .syncValue()
    .querySelector(".target-selector") as HTMLElement;
  sourceSync(visible(visibilitySrc, element, visibleTypeSrc));

  expect(element.outerHTML).toContain('style="display: block;"');

  visibilitySrc.give(false);

  expect(element.outerHTML).toContain('style="display: none;"');

  visibleTypeSrc.give("flex");
  visibilitySrc.give(true);

  expect(element.outerHTML).toContain('style="display: flex;"');
});
