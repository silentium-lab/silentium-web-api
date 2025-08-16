import { InformationType, OwnerType } from "silentium";

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
export const fetchedData = (
  requestSrc: InformationType<Partial<FetchRequestType>>,
  errorOwner?: OwnerType<unknown>,
  abortSrc?: InformationType<unknown>,
): InformationType<string> => {
  return (o) => {
    const abortController = new AbortController();
    if (abortSrc) {
      abortSrc((abort) => {
        if (abort) {
          abortController.abort();
        }
      });
    }
    requestSrc((request) => {
      const { baseUrl, url, method, credentials, headers, body, query } =
        request;
      let urlWithQuery: URL;
      try {
        urlWithQuery = new URL(String(url), baseUrl);
      } catch {
        errorOwner?.(new Error("Invalid URL"));
        return;
      }
      Object.entries(query ?? {}).forEach(([key, value]) =>
        urlWithQuery.searchParams.append(key, String(value)),
      );
      const options: RequestInit = {
        method,
        credentials,
        headers,
        body: body as BodyInit,
        signal: abortController.signal,
      };
      fetch(urlWithQuery.toString(), options)
        .then((response) => response.text())
        .then((data) => o(data))
        .catch((error) => {
          errorOwner?.(error);
        });
    });
  };
};
