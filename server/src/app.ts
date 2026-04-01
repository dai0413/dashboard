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

import player from "./routes/models/player.js";
import transfer from "./routes/models/transfer.js";
import injury from "./routes/models/injury.js";
import matchEventType from "./routes/models/match-event-type.js";
import matchFormat from "./routes/models/match-format.js";
import match from "./routes/models/match.js";
import team from "./routes/models/team.js";
import competitionStage from "./routes/models/competition-stage.js";
import competition from "./routes/models/competition.js";
import country from "./routes/models/country.js";
import formation from "./routes/models/formation.js";
import nationalMatchSeries from "./routes/models/national-match-series.js";
import nationalCallup from "./routes/models/national-callup.js";
import referee from "./routes/models/referee.js";
import season from "./routes/models/season.js";
import stadium from "./routes/models/stadium.js";
import staff from "./routes/models/staff.js";
import teamCompetitionSeason from "./routes/models/team-competition-season.js";
import playerRegistration from "./routes/models/player-registration.js";
import playerRegistrationHistory from "./routes/models/player-registration-history.js";
import playerAppearance from "./routes/models/player-appearance.js";
import playerMatchEventLog from "./routes/models/player-match-event-log.js";
import staffMatchEventLog from "./routes/models/staff-match-event-log.js";
import teamMatchFormation from "./routes/models/team-match-formation.js";
import staffAppearance from "./routes/models/staff-appearance.js";
import staffRegistrationHistory from "./routes/models/staff-registration-history.js";
import staffRegistration from "./routes/models/staff-registration.js";
import statsL from "./routes/models/stats-l.js";
import refereeAppearance from "./routes/models/referee-appearance.js";

import getNewData from "./routes/get-new-data.js";
import uploadStatus from "./routes/upload-status.js";
import resolve from "./routes/resolve.js";

app.use(`/api/v1`, auth);
app.use(`/api/v1`, top);

app.use(`/api/v1`, authmiddleware, aggregate);
app.use(`/api/v1`, authmiddleware, country);
app.use(`/api/v1`, authmiddleware, formation);
app.use(`/api/v1`, authmiddleware, competitionStage);
app.use(`/api/v1`, authmiddleware, competition);
app.use(`/api/v1`, authmiddleware, matchFormat);
app.use(`/api/v1`, authmiddleware, teamMatchFormation);
app.use(`/api/v1`, authmiddleware, match);
app.use(`/api/v1`, authmiddleware, injury);
app.use(`/api/v1`, authmiddleware, matchEventType);
app.use(`/api/v1`, authmiddleware, nationalCallup);
app.use(`/api/v1`, authmiddleware, nationalMatchSeries);
app.use(`/api/v1`, authmiddleware, playerAppearance);
app.use(`/api/v1`, authmiddleware, playerMatchEventLog);
app.use(`/api/v1`, authmiddleware, playerRegistrationHistory);
app.use(`/api/v1`, authmiddleware, playerRegistration);
app.use(`/api/v1`, authmiddleware, player);
app.use(`/api/v1`, authmiddleware, refereeAppearance);
app.use(`/api/v1`, authmiddleware, referee);
app.use(`/api/v1`, authmiddleware, season);
app.use(`/api/v1`, authmiddleware, stadium);
app.use(`/api/v1`, authmiddleware, staffAppearance);
app.use(`/api/v1`, authmiddleware, staffMatchEventLog);
app.use(`/api/v1`, authmiddleware, staffRegistrationHistory);
app.use(`/api/v1`, authmiddleware, staffRegistration);
app.use(`/api/v1`, authmiddleware, staff);
app.use(`/api/v1`, authmiddleware, statsL);
app.use(`/api/v1`, authmiddleware, teamCompetitionSeason);
app.use(`/api/v1`, authmiddleware, team);
app.use(`/api/v1`, authmiddleware, transfer);
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
