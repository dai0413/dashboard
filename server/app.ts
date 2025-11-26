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
  })
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

import player from "./routes/player.js";
import transfer from "./routes/transfer.js";
import injury from "./routes/injury.js";
import matchFormat from "./routes/match-format.js";
import match from "./routes/match.js";
import team from "./routes/team.js";
import competitionStage from "./routes/competition-stage.js";
import competition from "./routes/competition.js";
import country from "./routes/country.js";
import nationalMatchSeries from "./routes/national-match-series.js";
import nationalCallup from "./routes/national-callup.js";
import referee from "./routes/referee.js";
import season from "./routes/season.js";
import stadium from "./routes/stadium.js";
import teamCompetitionSeason from "./routes/team-competition-season.js";
import playerRegistration from "./routes/player-registration.js";
import playerRegistrationHistory from "./routes/player-registration-history.js";

app.use(`/api/v1`, auth);
app.use(`/api/v1`, authmiddleware, aggregate);
app.use(`/api/v1`, authmiddleware, country);
app.use(`/api/v1`, authmiddleware, competitionStage);
app.use(`/api/v1`, authmiddleware, competition);
app.use(`/api/v1`, authmiddleware, matchFormat);
app.use(`/api/v1`, authmiddleware, match);
app.use(`/api/v1`, authmiddleware, injury);
app.use(`/api/v1`, authmiddleware, nationalCallup);
app.use(`/api/v1`, authmiddleware, nationalMatchSeries);
app.use(`/api/v1`, authmiddleware, playerRegistrationHistory);
app.use(`/api/v1`, authmiddleware, playerRegistration);
app.use(`/api/v1`, authmiddleware, player);
app.use(`/api/v1`, authmiddleware, referee);
app.use(`/api/v1`, authmiddleware, season);
app.use(`/api/v1`, authmiddleware, stadium);
app.use(`/api/v1`, authmiddleware, teamCompetitionSeason);
app.use(`/api/v1`, authmiddleware, team);
app.use(`/api/v1`, authmiddleware, transfer);
app.use(`/api/v1`, top);

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
