const { koaSwagger } = require("koa2-swagger-ui");

const yamljs = require("yamljs");
const spec = yamljs.load("./api/swagger/swagger.v1.yaml");

module.exports = koaSwagger({
  swaggerOptions: {
    spec,
  },
});
