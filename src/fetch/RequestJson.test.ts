import { expect, test, vi } from "vitest";
import { RequestJson } from "./RequestJson";
import { From, Of } from "silentium";

test("requestJson", () => {
  const r = new RequestJson(
    new Of({
      body: {
        hello: "world",
      },
    }),
  );
  const g = vi.fn();
  r.value(new From(g));

  expect(g).toHaveBeenCalledWith({
    body: '{"hello":"world"}',
    headers: {
      "Content-Type": "application/json",
    },
  });
});
