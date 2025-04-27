import {
  give,
  GuestType,
  patron,
  sourceAll,
  sourceOf,
  SourceType,
  value,
} from "silentium";

type FetchType = { fetch: (input: RequestInfo) => Promise<Response> };

/**
 * Wrapper around FetchAPI
 * https://kosukhin.github.io/patron-web-api/#/fetch/fetched
 * https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API
 */
export const fetched = <T>(
  fetch: SourceType<FetchType>,
  request: SourceType<Partial<RequestInfo>>,
  errors: GuestType<Error>,
) => {
  const result = sourceOf<T>();

  value(
    sourceAll([request, fetch]),
    patron(([req, fetch]) => {
      fetch
        .fetch(req as RequestInfo)
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
          give(error, errors);
        });
    }),
  );

  return result;
};
