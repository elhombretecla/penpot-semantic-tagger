import { default as debug } from 'debug';

/**
 * Creates a debug log function.
 *
 * XXX: Vite has a version of this as an internal tool, also using the `debug`
 * package. Not sure why it's not considered a public utility.
 */
export declare function createDebugger(namespace: 'live-preview' | 'live-preview-request'): debug.Debugger['log'] | undefined;
