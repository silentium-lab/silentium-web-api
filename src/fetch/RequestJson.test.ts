import { Of } from "silentium";
import { expect, test, vi } from "vitest";
import { RequestJson } from "../fetch/RequestJson";

test("requestJson", () => {
  const r = RequestJson(
    Of({
      body: {
        hello: "world",
      },
    }),
  );
  const g = vi.fn();
  r.then(g);

  expect(g).toHaveBeenCalledWith({
    body: '{"hello":"world"}',
    headers: {
      "Content-Type": "application/json",
    },
  });
});
