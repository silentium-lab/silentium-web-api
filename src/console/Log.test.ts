import { Of } from "silentium";
import { Log } from "../console/Log";
import { afterEach, expect, test, vi } from "vitest";

afterEach(() => {
  vi.clearAllMocks();
});

test("Log.test", () => {
  const consoleLog = vi.fn();
  vi.spyOn(console, "log").mockImplementation(consoleLog);

  const g = vi.fn();
  const afterLog = Log(Of("src"), Of("title"));
  afterLog(g);

  expect(g).toHaveBeenLastCalledWith("src");
  expect(consoleLog).toHaveBeenLastCalledWith("LOG:", "title", "src");
});
