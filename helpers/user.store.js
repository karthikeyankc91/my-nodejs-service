const usersMap = {
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

async function deleteUserById(name) {
  delete usersMap[name];
}

module.exports = {
  createUser,
  updateUser,
  getUserById,
  getAllUsers,
  deleteUserById,
};
