const client = require("prom-client");

const register = new client.Registry();

client.collectDefaultMetrics({ register });

const httpRequestDurations = new client.Histogram({
  name: "http_request_duration_seconds",
  help: "Duration of HTTP requests in seconds Histogram",
  labelNames: ["method", "route", "code"],
});

const apiCallsDurationSeconds = new client.Histogram({
  name: "api_calls_request_duration_seconds",
  help: "Duration of API requests in seconds Histogram",
  labelNames: ["api", "path", "method", "code"],
});

register.registerMetric(httpRequestDurations);
register.registerMetric(apiCallsDurationSeconds);

module.exports = {
  register,
  httpRequestDurations,
  apiCallsDurationSeconds,
};
