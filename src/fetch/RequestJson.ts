import { InformationType, OwnerType } from "silentium";
import { FetchRequestType } from "./FetchedData";

/**
 * Represents a request for JSON data.
 */
export const requestJson = (
  requestSrc: InformationType<Partial<FetchRequestType>>,
  error: OwnerType<unknown>,
): InformationType<Partial<FetchRequestType>> => {
  return (o) => {
    requestSrc((r) => {
      try {
        o({
          ...r,
          body: JSON.stringify(r.body),
        });
      } catch {
        error(new Error("Failed to parse JSON"));
      }
    });
  };
};
