import {
  createUserSchema,
  forgotPasswordSchema,
  loginUserSchema,
  resetPasswordSchema,
} from "../validations/users.validation";
import controllers from "../controllers";
import { validate, authHandler } from "../middlewares";
import { Router } from "express";
import csurf from "csurf";

// Set up routes for the application
const router = Router();

const csrfProtection = csurf({ cookie: true, ignoreMethods: ["POST"] });

// Define the other routes
router.post(
  "/register",
  validate(createUserSchema),
  controllers.user.registerUser
);

router.post(
  "/login",
  validate(loginUserSchema),
  csrfProtection,
  controllers.user.loginUser
);

router.get("/details", authHandler, controllers.user.userDetails);

router.patch("/update", authHandler, controllers.user.updateUser);

router.post("/logout", controllers.user.logoutUser);

router.post(
  "/forgot-password",
  validate(forgotPasswordSchema),
  controllers.user.forgotPassword
);

router.post(
  "/reset-password",
  validate(resetPasswordSchema),
  controllers.user.resetPassword
);

router.delete("/delete", authHandler, controllers.user.deleteAccount);

export default router;
