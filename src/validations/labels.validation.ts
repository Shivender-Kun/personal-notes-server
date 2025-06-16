import Joi from "joi";

const createLabelSchema = Joi.object({
  name: Joi.string().min(1).max(20).required(),
});

const updateLabelSchema = Joi.object({
  name: Joi.string().min(1).max(20).required(),
});

export { createLabelSchema, updateLabelSchema };
