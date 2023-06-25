const { v4: uuidv4 } = require("uuid");

module.exports = class ErrorMiddleware {
  constructor({ logger }) {
    this.logger = logger;
  }

  _sanitizeError(err) {
    let sanitizedError = err;

    if (err.isAxiosError) {
      err.config && delete err.config.auth;
    }
    return sanitizedError;
  }

  async _errorHandler(ctx, next) {
    try {
      await next();
    } catch (err) {
      const errorUUID = uuidv4();
      const sanitizedError = this._sanitizeError(err);
      if (this.logger) {
        this.logger.error(`Error handler [${errorUUID}]`, sanitizedError);
      }
      if (err.name === "ValidationError") {
        ctx.status = 400;
      } else {
        ctx.status = err.status || 500;
      }
      ctx.body = {
        uuid: errorUUID,
        status: "failed",
        message: err.message || "Internal server error",
      };
    }
  }

  middleware() {
    return async (ctx, next) => {
      await this._errorHandler(ctx, next);
    };
  }
};
