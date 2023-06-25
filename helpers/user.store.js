const usersMap = {};

async function createUser(userObject) {
  usersMap[userObject.metadata.name] = userObject;
}

async function updateUser(name, userObject) {
  usersMap[name] = userObject;
  return userObject;
}

async function getUserById(name) {
  return usersMap[name];
}

async function getAllUsers() {
  return Object.values(usersMap);
}

module.exports = {
  createUser,
  updateUser,
  getUserById,
  getAllUsers,
};
