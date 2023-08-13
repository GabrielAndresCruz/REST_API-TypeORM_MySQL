import express from "express";
import { AuthorsController } from "../http/controllers/AuthorsController";
import { FileUploader } from "../http/middlewares/FileUploader";
import { AuthMiddleware } from "../http/middlewares/AuthMiddleware";
import { AdminMiddleware } from "../http/middlewares/AdminMiddleware";

const router = express.Router();

const authorsController = new AuthorsController();

router.get("/", authorsController.getAuthors);

router.get("/:id", authorsController.getAuthor);

router.post(
  "/",
  AuthMiddleware.authenticate,
  FileUploader.upload("image", "authors", 2 * 1024 * 1024),
  authorsController.create
);

router.put("/:id", AuthMiddleware.authenticate, authorsController.update);

router.delete(
  "/:id",
  AdminMiddleware.check,
  AuthMiddleware.authenticate,
  authorsController.delete
);

export default router;
