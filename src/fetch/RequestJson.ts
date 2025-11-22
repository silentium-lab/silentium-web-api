import { Message, MessageType } from "silentium";
import { FetchRequestType } from "./FetchedData";

/**
 * Represents a request for JSON data.
 */
export function RequestJson($request: MessageType<Partial<FetchRequestType>>) {
  return Message<Partial<FetchRequestType>>(
    function RequestJsonImpl(resolve, reject) {
      $request.then((r) => {
        try {
          resolve({
            ...r,
            headers: {
              ...(r.headers ?? {}),
              "Content-Type": "application/json",
            },
            body: JSON.stringify(r.body),
          });
        } catch {
          reject(new Error("Failed to parse JSON"));
        }
      });
    },
  );
}
