import { DataType, DataUserType } from "silentium";
import { FetchRequestType } from "./FetchedData";

/**
 * Represents a request for JSON data.
 */
export const requestJson = (
  requestSrc: DataType<Partial<FetchRequestType>>,
  errorOwner?: DataUserType<unknown>,
): DataType<Partial<FetchRequestType>> => {
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
};
