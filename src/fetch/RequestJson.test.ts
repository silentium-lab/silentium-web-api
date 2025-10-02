import { of } from "silentium";
import { requestJson } from "../fetch/RequestJson";
import { expect, test, vi } from "vitest";

test("requestJson", () => {
  const r = requestJson(
    of({
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
