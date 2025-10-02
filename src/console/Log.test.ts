import { of } from "silentium";
import { log } from "../console/Log";
import { afterEach, expect, test, vi } from "vitest";

afterEach(() => {
  vi.clearAllMocks();
});

test("Log.test", () => {
  const consoleLog = vi.fn();
  vi.spyOn(console, "log").mockImplementation(consoleLog);

  const g = vi.fn();
  const afterLog = log(of("src"), of("title"));
  afterLog(g);

  expect(g).toHaveBeenLastCalledWith("src");
  expect(consoleLog).toHaveBeenLastCalledWith("LOG:", "title", "src");
});
