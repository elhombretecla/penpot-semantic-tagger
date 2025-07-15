import { Connect } from 'vite';

interface Options {
    readonly base: string;
}
/**
 * Middleware that injects the client script into HTML responses.
 */
declare const _default: ({ base }: Options) => Connect.NextHandleFunction;
export default _default;
