import { Plugin } from 'vite';
import { WebSocket } from 'ws';

interface Options {
    /**
     * Called when a new websocket connection is established.
     */
    readonly onConnect: (socket: WebSocket) => void;
    /**
     * Called when a request is received. Returns a function that is called when
     * the response is finished.
     */
    readonly onRequest: () => () => void;
    /**
     * Return the current build error, if any.
     */
    readonly getError: () => Error | undefined;
    /**
     * Return a promise that resolves when no build is in progress.
     */
    readonly getBuildPromise: () => Promise<void>;
}
declare const _default: ({ onConnect, onRequest, getError, getBuildPromise }: Options) => Plugin;
export default _default;
