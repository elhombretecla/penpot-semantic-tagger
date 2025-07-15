const middlewareLifecycle = ({ onRequest }) => {
  return (req, res, next) => {
    let finished = false;
    const callback = onRequest();
    const onFinish = () => {
      clearTimeout(timeout);
      if (finished)
        return;
      finished = true;
      callback();
    };
    const timeout = setTimeout(onFinish, 5e3).unref();
    res.on("finish", onFinish);
    next();
  };
};

export { middlewareLifecycle as default };
//# sourceMappingURL=lifecycle.js.map
