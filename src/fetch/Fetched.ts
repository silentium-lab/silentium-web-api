import {
  give,
  GuestType,
  patron,
  sourceAll,
  sourceOf,
  SourceType,
  value,
} from "silentium";

type FetchType = {
  fetch: (input: RequestInfo, options: RequestInfo) => Promise<Response>;
};
type FetchParams = { url: string } & RequestInit;

/**
 * Wrapper around FetchAPI
 * https://kosukhin.github.io/patron-web-api/#/fetch/fetched
 * https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API
 */
export const fetched = <T>(
  fetchSrc: SourceType<FetchType>,
  requestSrc: SourceType<Partial<FetchParams>>,
  errorsGuest: GuestType<Error>,
) => {
  const result = sourceOf<T>();

  value(
    sourceAll([requestSrc, fetchSrc]),
    patron(([request, fetch]) => {
      fetch
        .fetch(
          request.url as string,
          { ...request, url: undefined } as unknown as RequestInfo,
        )
        .then((response) => {
          let readableResponse;
          if (response.headers.get("Content-Type") === "application/json") {
            readableResponse = response.json();
          } else {
            readableResponse = response.text();
          }

          if (!response.ok) {
            return Promise.reject(readableResponse);
          }

          return readableResponse;
        })
        .then((content) => {
          give(content, result);
        })
        .catch((error) => {
          give(error, errorsGuest);
        });
    }),
  );

  return result;
};
