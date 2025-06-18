import {
  createNoteSchema,
  updateNoteSchema,
} from "../validations/notes.validation";
import { validate, authHandler, pagination } from "../middlewares";
import controllers from "../controllers";
import { Router } from "express";

// Set up routes for the application
const router = Router();

// Define the other routes
router.get("/", authHandler, pagination, controllers.note.notesList);

router.post(
  "/",
  authHandler,
  validate(createNoteSchema),
  controllers.note.addNote
);

router.patch(
  "/:id",
  authHandler,
  validate(updateNoteSchema),
  controllers.note.updateNote
);

router.patch("/:id/pin", authHandler, controllers.note.pinNote);

router.patch("/:id/unpin", authHandler, controllers.note.unpinNote);

router.patch("/:id/archive", authHandler, controllers.note.archiveNote);

router.patch("/:id/unarchive", authHandler, controllers.note.unarchiveNote);

router.patch("/:id/restore", authHandler, controllers.note.restoreNote);

router.patch("/:id/delete", authHandler, controllers.note.deleteNote);

router.delete("/:id", authHandler, controllers.note.deleteNotePermanently);

export default router;
