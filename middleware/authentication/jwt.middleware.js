const jwt = require("jsonwebtoken");

module.exports = class JwtMiddleware {
  constructor({
    logger,
    isDevelopment = false,
    ignoredMethods = [],
    ignoredRoutes = [],
    validPrinciples = [],
    jwsKey = "",
    authorisationHeader = "Authorization",
  }) {
    this.logger = logger;
    this.validPrinciples = validPrinciples;
    this.ignoredMethods = ignoredMethods;
    this.ignoredRoutes = ignoredRoutes;
    this.isDevelopment = isDevelopment;
    this.jwsKey = jwsKey;
    this.authorisationHeader = authorisationHeader;
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

  #isPrincipleValid(principle) {
    return this.validPrinciples.includes(principle);
  }

  #verifyAndExtractToken(ctx, jwsToken) {
    try {
      return jwt.verify(jwsToken, this.jwsKey);
    } catch (err) {
      if (err && err.name === "TokenExpiredError") {
        this.#expired(ctx, err.expiredAt);
      } else {
        this.#unauthorized(ctx);
      }
      return null;
    }
  }

  #getJwsToken(ctx) {
    const bearerToken = ctx.get(this.authorisationHeader);
    if (bearerToken) {
      return bearerToken.split("Bearer ")[1];
    }
    return null;
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
      const jwsToken = this.#getJwsToken(ctx);
      if (jwsToken) {
        const jwtToken = this.#verifyAndExtractToken(ctx, jwsToken);
        const principle = jwtToken.sub;
        if (this.#isPrincipleValid(principle)) {
          await next();
        } else {
          if (this.logger) {
            this.logger.warn("Invalid principle", { principle });
          }
          this.#forbidden(ctx);
        }
      } else {
        this.#unauthorized(ctx);
      }
    }
  }

  middleware() {
    return async (ctx, next) => {
      await this.#auth(ctx, next);
    };
  }
};
