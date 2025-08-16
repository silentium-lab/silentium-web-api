import { InformationType, OwnerType } from "silentium";
import { FetchRequestType } from "./FetchedData";

/**
 * Represents a request for JSON data.
 */
export const requestJson = (
  requestSrc: InformationType<Partial<FetchRequestType>>,
  errorOwner?: OwnerType<unknown>,
): InformationType<Partial<FetchRequestType>> => {
  return (o) => {
    requestSrc((r) => {
      try {
        o({
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
};
