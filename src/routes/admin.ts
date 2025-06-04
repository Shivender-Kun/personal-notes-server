import {
  createAdminSchema,
  loginAdminSchema,
} from "../validations/admin.validation";
import controllers from "../controllers";
import { validate, authHandler } from "../middlewares";
import { Router } from "express";

// Set up routes for the application
const router = Router();

// Define the other routes
router.post(
  "/register",
  validate(createAdminSchema),
  controllers.admin.registerAdmin
);

router.post("/login", validate(loginAdminSchema), controllers.admin.loginAdmin);

export default router;
