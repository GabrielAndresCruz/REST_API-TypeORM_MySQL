import express from "express";
import { FileUploader } from "../http/middlewares/FileUploader";
import { BooksController } from "../http/controllers/BooksController";
import { AuthMiddleware } from "../http/middlewares/AuthMiddleware";
import { AdminMiddleware } from "../http/middlewares/AdminMiddleware";

const router = express.Router();

const booksControler = new BooksController();

router.get("/", booksControler.get);

router.get("/:id", booksControler.getBook);

router.post(
  "/",
  AuthMiddleware.authenticate,
  FileUploader.upload("image", "authors", 2 * 1024 * 1024),
  booksControler.create
);

router.put("/:id", AuthMiddleware.authenticate, booksControler.update);

router.delete(
  "/:id",
  AuthMiddleware.authenticate,
  AdminMiddleware.check,
  booksControler.delete
);

export default router;
