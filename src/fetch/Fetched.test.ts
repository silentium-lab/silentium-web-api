import { sourceOf, sourceSync } from "silentium";
import { afterEach, beforeEach, expect, test, vi } from "vitest";
import { fetched } from "../fetch/Fetched";

beforeEach(() => {
  vi.useFakeTimers();
});

afterEach(() => {
  vi.useRealTimers();
});

test("Fetched.test", async () => {
  const fakeFetch = {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    fetch: (): any =>
      Promise.resolve({
        ok: true,
        headers: {
          get: () => "application/json",
        },
        json: () => ({
          content: "hello",
        }),
      }),
  };
  const errors = sourceOf();
  const request = {
    url: "/get",
    method: "get",
  };

  const fetchResult = fetched<{ content: string }>(fakeFetch, request, errors);

  await vi.advanceTimersByTime(10);
  const result = sourceSync(fetchResult);
  await vi.advanceTimersByTime(10);

  expect(result.syncValue().content).toBe("hello");
});
