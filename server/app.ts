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
import connectDB from "./db/connect.ts";

// auth
import authmiddleware from "./middleware/auth.ts";

// // routes
// import auth from "./routes/auth.ts";
// import top from "./routes/top.ts";
// import aggregate from "./routes/aggregate.ts";

import player from "./routes/player.ts";
// import transfer from "./routes/transfer.ts";
// import injury from "./routes/injury.ts";
// import matchFormat from "./routes/match-format.ts";
// import match from "./routes/match.ts";
// import team from "./routes/team.ts";
// import CompetitionStage from "./routes/competition-stage.ts";
// import competition from "./routes/competition.ts";
// import country from "./routes/country.ts";
// import nationalMatchSeries from "./routes/national-match-series.ts";
// import nationalCallup from "./routes/national-callup.ts";
// import referee from "./routes/referee.ts";
// import season from "./routes/season.ts";
// import stadium from "./routes/stadium.ts";
// import teamCompetitionSeason from "./routes/team-competition-season.ts";

// app.use("/api/v1/auth", auth);
// app.use("/api/v1/aggregate", authmiddleware, aggregate);
// app.use("/api/v1/country", authmiddleware, country);
// app.use("/api/v1/competition-stage", authmiddleware, CompetitionStage);
// app.use("/api/v1/competition", authmiddleware, competition);
// app.use("/api/v1/match-format", authmiddleware, matchFormat);
// app.use("/api/v1/match", authmiddleware, match);
// app.use("/api/v1/injury", authmiddleware, injury);
// app.use("/api/v1/national-callup", authmiddleware, nationalCallup);
// app.use("/api/v1/national-match-series", authmiddleware, nationalMatchSeries);
// app.use("/api/v1/player", authmiddleware, player);
app.use("/api/v1/player", player);
// app.use("/api/v1/referee", authmiddleware, referee);
// app.use("/api/v1/season", authmiddleware, season);
// app.use("/api/v1/stadium", authmiddleware, stadium);
// app.use(
//   "/api/v1/team-competition-season",
//   authmiddleware,
//   teamCompetitionSeason
// );
// app.use("/api/v1/team", authmiddleware, team);
// app.use("/api/v1/top-page", top);
// app.use("/api/v1/transfer", authmiddleware, transfer);

app.get("/", (req, res) => {
  res.send("Hello World");
});

// not found

// error handle
import notFound from "./middleware/not-found.ts";
import errorHandlerMiddleware from "./middleware/error.ts";
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
