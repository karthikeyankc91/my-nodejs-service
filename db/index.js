const { MongoClient } = require("mongodb");
const config = require("../config");

let mongoUrl = `mongodb://${config.mongodb.username}:${config.mongodb.password}@${config.mongodb.url}`;
mongoUrl = `mongodb://${config.mongodb.url}`;

const client = new MongoClient(mongoUrl, {
  // tls: true,
  // tlsAllowInvalidCertificates: true,
  // tlsAllowInvalidHostnames: true,
  maxPoolSize: 20,
  authSource: "admin",
  maxIdleTimeMS: 10000,
  w: "majority",
  // replicaSet: config.mongodb.replicaSet,
});

let database;

async function connect() {
  if (!database) {
    await client.connect();
    database = client.db("ResourcesDB");
  }
  return database;
}

async function disconnect() {
  await client.close();
}

module.exports = {
  connect,
  disconnect,
};
