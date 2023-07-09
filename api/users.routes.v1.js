"use-strict";

const Router = require("koa-router");
const Joi = require("joi");
const logger = require("../utils/logging.util");
const usersHelper = require("../helpers/users.helper");
const {
  metadataSchema,
  patchSchemaBuilder,
  patchObject,
} = require("../utils/route.utils");

const {
  ConflictError,
  NotFoundError,
  BadArgumentError,
} = require("../utils/errors.util");

const userSchema = Joi.object({
  metadata: metadataSchema,
  spec: Joi.object({
    name: Joi.string().required(),
    age: Joi.number().min(1).max(200).required(),
    nationality: Joi.string().required(),
  }).required(),
}).options({ stripUnknown: true });

const userPatchSchema = patchSchemaBuilder(
  Joi.object({
    age: Joi.number().min(1).max(200).optional(),
    nationality: Joi.string().optional(),
  }).min(1)
);

const paginatedSchema = Joi.object({
  page: Joi.number().default(1).min(1).optional(),
  limit: Joi.number().default(0).min(0).max(500).optional(),
  "spec.active": Joi.boolean().optional(),
  "spec.name": Joi.string().optional(),
}).options({ stripUnknown: true });

module.exports = () => {
  const router = new Router({
    prefix: "/v1",
  });

  router.get("/users", async (ctx, next) => {
    users = await usersHelper.getUsers();
    ctx.response.body = users;
    ctx.response.status = 201;
  });

  router.post("/users", async (ctx, next) => {
    const userReq = await userSchema.validateAsync(ctx.request.body);
    const name = userReq.metadata.name;

    logger.info(`Creating user with name [${name}]`, userReq);

    const user = await usersHelper.getUserByName(name);
    if (user) {
      throw new ConflictError(`User [${name}] already exists!`);
    }
    await usersHelper.persistUser(userReq);
    ctx.response.status = 201;
    ctx.response.body = userReq;
  });

  router.get("/users/:name", async (ctx, next) => {
    const user = await usersHelper.getUserByName(ctx.params.name);
    if (!user) {
      throw new NotFoundError(
        `User with name [${ctx.params.name}] is not found`
      );
    }
    ctx.response.body = user;
  });

  router.patch("/users/:name", async (ctx, next) => {
    const userPatchReq = await userPatchSchema.validateAsync(ctx.request.body);

    const name = ctx.params.name;

    logger.info(`Patching user with name [${name}]`, userPatchReq);

    const user = await usersHelper.getUserByName(name);
    if (!user) {
      throw new BadArgumentError(
        `User with name [${ctx.params.name}] is not found`
      );
    }
    const patchedUser = patchObject(user, userPatchReq);
    if (patchedUser) {
      ctx.response.body = await usersHelper.patchUser(name, patchedUser);
    } else {
      logger.warn(`Ignoring patch request [${user}] as spec has not changed`);
      ctx.response.body = user;
    }
    ctx.response.status = 200;
  });

  router.delete("/users/:name", async (ctx, next) => {
    const user = await usersHelper.getUserByName(ctx.params.name);
    if (!user) {
      throw new NotFoundError(
        `User with name [${ctx.params.name}] is not found`
      );
    } else {
      await usersHelper.deleteUserByName(ctx.params.name);
      ctx.response.body = `User [${ctx.params.name}] is deleted`;
    }
  });

  return router;
};
