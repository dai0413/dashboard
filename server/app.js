require("dotenv").config();
require("express-async-errors");
require("dotenv");

const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const app = express();

const CLIENT_URL = process.env.CLIENT_URL;

app.use(
  cors({
    origin: CLIENT_URL,
    credentials: true,
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// db
const connectDB = require("./db/connect");

// auth
const authmiddleware = require("./middleware/auth");

// routes
const auth = require("./routes/auth");
const player = require("./routes/player");
const transfer = require("./routes/transfer");
const injury = require("./routes/injury");
app.use("/api/v1/auth", auth);
app.use("/api/v1/player", authmiddleware, player);
app.use("/api/v1/transfer", authmiddleware, transfer);
app.use("/api/v1/injury", authmiddleware, injury);

app.get("/", (req, res) => {
  res.send("Hello World");
});

// not found

// error handle
const notFoundMiddleware = require("./middleware/not-found");
const errorHandlerMiddleware = require("./middleware/error");
app.use(notFoundMiddleware);
app.use(errorHandlerMiddleware);

const port = 3000;

const start = async () => {
  try {
    // connectDB
    await connectDB(process.env.MONGODB_URI);
    app.listen(port, () => {
      console.log(`server is listeling on port ${port}....`);
    });
  } catch (error) {
    console.log(error);
  }
};

start();
