const Koa = require("koa");
const Router = require("koa-router");
const yamljs = require("yamljs");
const { koaSwagger } = require("koa2-swagger-ui");

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

const router = new Router();
router.use(usersV1.routes());

const server = new Koa();
server
  .use(responseTimeMiddleware)
  .use(errorHandler)
  .use(jwtMiddleware)
  .use(helmet)
  .use(compress)
  .use(cors)
  .use(bodyParser)
  .use(router.routes())
  .use(router.allowedMethods())
  .use(
    koaSwagger({
      routePrefix: "/api-docs",
      swaggerOptions: { url: "/api/swagger/index.yaml" },
    })
  );

module.exports = server;
