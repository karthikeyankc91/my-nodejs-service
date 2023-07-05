const userStore = require("./user.store");

async function persistUser(user) {
  const now = new Date();
  const userObject = {
    metadata: {
      ...user.metadata,
      createdDate: now,
      lastModifiedTime: now,
    },
    spec: user.spec,
    state: {},
    status: {
      pogress: "SUBMITTED",
      message: "Queued for porcessing",
    },
  };
  return userStore.createUser(userObject);
}

async function patchUser(name, userSpec) {
  return await userStore.updateUser(name, userSpec);
}

async function getUserByName(name) {
  return await userStore.getUserById(name);
}

async function getUsers() {
  return await userStore.getAllUsers();
}

async function deleteUserByName(name) {
  return await userStore.deleteUserById(name);
}

module.exports = {
  persistUser,
  patchUser,
  getUserByName,
  getUsers,
  deleteUserByName,
};
