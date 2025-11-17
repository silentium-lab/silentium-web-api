import { Of, Tap } from "silentium";
import { RequestJson } from "../fetch/RequestJson";
import { expect, test, vi } from "vitest";

test("requestJson", () => {
  const r = RequestJson(
    Of({
      body: {
        hello: "world",
      },
    }),
  );
  const g = vi.fn();
  r.pipe(Tap(g));

  expect(g).toHaveBeenCalledWith({
    body: '{"hello":"world"}',
    headers: {
      "Content-Type": "application/json",
    },
  });
});
