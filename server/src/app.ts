import dotenv from "dotenv";
dotenv.config();

import "express-async-errors";

import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
const app = express();

const CLIENT_URLS = process.env.CLIENT_URL?.split(",");

app.use(
  cors({
    origin: function (origin, callback) {
      if (
        !origin ||
        (CLIENT_URLS !== undefined && CLIENT_URLS.includes(origin))
      ) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
  }),
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// db
import connectDB from "./db/connect.js";

// auth
import authmiddleware from "./middleware/auth.js";

// routes
import auth from "./routes/auth.js";
import top from "./routes/top.js";
import aggregate from "./routes/aggregate.js";
import models from "./routes/models/index.js";
import getNewData from "./routes/get-new-data/index.js";
import uploadStatus from "./routes/upload-status.js";
import resolve from "./routes/resolve.js";

app.use(`/api/v1`, auth);
app.use(`/api/v1`, top);
app.use(`/api/v1`, authmiddleware, aggregate);
app.use(`/api/v1`, authmiddleware, models);
app.use(`/api/v1`, authmiddleware, getNewData);
app.use(`/api/v1`, authmiddleware, uploadStatus);
app.use(`/api/v1`, authmiddleware, resolve);

app.get("/", (req, res) => {
  res.send("Hello World");
});

// not found

// error handle
import notFound from "./middleware/not-found.js";
import errorHandlerMiddleware from "./middleware/error.js";
app.use(notFound);
app.use(errorHandlerMiddleware);

const port = process.env.PORT || 3000;
const url = process.env.MONGODB_URI;

const start = async () => {
  try {
    if (url) {
      // connectDB
      await connectDB(url);
      app.listen(port, () => {
        console.log(`server is listeling on port ${port}....`);
      });
    }
  } catch (error) {
    console.log(error);
  }
};

if (process.env.NODE_ENV !== "test") {
  start();
}

export default app;
