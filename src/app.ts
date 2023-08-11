import express, { Express, NextFunction, Request, Response } from "express";
import cookieParser from "cookie-parser";
import bodyParser from "body-parser";
import cors from "cors";
import authorsRoute from "./routes/authors";
import booksRoute from "./routes/books";
import authRoute from "./routes/auth";
import { EntityNotFoundError } from "typeorm";
import { ResponseUtl } from "./utils/Response";

const app: Express = express();

app.use(cookieParser());
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use("/authors", authorsRoute);
app.use("/books", booksRoute);
app.use("/auth", authRoute);

app.use("*", (req, res) => {
  return res.status(404).json({
    success: false,
    message: "Invalid route",
  });
});

export default app;
