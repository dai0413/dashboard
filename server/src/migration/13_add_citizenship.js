import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();
import "../../dist/models/player.js";
import "../../dist/models/team.js";
import "../../dist/models/country.js";
import "../../dist/models/national-callup.js";
import "../../dist/models/national-match-series.js";

const mongoUri = process.env.MONGODB_URI;

const update = async () => {
  await mongoose.connect(mongoUri);
  const PlayerModel = mongoose.model("Player");
  const TeamModel = mongoose.model("Team");
  const CountryModel = mongoose.model("Country");
  const NationalCallUpModel = mongoose.model("NationalCallUp");
  const NationalMatchSeriesModel = mongoose.model("NationalMatchSeries");

  //   const playerId = new mongoose.Types.ObjectId("68516bd288294f93ffd0c638");

  //   const callups = await NationalCallUpModel.find({
  //     player: playerId,
  //   }).populate("team", "team");

  //   console.log(
  //     callups.map((callup) => ({
  //       team: callup.team,
  //       teamId:
  //         callup.team && typeof callup.team === "object"
  //           ? callup.team._id?.toString()
  //           : callup.team?.toString(),
  //     })),
  //   );

  // 日本のIDを取得
  const japan = await CountryModel.findOne({
    name: "日本",
  }).select("_id");

  if (!japan) {
    throw new Error("Country '日本' not found");
  }

  const japanId = japan._id;

  // 日本に関係するチームを取得
  const teams = await TeamModel.find({
    team: { $regex: "日本" },
  }).select("_id");

  const teamIds = teams.map((team) => team._id);

  console.log("teamIds.length", teamIds.length);

  // 対象チームを参照している代表シリーズを取得
  const series = await NationalMatchSeriesModel.find({
    team: { $in: teamIds },
  }).select("_id");

  const seriesIds = series.map((item) => item._id);

  console.log("seriesIds.length", seriesIds.length);

  // 対象シリーズに所属する代表招集データを取得
  const nationalCallups = await NationalCallUpModel.find({
    series: { $in: seriesIds },
  }).select("player");

  console.log("nationalCallups.length", nationalCallups.length);

  // 対象選手のIDを重複なく取得
  const playerIds = [
    ...new Map(
      nationalCallups.map((callup) => [
        callup.player.toString(),
        callup.player,
      ]),
    ).values(),
  ];

  console.log("target playerIds", playerIds.length);

  // citizenship に日本のIDを追加
  const result = await PlayerModel.updateMany(
    {
      _id: { $in: playerIds },
      citizenship: { $ne: japanId },
    },
    {
      $addToSet: {
        citizenship: japanId,
      },
    },
  );

  console.log("Players citizenship update completed!");
  console.log({
    targetPlayers: playerIds.length,
    modifiedPlayers: result.modifiedCount,
  });

  await mongoose.disconnect();
  process.exit(0);
};

update();
