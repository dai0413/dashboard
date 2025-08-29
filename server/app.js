require("dotenv").config();
require("express-async-errors");
require("dotenv");

const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const app = express();

const CLIENT_URLS = process.env.CLIENT_URL?.split(",");

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin || CLIENT_URLS.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
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
const top = require("./routes/top");
const aggregate = require("./routes/aggregate");

const player = require("./routes/player");
const transfer = require("./routes/transfer");
const injury = require("./routes/injury");
const team = require("./routes/team");
const competition = require("./routes/competition");
const country = require("./routes/country");
const nationalMatchSeries = require("./routes/national-match-series");
const nationalCallup = require("./routes/national-callup");
const referee = require("./routes/referee");

app.use("/api/v1/auth", auth);
app.use("/api/v1/aggregate", authmiddleware, aggregate);
app.use("/api/v1/country", authmiddleware, country);
app.use("/api/v1/competition", authmiddleware, competition);
app.use("/api/v1/injury", authmiddleware, injury);
app.use("/api/v1/national-callup", authmiddleware, nationalCallup);
app.use("/api/v1/national-match-series", authmiddleware, nationalMatchSeries);
app.use("/api/v1/player", authmiddleware, player);
app.use("/api/v1/referee", authmiddleware, referee);
app.use("/api/v1/team", authmiddleware, team);
app.use("/api/v1/top-page", top);
app.use("/api/v1/transfer", authmiddleware, transfer);

app.get("/", (req, res) => {
  res.send("Hello World");
});

// not found

// error handle
const notFoundMiddleware = require("./middleware/not-found");
const errorHandlerMiddleware = require("./middleware/error");
app.use(notFoundMiddleware);
app.use(errorHandlerMiddleware);

const port = process.env.PORT || 3000;

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
