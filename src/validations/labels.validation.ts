import Joi from "joi";

const createLabelSchema = Joi.object({
  name: Joi.string().min(1).max(50).required(),
});

const updateLabelSchema = Joi.object({
  name: Joi.string().min(1).max(50).required(),
});

export { createLabelSchema, updateLabelSchema };
