"use-strict";

const Router = require("koa-router");
const Joi = require("joi");
const logger = require("../utils/logging.util");
const resourcesHelper = require("../helpers/resource.helper");
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

const resourceSchema = Joi.object({
  metadata: metadataSchema,
  spec: Joi.object({
    name: Joi.string().required(),
    age: Joi.number().min(1).max(200).required(),
    nationality: Joi.string().required(),
  }).required(),
}).options({ stripUnknown: true });

const resourcePatchSchema = patchSchemaBuilder(
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

  router.get("/resources", async (ctx, next) => {
    resources = await resourcesHelper.getResources();
    ctx.response.body = resources;
    ctx.response.status = 201;
  });

  router.post("/resources", async (ctx, next) => {
    const resourceReq = await resourceSchema.validateAsync(ctx.request.body);
    const name = resourceReq.metadata.name;

    logger.info(`Creatingresource with name [${name}]`, resourceReq);

    const resource = await resourcesHelper.getResourceByName(name);
    if (resource) {
      throw new ConflictError(`Resource [${name}] already exists!`);
    }
    await resourcesHelper.persistResource(resourceReq);
    ctx.response.status = 201;
    ctx.response.body = resourceReq;
  });

  router.get("/resources/:name", async (ctx, next) => {
    const resource = await resourcesHelper.getResourceByName(ctx.params.name);
    if (!resource) {
      throw new NotFoundError(
        `Resource with name [${ctx.params.name}] is not found`
      );
    }
    ctx.response.body = resource;
  });

  router.patch("/resources/:name", async (ctx, next) => {
    const resourcePatchReq = await resourcePatchSchema.validateAsync(
      ctx.request.body
    );

    const name = ctx.params.name;

    logger.info(`Patchingresource with name [${name}]`, resourcePatchReq);

    const resource = await resourcesHelper.getResourceByName(name);
    if (!resource) {
      throw new BadArgumentError(
        `Resource with name [${ctx.params.name}] is not found`
      );
    }
    const patchedResource = patchObject(resource, resourcePatchReq);
    if (patchedResource) {
      ctx.response.body = await resourcesHelper.patchResource(
        name,
        patchedResource
      );
    } else {
      logger.warn(
        `Ignoring patch request [${resource}] as spec has not changed`
      );
      ctx.response.body = resource;
    }
    ctx.response.status = 200;
  });

  router.delete("/resources/:name", async (ctx, next) => {
    const resource = await resourcesHelper.getResourceByName(ctx.params.name);
    if (!resource) {
      throw new NotFoundError(
        `Resource with name [${ctx.params.name}] is not found`
      );
    } else {
      await resourcesHelper.deleteResourceByName(ctx.params.name);
      ctx.response.body = `Resource [${ctx.params.name}] is deleted`;
    }
  });

  return router;
};
