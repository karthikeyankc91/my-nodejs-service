module.exports = class BasicAuthMiddleware {
  constructor({
    logger,
    ignoredMethods = [],
    ignoredRoutes = [],
    isDevelopment = false,
  }) {
    this.logger = logger;
    this.ignoredMethods = ignoredMethods;
    this.ignoredRoutes = ignoredRoutes;
    this.isDevelopment = isDevelopment;
  }

  #unauthorized(ctx) {
    ctx.status = 401;
    ctx.body = "Access denied";
  }

  #forbidden(ctx) {
    ctx.status = 403;
    ctx.body = "Access forbidden";
  }

  #expired(ctx, iat) {
    ctx.status = 401;
    ctx.body = `Token expired on [${iat}]`;
  }

  #ignoreRoute(path) {
    return this.ignoredRoutes.includes(path);
  }

  #ignoreMethod(method) {
    return this.ignoredMethods.includes(method);
  }

  async #auth(ctx, next) {
    if (this.#ignoreMethod(ctx.originalUrl)) {
      await next();
    } else if (this.#ignoreMethod(ctx.method)) {
      await next();
    } else if (this.isDevelopment) {
      if (this.logger) {
        this.logger.warn("Security is not enabled");
      }
      await next();
    } else {
      // TODO: LDAP authentication
      await next();
    }
  }

  middleware() {
    return async (ctx, next) => {
      await this.#auth(ctx, next);
    };
  }
};
