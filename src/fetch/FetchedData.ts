import { From, InformationType, OwnerType, TheInformation } from "silentium";

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
export class FetchedData extends TheInformation<string> {
  public constructor(
    private requestSrc: InformationType<Partial<FetchRequestType>>,
    private errorOwner?: OwnerType<unknown>,
    private abortSrc?: InformationType<unknown>,
  ) {
    super(requestSrc, abortSrc);
  }

  public value(o: OwnerType<string>): this {
    const abortController = new AbortController();
    if (this.abortSrc) {
      this.abortSrc.value(
        new From((abort) => {
          if (abort) {
            abortController.abort();
          }
        }),
      );
    }
    this.requestSrc.value(
      new From((request) => {
        const { baseUrl, url, method, credentials, headers, body, query } =
          request;
        let urlWithQuery: URL;
        try {
          urlWithQuery = new URL(String(url), baseUrl);
        } catch {
          this.errorOwner?.give(new Error("Invalid URL"));
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
          .then((data) => o.give(data))
          .catch((error) => {
            this.errorOwner?.give(error);
          });
      }),
    );
    return this;
  }
}
