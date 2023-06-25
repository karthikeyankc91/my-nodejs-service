const Joi = require("joi");
const _ = require("lodash");
const jsonMergePatch = require("json-merge-patch");

const metadataSchema = Joi.object({
  name: Joi.string().required(),
  active: Joi.boolean().default(true),
}).required();

function getActor(ctx) {
  return ctx.get("X-On-Behalf-Of") || "system";
}

const patchMetadataSchema = Joi.object({
  name: Joi.any().forbidden(),
  active: Joi.boolean().optional(),
});

function patchSchemaBuilder(specSchema) {
  return Joi.object({
    spec: specSchema.default({}),
    metadata: patchMetadataSchema.default({}),
  })
    .or("spec", "metadata")
    .options({ stripUnknown: true });
}

function patchObject(originalObject, patchRequest) {
  const cloneMetadata = _.cloneDeep(originalObject.metadata);
  const cloneSpec = _.cloneDeep(originalObject.spec);

  const mergedMetadata = jsonMergePatch.apply(
    cloneMetadata,
    patchRequest.metadata
  );
  const mergedSpec = jsonMergePatch.apply(cloneSpec, patchRequest.spec);

  if (
    _.isEqual(mergedMetadata, originalObject.metadata) &&
    _.isEqual(mergedSpec, originalObject.spec)
  ) {
    return null;
  } else {
    originalObject.metadata = mergedMetadata;
    originalObject.spec = mergedSpec;
    return originalObject;
  }
}

module.exports = { metadataSchema, getActor, patchSchemaBuilder, patchObject };
