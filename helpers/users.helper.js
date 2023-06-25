const {
  createUser,
  getAllUsers,
  getUserById,
  updateUser,
} = require("./user.store");

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
  return createUser(userObject);
}

async function patchUser(name, userSpec) {
  return await updateUser(name, userSpec);
}

async function getUserByName(name) {
  return await getUserById(name);
}

async function getUsers() {
  return await getAllUsers();
}

module.exports = {
  persistUser,
  patchUser,
  getUserByName,
  getUsers,
};
