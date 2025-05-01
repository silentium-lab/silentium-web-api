import { personalClass, sourceOf, sourceSync } from "silentium";
import { jsdomDocument } from "silentium-jsdom";
import { link } from "../../dom/controls/Link";
import { expect, test } from "vitest";
import { element } from "../../dom/Element";
import { JSDOM } from "jsdom";

test("Link.test", () => {
  class Mutation {
    constructor(fn: () => void) {
      fn();
    }
    observe() {}
    disconnect() {}
  }
  const dom = sourceOf<JSDOM>();
  const document = sourceSync(
    jsdomDocument(
      `<div class="menu"><a href="/go" id="the-link">Click me</a></div>`,
      dom,
    ),
  ).syncValue();
  const window = sourceSync(dom).syncValue().window;
  const wrapperSrc = sourceSync(
    element(personalClass(Mutation), document, ".menu"),
  );
  const linkEl = sourceSync(
    element(personalClass(Mutation), document, "#the-link"),
  ).syncValue();

  const linkSrc = sourceSync(link(wrapperSrc, "#the-link"));

  const event = new window.MouseEvent("click", { bubbles: true });
  linkEl.dispatchEvent(event);

  expect(linkSrc.syncValue()).toBe("/go");
});
