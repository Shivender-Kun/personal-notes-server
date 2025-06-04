import { Router } from "express";
import { validate, authHandler, pagination } from "../middlewares";
import controllers from "../controllers";
import {
  createLabelSchema,
  updateLabelSchema,
} from "../validations/labels.validation";

// Set up routes for the application
const router = Router();

router.get("/", authHandler, pagination, controllers.label.labelsList);

router.post(
  "/",
  authHandler,
  validate(createLabelSchema),
  controllers.label.addLabel
);

router.patch(
  "/:id",
  authHandler,
  validate(updateLabelSchema),
  controllers.label.updateLabel
);

router.delete("/:id", authHandler, controllers.label.deleteLabel);

export default router;
