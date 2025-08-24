import { afterEach, expect, test, vi } from "vitest";
import { Log } from "../console/Log";
import { From, Of } from "silentium";

afterEach(() => {
  vi.clearAllMocks();
});

test("Log.test", () => {
  const consoleLog = vi.fn();
  vi.spyOn(console, "log").mockImplementation(consoleLog);

  const g = vi.fn();
  const afterLog = new Log(new Of("src"), new Of("title"));
  afterLog.value(new From(g));

  expect(g).toHaveBeenLastCalledWith("src");
  expect(consoleLog).toHaveBeenLastCalledWith("LOG:", "title", "src");
});
