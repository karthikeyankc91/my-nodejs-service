const logger = require("../utils/logging.util");
const config = require("../config");

const ErrorHandler = require("./error.middleware");
const errorHandler = new ErrorHandler({ logger }).middleware();

const JwtMiddleware = require("./authentication/jwt.middleware");
const jwtMiddleware = new JwtMiddleware({
  logger,
  isDevelopment: config.isDevelopment,
  ignoredMethods: config.authentication.ignoredMethods,
  ignoredRoutes: config.authentication.ignoredRoutes,
  validPrinciples: config.authentication.validPrinciples,
  jwsKey: config.authentication.jwsKey,
  authorisationHeader: config.authentication.authorisationHeader,
}).middleware();

const ResponseTimeMiddleware = require("./response.time.middleware");
const responseTimeMiddleware = new ResponseTimeMiddleware({
  logger,
}).middleware();

module.exports = { errorHandler, jwtMiddleware, responseTimeMiddleware };
