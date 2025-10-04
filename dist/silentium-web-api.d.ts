import { DataType, DataUserType } from 'silentium';

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
declare const fetchedData: (requestSrc: DataType<Partial<FetchRequestType>>, errorOwner?: DataUserType, abortSrc?: DataType) => DataType<string>;

/**
 * Represents a request for JSON data.
 */
declare const requestJson: (requestSrc: DataType<Partial<FetchRequestType>>, errorOwner?: DataUserType<unknown>) => DataType<Partial<FetchRequestType>>;

/**
 * Represents a collection of elements that match a given CSS selector.
 */
declare const elements: <T extends HTMLElement>(selectorSrc: DataType<string>) => DataType<T[]>;

/**
 * Helps to print logs to somewhere
 * https://developer.mozilla.org/en-US/docs/Web/API/Console_API
 */
declare const log: <T>(sourceSrc: DataType<T>, titleSrc: DataType<string>) => DataType<T>;

declare const timer: (delay: number) => DataType<number>;

export { elements, fetchedData, log, requestJson, timer };
export type { FetchRequestType };
