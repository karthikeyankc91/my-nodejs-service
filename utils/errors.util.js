const VError = require("verror");

class BadArgumentError extends VError {
  constructor(message) {
    super();
    this.name = "BadArgumentError";
    this.message = message;
    this.status = 400;
  }
}

class ConflictError extends VError {
  constructor(message) {
    super();
    this.name = "ConflictError";
    this.message = message;
    this.status = 409;
  }
}

class NotFoundError extends VError {
  constructor(message) {
    super();
    this.name = "NotFoundError";
    this.message = message;
    this.status = 404;
  }
}

module.exports = {
  BadArgumentError,
  ConflictError,
  NotFoundError,
};
