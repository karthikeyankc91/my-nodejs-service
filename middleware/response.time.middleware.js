module.exports = class ResponseTimeMiddleware {
  constructor({ logger }) {
    this.logger = logger;
  }

  async _setResponseTime(ctx, next) {
    const start = Date.now();
    await next();
    const ms = Date.now() - start;
    ctx.set("X-Response-Time", `${ms}ms`);
  }

  middleware() {
    return async (ctx, next) => {
      await this._setResponseTime(ctx, next);
    };
  }
};
