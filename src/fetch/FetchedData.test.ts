import { afterEach, beforeEach, expect, test, vi } from "vitest";
import { fetchedData } from "./FetchedData";
import { i } from "silentium";

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
  const f = fetchedData(
    i({
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
