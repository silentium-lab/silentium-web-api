import { expect, test, vi } from "vitest";
import { requestJson } from "./RequestJson";
import { i } from "silentium";

test("requestJson", () => {
  const r = requestJson(
    i({
      body: {
        hello: "world",
      },
    }),
  );
  const g = vi.fn();
  r(g);

  expect(g).toHaveBeenCalledWith({
    body: '{"hello":"world"}',
    headers: {
      "Content-Type": "application/json",
    },
  });
});
