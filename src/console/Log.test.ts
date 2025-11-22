import { Log } from "../console/Log";
import { afterEach, expect, test, vi } from "vitest";

afterEach(() => {
  vi.clearAllMocks();
});

test("Log.test", () => {
  const consoleLog = vi.fn();
  vi.spyOn(console, "log").mockImplementation(consoleLog);

  const logTransport = Log("testGroup");
  logTransport("testValue");

  expect(consoleLog).toHaveBeenCalledWith("testGroup", "testValue");
});
