const request = require("supertest");
const server = require("../server");

const { jwsKey, generateAutorizationToken } = require("./utils/authToken.util");
process.env.AUTH_JWS_KEY = jwsKey;

afterEach(() => {
  jest.clearAllMocks();
});

beforeAll(() => {});

afterAll(() => {});

describe("GET /v1/users", () => {
  test("Should reject unauthorized user", async () => {
    const response = await request(server.callback()).get("/v1/users");
    expect(response).toBeDefined();
    expect(response.error).toBeDefined();
    expect(response.error.status).toBe(401);
    expect(response.error.text).toBe("Access denied");
  });

  test("Should return users", async () => {
    const response = await request(server.callback())
      .get("/v1/users")
      .set("Authorization", generateAutorizationToken());
    expect(response).toBeDefined();
    expect(response.status).toBe(201);
    expect(response.body).toMatchObject([
      {
        metadata: {
          name: "boon123",
        },
        spec: {
          name: "Karthikeyan KC",
          age: 30,
          nationality: "Indian",
        },
      },
    ]);
  });
});

describe("GET /v1/users/:name", () => {
  test("Should reject unauthorized user", async () => {
    const response = await request(server.callback()).get("/v1/users/boon123");
    expect(response).toBeDefined();
    expect(response.error).toBeDefined();
    expect(response.error.status).toBe(401);
    expect(response.error.text).toBe("Access denied");
  });

  test("Should return a user", async () => {
    const response = await request(server.callback())
      .get("/v1/users/boon123")
      .set("Authorization", generateAutorizationToken());
    expect(response).toBeDefined();
    expect(response.status).toBe(200);
    expect(response.body).toMatchObject({
      metadata: {
        name: "boon123",
      },
      spec: {
        name: "Karthikeyan KC",
        age: 30,
        nationality: "Indian",
      },
    });
  });

  test("Should return error when a user is not found", async () => {
    const response = await request(server.callback())
      .get("/v1/users/boon1234")
      .set("Authorization", generateAutorizationToken());
    expect(response).toBeDefined();
    expect(response.status).toBe(404);
    expect(response.body).toMatchObject({
      message: "User with name [boon1234] is not found",
      status: "failed",
    });
  });
});

describe("POST /v1/users", () => {
  test("Should reject unauthorized user", async () => {
    const response = await request(server.callback()).post("/v1/users");
    expect(response).toBeDefined();
    expect(response.error).toBeDefined();
    expect(response.error.status).toBe(401);
    expect(response.error.text).toBe("Access denied");
  });

  test("Should create a user", async () => {
    const response = await request(server.callback())
      .post("/v1/users")
      .set("Authorization", generateAutorizationToken())
      .send({
        metadata: {
          name: "boon12",
        },
        spec: {
          name: "Karthikeyan KC",
          age: 30,
          nationality: "Indian",
        },
      });
    expect(response).toBeDefined();
    expect(response.status).toBe(201);
    expect(response.body).toMatchObject({
      metadata: {
        name: "boon12",
      },
      spec: {
        name: "Karthikeyan KC",
        age: 30,
        nationality: "Indian",
      },
    });
  });

  test("Should return error when a user is already present", async () => {
    const response = await request(server.callback())
      .post("/v1/users")
      .set("Authorization", generateAutorizationToken())
      .send({
        metadata: {
          name: "boon123",
        },
        spec: {
          name: "Karthikeyan KC",
          age: 30,
          nationality: "Indian",
        },
      });
    expect(response).toBeDefined();
    expect(response.status).toBe(409);
    expect(response.body).toMatchObject({
      message: "User [boon123] already exists!",
      status: "failed",
    });
  });
});

describe("PATCH /v1/users/:name", () => {
  test("Should reject unauthorized user", async () => {
    const response = await request(server.callback()).patch(
      "/v1/users/boon123"
    );
    expect(response).toBeDefined();
    expect(response.error).toBeDefined();
    expect(response.error.status).toBe(401);
    expect(response.error.text).toBe("Access denied");
  });

  test("Should patch a user", async () => {
    const response = await request(server.callback())
      .patch("/v1/users/boon123")
      .set("Authorization", generateAutorizationToken())
      .send({
        spec: {
          name: "Karthikeyan KC",
          age: 30,
          nationality: "Indian",
        },
      });
    expect(response).toBeDefined();
    expect(response.status).toBe(200);
    expect(response.body).toMatchObject({
      metadata: {
        name: "boon123",
      },
      spec: {
        name: "Karthikeyan KC",
        age: 30,
        nationality: "Indian",
      },
    });
  });

  test("Should return error when a user is not present", async () => {
    const response = await request(server.callback())
      .patch("/v1/users/boon321")
      .set("Authorization", generateAutorizationToken())
      .send({
        spec: {
          name: "Karthikeyan KC",
          age: 30,
          nationality: "Indian",
        },
      });
    expect(response).toBeDefined();
    expect(response.status).toBe(400);
    expect(response.body).toMatchObject({
      message: "User with name [boon321] is not found",
      status: "failed",
    });
  });
});

describe("DELETE /v1/users/:name", () => {
  test("Should reject unauthorized user", async () => {
    const response = await request(server.callback()).delete(
      "/v1/users/boon123"
    );
    expect(response).toBeDefined();
    expect(response.error).toBeDefined();
    expect(response.error.status).toBe(401);
    expect(response.error.text).toBe("Access denied");
  });

  test("Should delete a user", async () => {
    const response = await request(server.callback())
      .delete("/v1/users/boon123")
      .set("Authorization", generateAutorizationToken());
    expect(response).toBeDefined();
    expect(response.status).toBe(200);
  });

  test("Should return error when a user is not present", async () => {
    const response = await request(server.callback())
      .delete("/v1/users/boon321")
      .set("Authorization", generateAutorizationToken());
    expect(response).toBeDefined();
    expect(response.status).toBe(404);
    expect(response.body).toMatchObject({
      message: "User with name [boon321] is not found",
      status: "failed",
    });
  });
});
