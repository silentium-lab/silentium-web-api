import { Message, MessageType, Transport, TransportType } from "silentium";
import { FetchRequestType } from "./FetchedData";

/**
 * Represents a request for JSON data.
 */
export function RequestJson(
  $request: MessageType<Partial<FetchRequestType>>,
  error?: TransportType,
) {
  return Message<Partial<FetchRequestType>>((t) => {
    $request.to(
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
