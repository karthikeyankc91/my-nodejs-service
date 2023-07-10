"use-strict";

const Joi = require("joi");

const envSchema = Joi.object({
  NODE_ENV: Joi.string().allow("development", "production", "test"),
  PORT: Joi.number(),
  LOG_LEVEL: Joi.string(),
  AUTH_JWS_KEY: Joi.string().required(),
  MONGODB_URL: Joi.string().required(),
  MONGODB_USERNAME: Joi.string().required(),
  MONGODB_PASSWORD: Joi.string().required(),
  MONGODB_REPLICA_SET: Joi.string().required(),
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
  mongodb: {
    url: envVars.MONGODB_URL,
    username: envVars.MONGODB_USERNAME,
    password: envVars.MONGODB_PASSWORD,
    replicaSet: envVars.MONGODB_REPLICA_SET,
  },
};

module.exports = config;
