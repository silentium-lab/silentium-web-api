import { InformationType, OwnerType } from 'silentium';

interface FetchRequestType {
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
declare const fetchedData: (requestSrc: InformationType<Partial<FetchRequestType>>, errorOwner?: OwnerType<unknown>, abortSrc?: InformationType<unknown>) => InformationType<string>;

/**
 * Represents a request for JSON data.
 */
declare const requestJson: (requestSrc: InformationType<Partial<FetchRequestType>>, errorOwner?: OwnerType<unknown>) => InformationType<Partial<FetchRequestType>>;

/**
 * Represents a collection of elements that match a given CSS selector.
 */
declare const elements: (selectorSrc: InformationType<string>) => InformationType<HTMLElement[]>;

/**
 * Helps to print logs to somewhere
 * https://developer.mozilla.org/en-US/docs/Web/API/Console_API
 */
declare const log: <T>(sourceSrc: InformationType<T>, titleSrc: InformationType<string>) => InformationType<T>;

export { elements, fetchedData, log, requestJson };
export type { FetchRequestType };
