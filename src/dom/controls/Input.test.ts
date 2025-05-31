import { lazyClass, sourceOf, sourceSync } from "silentium";
import { jsdomDocument } from "silentium-jsdom";
import { element } from "../../dom/Element";
import { expect, test } from "vitest";
import { input } from "../../dom/controls/Input";

test("Input.test", () => {
  class Mutation {
    constructor(fn: () => void) {
      fn();
    }
    observe() {}
    disconnect() {}
  }

  const document = sourceSync(
    jsdomDocument(`<div class="menu"><input id="input" /></div>`),
  ).syncValue();
  const inputElement = sourceSync(
    element<HTMLInputElement>(lazyClass(Mutation), document, "#input"),
  );

  const inputValueSrc = sourceOf("hello world");
  input(inputValueSrc, inputElement);

  expect(inputElement.syncValue().value).toBe("hello world");
});
