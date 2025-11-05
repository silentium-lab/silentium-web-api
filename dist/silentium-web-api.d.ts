import { EventType, TransportType } from 'silentium';

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
declare function FetchedData($request: EventType<Partial<FetchRequestType>>, error?: TransportType, $abort?: EventType): EventType<string>;

/**
 * Represents a request for JSON data.
 */
declare function RequestJson($request: EventType<Partial<FetchRequestType>>, error?: TransportType): EventType<Partial<FetchRequestType>>;

/**
 * Represents a collection of elements that match a given CSS selector.
 */
declare function Elements<T extends HTMLElement>($selector: EventType<string>): EventType<T[]>;

/**
 * Represents an element that matches a given CSS selector.
 * If the element exists immediately, returns it.
 * If not, waits for it to appear in the DOM.
 */
declare function Element<T extends HTMLElement>($selector: EventType<string>): EventType<T | null>;

/**
 * Transport for log values to console
 */
declare function Log<T>(group: string): TransportType;

declare function Timer(delay: number): EventType<number>;

export { Element, Elements, FetchedData, Log, RequestJson, Timer };
export type { FetchRequestType };
