import { Of } from "silentium";
import { FetchedData } from "../fetch/FetchedData";
import { afterEach, beforeEach, expect, test, vi } from "vitest";

beforeEach(() => {
  vi.useFakeTimers();
});

afterEach(() => {
  vi.useRealTimers();
  vi.clearAllMocks();
});

test("Fetched.test", async () => {
  const fetchMock = vi.fn();
  fetchMock.mockReturnValue(Promise.resolve({ text: () => "response" }));
  vi.spyOn(global, "fetch").mockImplementation(fetchMock);

  const g = vi.fn();
  const error = vi.fn();
  const f = FetchedData(
    Of({
      url: "https://example.com",
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ key: "value" }),
    }),
    error,
  );
  f(g);

  await vi.advanceTimersByTimeAsync(10);

  expect(error).not.toHaveBeenCalled();
  expect(g).toHaveBeenCalledWith("response");
  expect(fetchMock.mock.calls[0][0]).toEqual("https://example.com/");
});
