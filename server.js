const Koa = require("koa");
const Router = require("koa-router");

// Middlewares
const compress = require("koa-compress")();
const bodyParser = require("koa-bodyparser")();
const cors = require("@koa/cors")();
const helmet = require("koa-helmet")();

// Custom Middlewares
const {
  errorHandler,
  jwtMiddleware,
  responseTimeMiddleware,
} = require("./middleware");

// Routes
const usersV1 = require("./api/users.routes.v1")();

const server = new Koa();
server
  .use(responseTimeMiddleware)
  .use(errorHandler)
  .use(jwtMiddleware)
  .use(helmet)
  .use(compress)
  .use(cors)
  .use(bodyParser);

const router = new Router();
router.use(usersV1.routes());

server.use(router.routes()).use(router.allowedMethods());

module.exports = server;
