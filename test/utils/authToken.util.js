const jwt = require("jsonwebtoken");
const jwsKey = "test-key";

function generateAutorizationToken() {
  const jwsToken = jwt.sign({}, jwsKey, {
    algorithm: "HS256",
    expiresIn: "1h",
    subject: "admin",
  });
  return `Bearer ${jwsToken}`;
}

module.exports = {
  jwsKey,
  generateAutorizationToken,
};
