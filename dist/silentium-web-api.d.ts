import { EventType, EventUserType } from 'silentium';

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
declare function FetchedData(requestSrc: EventType<Partial<FetchRequestType>>, errorOwner?: EventUserType, abortSrc?: EventType): EventType<string>;

/**
 * Represents a request for JSON data.
 */
declare function RequestJson(requestSrc: EventType<Partial<FetchRequestType>>, errorOwner?: EventUserType<unknown>): EventType<Partial<FetchRequestType>>;

/**
 * Represents a collection of elements that match a given CSS selector.
 */
declare function Elements<T extends HTMLElement>(selectorSrc: EventType<string>): EventType<T[]>;

/**
 * Helps to print logs to somewhere
 * https://developer.mozilla.org/en-US/docs/Web/API/Console_API
 */
declare function Log<T>(sourceSrc: EventType<T>, titleSrc: EventType<string>): EventType<T>;

declare function Timer(delay: number): EventType<number>;

export { Elements, FetchedData, Log, RequestJson, Timer };
export type { FetchRequestType };
