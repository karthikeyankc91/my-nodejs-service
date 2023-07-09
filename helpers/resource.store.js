const resourcesMap = {
  boon123: {
    metadata: {
      name: "boon123",
    },
    spec: {
      name: "Karthikeyan KC",
      age: 30,
      nationality: "Indian",
    },
  },
};

async function createResource(resourceObject) {
  resourcesMap[resourceObject.metadata.name] = resourceObject;
}

async function updateResource(name, resourceObject) {
  resourcesMap[name] = resourceObject;
  return resourceObject;
}

async function getResourceById(name) {
  return resourcesMap[name];
}

async function getAllResources() {
  return Object.values(resourcesMap);
}

async function deleteResourceById(name) {
  delete resourcesMap[name];
}

module.exports = {
  createResource,
  updateResource,
  getResourceById,
  getAllResources,
  deleteResourceById,
};
