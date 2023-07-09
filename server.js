const Koa = require("koa");
const Router = require("koa-router");

//swagger
const swaggerUI = require("./api/swagger");

// Middlewares
const compress = require("koa-compress")();
const bodyParser = require("koa-bodyparser")();
const cors = require("@koa/cors")();
const helmet = require("koa-helmet")();

// Custom Middlewares
const {
  prometheus,
  errorHandler,
  jwtMiddleware,
  responseTimeMiddleware,
} = require("./middleware");

// Routes
const metrics = require("./api/prometheus.routes")();
const resourcesV1 = require("./api/resources.routes.v1")();

const router = new Router();
router.use(metrics.routes());
router.use(resourcesV1.routes());

const server = new Koa();
server
  .use(prometheus)
  .use(responseTimeMiddleware)
  .use(errorHandler)
  .use(jwtMiddleware)
  .use(swaggerUI)
  .use(helmet)
  .use(compress)
  .use(cors)
  .use(bodyParser)
  .use(router.routes())
  .use(router.allowedMethods());
module.exports = server;
