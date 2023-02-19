import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import httpStatus from "http-status";
import MongoConnection from "./database/mongo-connection";
import routerVersion1 from "./routes/v1";
import { ApiError, errorHandler } from "./errors";
import config from "./config/config";

const app = express();

const db: MongoConnection = new MongoConnection(config.mongo.url);

db.connect()
  .then(() => {
    console.log("Database connected");
  })
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

app.listen(config.port, () => {
  console.log(`Server started on port ${config.port}`);
});

process.on("SIGINT", async () => {
  await db.disconnect();
  process.exit(0);
});
