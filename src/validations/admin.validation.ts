import Joi from "joi";

const createAdminSchema = Joi.object({
  email: Joi.string().email().required(),
  profilePicture: Joi.string().required(),
  password: Joi.string().pattern(new RegExp("^[a-zA-Z0-9]{3,30}$")).required(),
});

const loginAdminSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required(),
});

const changeAdminPasswordSchema = Joi.object({
  oldPassword: Joi.string().required(),
  newPassword: Joi.string()
    .pattern(new RegExp("^[a-zA-Z0-9]{3,30}$"))
    .required(),
});

export { createAdminSchema, loginAdminSchema, changeAdminPasswordSchema };
