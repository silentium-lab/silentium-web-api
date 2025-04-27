import { sourceOf, sourceSync } from "silentium";
import { jsdomDocument } from "silentium-jsdom";
import { documentTitle } from "../dom/documentTitle";
import { expect, test } from "vitest";
import partial from "lodash.partial";

test("documentTitle.test", () => {
  const document = sourceSync(
    jsdomDocument(`<div class="menu"></div>`),
  ).syncValue();

  const title = sourceOf<string>("Заголовок");
  const docTitle = partial(documentTitle, document);
  sourceSync(docTitle(title));

  title.give("Измененный заголовок");

  expect(document.title).toBe("Измененный заголовок");
});
