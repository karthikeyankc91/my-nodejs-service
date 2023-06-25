"use-strict";

const joi = require("joi");

const envSchema = joi
  .object({
    NODE_ENV: joi.string().allow("development", "production", "test"),
    PORT: joi.number(),
    LOG_LEVEL: joi.string(),
  })
  .unknown()
  .required();

const { error, value: envVars } = envSchema.validate(process.env);

if (error) {
  throw new Error(`Config validation error: ${error.message}`);
}

const config = {
  env: envVars.NODE_ENV,
  isTest: envVars.NODE_ENV === "test",
  isDevelopment: envVars.NODE_ENV === "development",
  server: {
    port: envVars.PORT || 3000,
  },
  logging: {
    level: envVars.LOG_LEVEL || "debug",
  },
  authentication: {
    ignoreRoutes: ["/docs", "/metrics"],
    ignoreMethods: ["GET"],
    validPrinciples: envVars.AUTH_VALID_PRINCIPLES || "admin",
    jwsKey: envVars.AUTH_JWS_KEY,
    authorizationHeader: envVars.AUTH_HEADER || "Authorization",
  },
};

module.exports = config;
