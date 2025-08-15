import {
  give,
  GuestType,
  InformationType,
  OwnerType,
  patron,
  sourceAll,
  sourceOf,
  SourceType,
  value,
} from "silentium";

export interface FetchRequestType {
  baseUrl?: string;
  url: string;
  method: string;
  credentials?: RequestCredentials;
  headers?: Record<string, string>;
  body?: unknown;
  query?: Record<string, unknown>;
}

/**
 * Wrapper around FetchAPI
 * https://kosukhin.github.io/patron-web-api/#/fetch/fetched
 * https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API
 */
export const fetchedData = <T>(
  requestSrc: InformationType<Partial<FetchRequestType>>,
  error: OwnerType<unknown>,
  abortSrc?: InformationType<unknown>,
): InformationType<T> => {
  return () => {};
};
