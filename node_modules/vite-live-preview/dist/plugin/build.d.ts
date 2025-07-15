import { ConfigEnv, Plugin, PluginOption, UserConfig } from 'vite';

export type LivePreviewConfig = Omit<UserConfig, 'plugins'> | null | ((config: UserConfig, env: ConfigEnv) => Promise<Omit<UserConfig, 'plugins'> | null | void> | Omit<UserConfig, 'plugins'> | null | void);
export interface LivePreviewOptions {
    /**
     * Allow or disable automatic browser reloading on rebuild. The default is
     * true.
     */
    readonly reload?: boolean;
    /**
     * Configuration that should only be applied to live preview builds. This is
     * deeply merged into your regular Vite configuration.
     */
    readonly config?: LivePreviewConfig;
    /**
     * Plugins that should only be applied to the preview server.
     */
    readonly plugins?: PluginOption[];
}
/**
 * Start a preview server if the build mode is `preview` or `preview:<mode>`.
 *
 * **NOTE:** This plugin forces `build.watch` when enabled, so the Vite build
 * `--watch` option is optional/implied.
 */
declare const _default: ({ reload, config, plugins }?: LivePreviewOptions) => Plugin;
export default _default;
