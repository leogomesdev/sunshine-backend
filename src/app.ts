import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import httpStatus from "http-status";
import MongoConnection from "./database/mongo-connection";
import routerVersion1 from "./routes/v1";
import { ApiError, errorHandler } from "./errors";
import config from "./config/config";

export const app = express();

export const db: MongoConnection = new MongoConnection(config.mongo.url);

db.connect()
  .catch((error) => {
    console.error("Database connection error:", error);
  });

app.use(bodyParser.json());
app.use(cors());

app.get("/health", (req, res) => {
  res.send({ services: { api: "passed" } });
});

app.use("/api/v1", routerVersion1);

app.use((_req, _res, next) => {
  next(new ApiError(httpStatus.NOT_FOUND, "Not found"));
});

app.use(errorHandler);

process.on("SIGINT", async () => {
  await db.disconnect();
  process.exit(0);
});

export const server = app.listen(config.port);