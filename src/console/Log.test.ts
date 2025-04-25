import { log } from "../console/Log";
import { expect, test } from "vitest";

test("Log.test", () => {
  const fakeLog = {
    buffer: "",
    log(...args: unknown[]) {
      this.buffer += args.join(" ");
    },
  };
  log("content", "title", fakeLog);
  expect(fakeLog.buffer).toBe("LOG: title content");
});
