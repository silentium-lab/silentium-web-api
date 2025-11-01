import { Event, EventType, Transport, TransportType } from "silentium";
import { FetchRequestType } from "./FetchedData";

/**
 * Represents a request for JSON data.
 */
export function RequestJson(
  $request: EventType<Partial<FetchRequestType>>,
  error?: TransportType,
): EventType<Partial<FetchRequestType>> {
  return Event((t) => {
    $request.event(
      Transport((r) => {
        try {
          t.use({
            ...r,
            headers: {
              ...(r.headers ?? {}),
              "Content-Type": "application/json",
            },
            body: JSON.stringify(r.body),
          });
        } catch {
          error?.use(new Error("Failed to parse JSON"));
        }
      }),
    );
  });
}
