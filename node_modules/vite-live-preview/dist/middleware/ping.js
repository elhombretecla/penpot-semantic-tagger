import { createDebugger } from '../util/create-debugger.js';

const PING_ACCEPT_HEADER = "text/x-vite-ping";
const middlewarePing = () => {
  const debug = createDebugger("live-preview");
  return (req, res, next) => {
    if (req.headers.accept !== PING_ACCEPT_HEADER)
      return next();
    res.statusCode = 204;
    res.end();
    debug?.("ping received.");
  };
};

export { middlewarePing as default };
//# sourceMappingURL=ping.js.map
