import debug from 'debug';

const VITE_DEBUG_FILTER = process.env.VITE_DEBUG_FILTER;
function createDebugger(namespace) {
  const log = debug(`vite:${namespace}`);
  if (!log.enabled)
    return;
  return (...args) => {
    if (!VITE_DEBUG_FILTER || args.some((a) => a?.includes?.(VITE_DEBUG_FILTER))) {
      log(...args);
    }
  };
}

export { createDebugger };
//# sourceMappingURL=create-debugger.js.map
