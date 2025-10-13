import { EventType, EventUserType } from "silentium";
import { FetchRequestType } from "./FetchedData";

/**
 * Represents a request for JSON data.
 */
export function RequestJson(
  requestSrc: EventType<Partial<FetchRequestType>>,
  errorOwner?: EventUserType<unknown>,
): EventType<Partial<FetchRequestType>> {
  return (u) => {
    requestSrc((r) => {
      try {
        u({
          ...r,
          headers: {
            ...(r.headers ?? {}),
            "Content-Type": "application/json",
          },
          body: JSON.stringify(r.body),
        });
      } catch {
        errorOwner?.(new Error("Failed to parse JSON"));
      }
    });
  };
}
