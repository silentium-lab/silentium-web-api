import partial from "lodash.partial";
import { expect, test } from "vitest";
import { log } from "../console/Log";

test("Log.test", () => {
  const fakeLog = {
    buffer: "",
    log(...args: unknown[]) {
      this.buffer += args.join(" ");
    },
  };
  const logger = partial(log<string>, fakeLog, "title");
  logger("test");
  expect(fakeLog.buffer).toBe("LOG: title test");
});
