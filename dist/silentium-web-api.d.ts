import { TheInformation, TheOwner } from 'silentium';

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
declare class FetchedData extends TheInformation<string> {
    private requestSrc;
    private errorOwner?;
    private abortSrc?;
    constructor(requestSrc: TheInformation<Partial<FetchRequestType>>, errorOwner?: TheOwner<unknown> | undefined, abortSrc?: TheInformation<unknown> | undefined);
    value(o: TheOwner<string>): this;
}

/**
 * Represents a request for JSON data.
 */
declare class RequestJson extends TheInformation<Partial<FetchRequestType>> {
    private requestSrc;
    private errorOwner?;
    constructor(requestSrc: TheInformation<Partial<FetchRequestType>>, errorOwner?: TheOwner<unknown> | undefined);
    value(o: TheOwner<Partial<FetchRequestType>>): this;
}

/**
 * Represents a collection of elements that match a given CSS selector.
 */
declare class Elements extends TheInformation<HTMLElement[]> {
    private selectorSrc;
    constructor(selectorSrc: TheInformation<string>);
    value(o: TheOwner<HTMLElement[]>): this;
}

/**
 * Helps to print logs to somewhere
 * https://developer.mozilla.org/en-US/docs/Web/API/Console_API
 */
declare class Log<T> extends TheInformation<T> {
    private sourceSrc;
    private titleSrc;
    constructor(sourceSrc: TheInformation<T>, titleSrc: TheInformation<string>);
    value(o: TheOwner<T>): this;
}

export { Elements, FetchedData, Log, RequestJson };
export type { FetchRequestType };
