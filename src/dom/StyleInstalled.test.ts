import { sourceSync } from "silentium";
import { jsdomDocument } from "silentium-jsdom";
import { styleInstalled } from "../dom/StyleInstalled";
import { expect, test } from "vitest";
import partial from "lodash.partial";

test("StyleInstalled.test", () => {
  const document = sourceSync(jsdomDocument(`<div class="test">hello</div>`));
  const docStyle = partial(styleInstalled, document.syncValue());
  sourceSync(docStyle("body { color: #000 }"));

  expect(document.syncValue().querySelector("head")?.innerHTML).toContain(
    "body { color: #000 }",
  );
});
