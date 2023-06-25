const http = require("http");
const server = require("./server");

const { port } = require("./config").server;

process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";

async function bootstrap() {
  return {
    server: http
      .createServer(server.callback())
      .listen(port)
      .on("error", onError),
  };
}

function onError(error) {
  setImmediate(() => {
    process.exit();
  });
}

bootstrap()
  .then((ready) => {
    // healthChecks(ready.server, ready.kafkaConsumer);
    console.log(`Server listening on port ${ready.server.address().port}`);
  })
  .catch((error) => onError(error));
