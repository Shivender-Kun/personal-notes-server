import Joi from "joi";

const createUserSchema = Joi.object({
  email: Joi.string().email().required(),
  profilePicture: Joi.string().required(),
  password: Joi.string().pattern(new RegExp("^[a-zA-Z0-9]{6,30}$")).required(),
});

const loginUserSchema = Joi.object({
  password: Joi.string().required(),
  email: Joi.string().email().required(),
});

const updateUserSchema = Joi.object({
  coverPicture: Joi.string(),
  email: Joi.string().email(),
  profilePicture: Joi.string(),
  userId: Joi.string().required(),
  username: Joi.string().min(1).max(32),
});

const forgotPasswordSchema = Joi.object({
  email: Joi.string().email().required(),
});

const changePasswordSchema = Joi.object({
  userId: Joi.string().required(),
  oldPassword: Joi.string().required(),
  newPassword: Joi.string()
    .pattern(new RegExp("^[a-zA-Z0-9]{6,30}$"))
    .required(),
});

const resetPasswordSchema = Joi.object({
  token: Joi.string(),
  newPassword: Joi.string()
    .pattern(new RegExp("^[a-zA-Z0-9]{6,30}$"))
    .required(),
});

export {
  createUserSchema,
  loginUserSchema,
  updateUserSchema,
  resetPasswordSchema,
  changePasswordSchema,
  forgotPasswordSchema,
};
