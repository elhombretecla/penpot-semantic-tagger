import { Connect } from 'vite';

interface Options {
    readonly base: string;
}
export declare const CLIENT_SCRIPT_NAME = "vite-live-preview/client.ts";
/**
 * Middleware that serves the client script.
 */
declare const _default: ({ base }: Options) => Connect.NextHandleFunction;
export default _default;
