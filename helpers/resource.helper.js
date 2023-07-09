const resourceStore = require("./resource.store");

async function persistResource(resource) {
  const now = new Date();
  const resourceObject = {
    metadata: {
      ...resource.metadata,
      createdDate: now,
      lastModifiedTime: now,
    },
    spec: resource.spec,
    state: {},
    status: {
      pogress: "SUBMITTED",
      message: "Queued for porcessing",
    },
  };
  return resourceStore.createResource(resourceObject);
}

async function patchResource(name, resourceSpec) {
  return await resourceStore.updateResource(name, resourceSpec);
}

async function getResourceByName(name) {
  return await resourceStore.getResourceById(name);
}

async function getResources() {
  return await resourceStore.getAllResources();
}

async function deleteResourceByName(name) {
  return await resourceStore.deleteResourceById(name);
}

module.exports = {
  persistResource,
  patchResource,
  getResourceByName,
  getResources,
  deleteResourceByName,
};
