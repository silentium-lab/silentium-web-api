import { sourceOf, sourceSync } from "silentium";
import { jsdomDocument } from "silentium-jsdom";
import { documentTitle } from "../dom/documentTitle";
import { expect, test } from "vitest";

test("documentTitle.test", () => {
  const document = sourceSync(
    jsdomDocument(`<div class="menu"></div>`),
  ).syncValue();

  const title = sourceOf<string>("Заголовок");
  sourceSync(documentTitle(title, document));

  title.give("Измененный заголовок");

  expect(document.title).toBe("Измененный заголовок");
});
