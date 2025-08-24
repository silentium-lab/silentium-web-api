import { TheInformation, InformationType, OwnerType } from 'silentium';

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
    constructor(requestSrc: InformationType<Partial<FetchRequestType>>, errorOwner?: OwnerType<unknown> | undefined, abortSrc?: InformationType<unknown> | undefined);
    value(o: OwnerType<string>): this;
}

/**
 * Represents a request for JSON data.
 */
declare class RequestJson extends TheInformation<Partial<FetchRequestType>> {
    private requestSrc;
    private errorOwner?;
    constructor(requestSrc: InformationType<Partial<FetchRequestType>>, errorOwner?: OwnerType<unknown> | undefined);
    value(o: OwnerType<Partial<FetchRequestType>>): this;
}

/**
 * Represents a collection of elements that match a given CSS selector.
 */
declare class Elements extends TheInformation<HTMLElement[]> {
    private selectorSrc;
    constructor(selectorSrc: InformationType<string>);
    value(o: OwnerType<HTMLElement[]>): this;
}

/**
 * Helps to print logs to somewhere
 * https://developer.mozilla.org/en-US/docs/Web/API/Console_API
 */
declare class Log<T> extends TheInformation<T> {
    private sourceSrc;
    private titleSrc;
    constructor(sourceSrc: InformationType<T>, titleSrc: InformationType<string>);
    value(o: OwnerType<T>): this;
}

export { Elements, FetchedData, Log, RequestJson };
export type { FetchRequestType };
