import { Message, MessageType, Tap, TapType } from "silentium";
import { FetchRequestType } from "./FetchedData";

/**
 * Represents a request for JSON data.
 */
export function RequestJson(
  $request: MessageType<Partial<FetchRequestType>>,
  error?: TapType,
) {
  return Message<Partial<FetchRequestType>>(function () {
    $request.pipe(
      Tap((r) => {
        try {
          this.use({
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
