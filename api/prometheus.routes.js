"use-strict";

const { register } = require("../middleware/prometheus/prometheus.registry");
const Router = require("koa-router");

module.exports = () => {
  const router = new Router();

  router.get("/metrics", async (ctx, next) => {
    ctx.body = await register.metrics();
  });

  return router;
};
