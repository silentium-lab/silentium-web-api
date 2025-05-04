import * as silentium from 'silentium';
import { SourceType, GuestType, PersonalType, SourceChangeableType } from 'silentium';

type WindowListener<T> = {
    addEventListener: (name: string, handler: (e: T) => void) => void;
    removeEventListener: (name: string, handler: (e: T) => void) => void;
};
/**
 * Get source of new page popped from historyAPI
 * https://developer.mozilla.org/en-US/docs/Web/API/History_API
 */
declare const historyPoppedPage: (listenSrc: SourceType<WindowListener<PopStateEvent>>, destroyedSrc: SourceType<void>) => silentium.SourceChangeableType<string>;

type PushStateAwareType = {
    pushState(data: Record<string, unknown>, title: string, url: string): void;
};
/**
 * Apply content of new url to history API
 * https://developer.mozilla.org/en-US/docs/Web/API/History_API
 */
declare const historyNewPate: (pushSrc: SourceType<PushStateAwareType>, urlSrc: SourceType<string>) => (guest: GuestType<string>) => void;

type FetchType = {
    fetch: (input: RequestInfo, options: RequestInfo) => Promise<Response>;
};
type FetchParams = {
    url: string;
} & RequestInit;
/**
 * Wrapper around FetchAPI
 * https://kosukhin.github.io/patron-web-api/#/fetch/fetched
 * https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API
 */
declare const fetched: <T>(fetchSrc: SourceType<FetchType>, requestSrc: SourceType<Partial<FetchParams>>, errorsGuest: GuestType<Error>) => silentium.SourceChangeableType<T>;

type MutationAware = {
    observe(node: HTMLElement, config: {
        childList: boolean;
        subtree: boolean;
    }): void;
    disconnect(): void;
};
/**
 * Helps to find element by selector
 * https://developer.mozilla.org/en-US/docs/Web/API/HTML_DOM_API
 */
declare const element: <T extends HTMLElement>(createObserver: PersonalType<MutationAware>, documentSrc: SourceType<Document>, selectorSrc: SourceType<string>) => SourceType<T>;

/**
 * Return content attribute of HTMLElement
 * https://developer.mozilla.org/en-US/docs/Web/API/HTML_DOM_API
 */
declare const attribute: (elementSrc: SourceType<HTMLElement>, attrNameSrc: SourceType<string>, defaultValueSrc?: SourceType<string>) => silentium.SourceChangeableType<string>;

/**
 * Render styles to document
 * https://developer.mozilla.org/en-US/docs/Web/API/HTML_DOM_API
 */
declare const styleInstalled: (documentSrc: SourceType<Document>, contentSrc: SourceType<string>) => (guest: GuestType<string>) => void;

type InputValue = number | string;
declare const input: (valueSrc: SourceChangeableType<InputValue>, elementSrc: SourceType<HTMLInputElement>) => SourceChangeableType<InputValue>;

declare const text: (valueSrc: SourceType<string>, elementSrc: SourceType<HTMLElement>) => SourceType<string>;

declare const html: (elementSrc: SourceType<HTMLElement>, valueSrc: SourceType<string>) => SourceType<string>;

/**
 * Gives ability to toggle classes of html element
 */
declare const classToggled: (elementSrc: SourceType<HTMLElement>, classSrc: SourceType<string>) => SourceType<string>;

type LogAware = {
    log: (...args: unknown[]) => unknown;
};
/**
 * Helps to print logs to somewhere
 * https://developer.mozilla.org/en-US/docs/Web/API/Console_API
 */
declare const log: <T>(consoleLike: SourceType<LogAware>, title: SourceType<string>, source: SourceType<T>) => SourceType<T>;

export { attribute, classToggled, element, fetched, historyNewPate, historyPoppedPage, html, input, log, styleInstalled, text };
