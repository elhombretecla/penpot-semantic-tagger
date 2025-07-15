const middlewareDelay = ({ getPromise }) => {
  return (req, res, next) => {
    void getPromise().finally(() => next());
  };
};

export { middlewareDelay as default };
//# sourceMappingURL=delay.js.map
