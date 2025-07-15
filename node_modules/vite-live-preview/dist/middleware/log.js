import { createDebugger } from '../util/create-debugger.js';

const middlewareLog = () => {
  const debug = createDebugger("live-preview-request");
  return (req, res, next) => {
    const start = Date.now();
    res.on("finish", () => debug?.(`${req.method} ${req.url} ${res.statusCode} ${Date.now() - start}ms`));
    next();
  };
};

export { middlewareLog as default };
//# sourceMappingURL=log.js.map
