import { Connect } from 'vite';

interface Options {
    readonly onRequest: () => () => void;
}
/**
 * Middleware that invokes lifecycle callbacks.
 */
declare const _default: ({ onRequest }: Options) => Connect.NextHandleFunction;
export default _default;
