import { Connect } from 'vite';

interface Options {
    readonly getPromise: () => Promise<void>;
}
/**
 * Middleware that delays the response until a promise resolves.
 */
declare const _default: ({ getPromise }: Options) => Connect.NextHandleFunction;
export default _default;
