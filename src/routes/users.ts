import {
  createUserSchema,
  loginUserSchema,
} from "../validations/users.validation";
import controllers from "../controllers";
import { validate, authHandler } from "../middlewares";
import { Router } from "express";

// Set up routes for the application
const router = Router();

// Define the other routes
router.post(
  "/register",
  validate(createUserSchema),
  controllers.user.registerUser
);

router.post("/login", validate(loginUserSchema), controllers.user.loginUser);

router.get("/details", authHandler, controllers.user.userDetails);

router.patch("/update", authHandler, controllers.user.updateUser);

router.post("/logout", controllers.user.logoutUser);

// router.post("/forgot-password", () => {});

// router.delete("/delete", () => {});

export default router;
