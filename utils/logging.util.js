const { logging } = require("../config");
const winston = require("winston");

function createLogger(logLevel) {
  const logger = winston.createLogger({
    level: logLevel,
    transports: [new winston.transports.Console()],
    format: winston.format.combine(
      winston.format.splat(),
      winston.format.timestamp(),
      winston.format.simple(),
      winston.format.json()
    ),
  });
  logger.info("Initialized logger");
  return logger;
}

module.exports = createLogger(logging.level);
