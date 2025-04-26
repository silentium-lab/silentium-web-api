import * as silentium from 'silentium';
import { SourceType, GuestType, PersonalType } from 'silentium';

type WindowListener<T> = {
    addEventListener: (name: string, handler: (e: T) => void) => void;
    removeEventListener: (name: string, handler: (e: T) => void) => void;
};
/**
 * Get source of new page popped from historyAPI
 * https://developer.mozilla.org/en-US/docs/Web/API/History_API
 */
declare const historyPoppedPage: (destroyedSrc: SourceType<void>, listenSrc: SourceType<WindowListener<PopStateEvent>>) => silentium.SourceChangeableType<string>;

type PushStateAwareType = {
    pushState(data: Record<string, unknown>, title: string, url: string): void;
};
/**
 * Apply content of new url to history API
 * https://developer.mozilla.org/en-US/docs/Web/API/History_API
 */
declare const historyNewPate: (urlSrc: SourceType<string>, pushSrc: SourceType<PushStateAwareType>) => (guest: GuestType<string>) => void;

type FetchType = {
    fetch: (input: RequestInfo) => Promise<Response>;
};
/**
 * Wrapper around FetchAPI
 * https://kosukhin.github.io/patron-web-api/#/fetch/fetched
 * https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API
 */
declare const fetched: <T>(request: SourceType<Partial<RequestInfo>>, errors: GuestType<Error>, fetch: SourceType<FetchType>) => silentium.SourceChangeableType<T>;

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
declare const element: (selectorSrc: SourceType<string>, documentSrc: SourceType<Document>, createObserver?: PersonalType<MutationAware>) => SourceType<HTMLElement>;

/**
 * Return content attribute of HTMLElement
 * https://developer.mozilla.org/en-US/docs/Web/API/HTML_DOM_API
 */
declare const attribute: (elementSrc: SourceType<HTMLElement>, attrNameSrc: SourceType<string>, defaultValueSrc?: SourceType<string>) => silentium.SourceChangeableType<string>;

/**
 * Render styles to document
 * https://developer.mozilla.org/en-US/docs/Web/API/HTML_DOM_API
 */
declare const styleInstalled: (documentSrc: SourceType<Document>, contentSrc: SourceType<string>) => (guest: GuestType<Document>) => void;

type LogAware = {
    log: (...args: unknown[]) => unknown;
};
/**
 * Helps to print logs to somewhere
 * https://developer.mozilla.org/en-US/docs/Web/API/Console_API
 */
declare const log: <T>(source: SourceType<T>, title?: SourceType<string>, consoleLike?: SourceType<LogAware>) => SourceType<T>;

export { attribute, element, fetched, historyNewPate, historyPoppedPage, log, styleInstalled };
