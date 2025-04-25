import { sourceSync } from "silentium";
import { jsdomDocument } from "silentium-jsdom";
import { styleInstalled } from "../dom/StyleInstalled";
import { expect, test } from "vitest";

test("StyleInstalled.test", () => {
  const document = sourceSync(
    styleInstalled(
      jsdomDocument(`<div class="test">hello</div>`),
      "body { color: #000 }",
    ),
  );

  expect(document.syncValue().querySelector("head")?.innerHTML).toContain(
    "body { color: #000 }",
  );
});
