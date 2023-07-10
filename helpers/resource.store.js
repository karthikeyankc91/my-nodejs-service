const db = require("../db");

async function createResource(resourceObject) {
  const client = await db.connect();
  return await client.collection("resources").updateOne(
    {
      "metadata.name": resourceObject.metadata.name,
    },
    {
      $set: resourceObject,
    },
    {
      upsert: true,
    }
  );
}

async function updateResource(name, resourceObject) {
  const client = await db.connect();
  return await client.collection("resources").updateOne(
    {
      "metadata.name": resourceObject.metadata.name,
    },
    {
      $set: resourceObject,
    }
  );
}

async function getResourceById(name) {
  const client = await db.connect();
  return client.collection("resources").findOne({ "metadata.name": name });
}

async function getAllResources() {
  const client = await db.connect();
  return await client.collection("resources").find().toArray();
}

async function deleteResourceById(name) {
  const client = await db.connect();
  return await client
    .collection("resources")
    .deleteOne({ "metadata.name": name });
}

module.exports = {
  createResource,
  updateResource,
  getResourceById,
  getAllResources,
  deleteResourceById,
};
