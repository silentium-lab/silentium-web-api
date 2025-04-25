import {
  give,
  GuestType,
  patron,
  sourceAll,
  sourceChangeable,
  SourceType,
  value,
} from "silentium";

type FetchType = { fetch: (input: RequestInfo) => Promise<Response> };

/**
 * Wrapper around FetchAPI
 * https://kosukhin.github.io/patron-web-api/#/fetch/fetched
 */
export const fetched = <T>(
  request: SourceType<Partial<RequestInfo>>,
  errors: GuestType<Error>,
  fetch: SourceType<FetchType>,
) => {
  const all = sourceAll([request, fetch]);
  const result = sourceChangeable<T>();

  value(
    all,
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
