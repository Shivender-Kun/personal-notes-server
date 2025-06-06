import Joi from "joi";

const createNoteSchema = Joi.object({
  bgColor: Joi.string().min(0),
  title: Joi.string().min(1).max(1000),
  isPinned: Joi.boolean().default(false),
  content: Joi.string().min(0).max(19999),
  labels: Joi.array().items(Joi.string()).max(5),
});

const updateNoteSchema = Joi.object({
  bgColor: Joi.string().min(0),
  isPinned: Joi.boolean().default(false),
  title: Joi.string().min(1).max(1000),
  content: Joi.string().min(0).max(19999),
  labels: Joi.array().items(Joi.string()).max(5),
});

export { createNoteSchema, updateNoteSchema };
