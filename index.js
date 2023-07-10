const http = require("http");
const logger = require("./utils/logging.util");
const server = require("./server");
const db = require("./db");

const { port } = require("./config").server;

process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";

async function bootstrap() {
  await db.connect();

  return {
    server: http
      .createServer(server.callback())
      .listen(port)
      .on("error", onError),
  };
}

function onError(error) {
  setImmediate(() => {
    logger.error(`Error during startup`, error);
    process.exit();
  });
}

bootstrap()
  .then((ready) => {
    // healthChecks(ready.server, ready.kafkaConsumer);
    console.log(`Server listening on port ${ready.server.address().port}`);
  })
  .catch((error) => onError(error));
