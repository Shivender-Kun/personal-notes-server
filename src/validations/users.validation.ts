import Joi from "joi";

const createUserSchema = Joi.object({
  email: Joi.string().email().required(),
  profilePicture: Joi.string().required(),
  password: Joi.string().pattern(new RegExp("^[a-zA-Z0-9]{3,30}$")).required(),
});

const loginUserSchema = Joi.object({
  password: Joi.string().required(),
  email: Joi.string().email().required(),
});

const updateUserSchema = Joi.object({
  email: Joi.string(),
  username: Joi.string(),
  coverPicture: Joi.string(),
  profilePicture: Joi.string(),
  userId: Joi.string().required(),
});

const changePasswordSchema = Joi.object({
  userId: Joi.string().required(),
  oldPassword: Joi.string().required(),
  newPassword: Joi.string()
    .pattern(new RegExp("^[a-zA-Z0-9]{3,30}$"))
    .required(),
});

export {
  createUserSchema,
  loginUserSchema,
  updateUserSchema,
  changePasswordSchema,
};
