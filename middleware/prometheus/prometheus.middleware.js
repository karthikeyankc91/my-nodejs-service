const { httpRequestDurations } = require("./prometheus.registry");

module.exports = async (ctx, next) => {
  const end = httpRequestDurations.startTimer();
  await next();
  end({
    route: ctx._matchedRoute ? ctx._matchedRoute : ctx.originalUrl,
    code: ctx.status,
    method: ctx.method,
  });
};
