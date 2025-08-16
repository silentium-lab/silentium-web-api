import { afterEach, expect, test, vi } from "vitest";
import { log } from "../console/Log";
import { i } from "silentium";

afterEach(() => {
  vi.clearAllMocks();
});

test("Log.test", () => {
  const consoleLog = vi.fn();
  vi.spyOn(console, "log").mockImplementation(consoleLog);

  const g = vi.fn();
  const afterLog = log(i("src"), i("title"));
  afterLog(g);

  expect(g).toHaveBeenLastCalledWith("src");
  expect(consoleLog).toHaveBeenLastCalledWith("LOG:", "title", "src");
});
