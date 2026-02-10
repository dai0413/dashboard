import { Types } from "mongoose";
import { IPlayerRegistrationHistory } from "../../models/player-registration-history.js";
import { PlayerRegistrationModel } from "../../models/player-registration.js";

export async function asyncRegistration(hist: IPlayerRegistrationHistory) {
  switch (hist.registration_type) {
    case "register":
      return handleRegister(hist);

    case "change":
      return handleChange(hist);

    case "deregister":
      return handleDeregister(hist);
  }
}

async function handleRegister(prh: IPlayerRegistrationHistory) {
  // ① 新規 PR を作成
  const newReg = await PlayerRegistrationModel.create({
    date: prh.date,
    season: prh.season,
    competition: prh.competition,
    player: prh.player,
    team: prh.team,
    registration_type: "register",
    ...prh.changes, // number, name, etc.
    registration_status: "active",
  });

  return newReg;
}

async function handleChange(prh: IPlayerRegistrationHistory) {
  const latest = await PlayerRegistrationModel.findOne({
    season: prh.season,
    player: prh.player,
    team: prh.team,
    registration_type: "register",
  }).sort({ date: -1 });

  if (!latest) return;

  // 差分を適用
  if (prh.changes && Object.keys(prh.changes).length > 0) {
    // _$set で差分だけを更新_
    await PlayerRegistrationModel.updateOne(
      { _id: latest._id },
      { $set: prh.changes }
    );
  }

  return;
}

async function handleDeregister(prh: IPlayerRegistrationHistory) {
  // ① deregister データを新規作成
  await PlayerRegistrationModel.create({
    date: prh.date,
    season: prh.season,
    competition: prh.competition,
    player: prh.player,
    team: prh.team,
    ...prh.changes, // number, name, etc.
    registration_type: "deregister",
    registration_status: "terminated",
  });

  await reconcileLatestRegisterActive(prh.season, prh.player, prh.team);
}

async function reconcileLatestRegisterActive(
  season: Types.ObjectId | string,
  player: Types.ObjectId | string,
  team: Types.ObjectId | string
) {
  // ObjectId 化
  const seasonId =
    typeof season === "string" ? new Types.ObjectId(season) : season;
  const playerId =
    typeof player === "string" ? new Types.ObjectId(player) : player;
  const teamId = typeof team === "string" ? new Types.ObjectId(team) : team;

  // 1. 最新の register を 1件だけ取得（deregister は含まない）
  const latestRegister = await PlayerRegistrationModel.findOne({
    season: seasonId,
    player: playerId,
    team: teamId,
    registration_type: "register",
  })
    .sort({ date: -1, _id: -1 }) // 日付降順 → 同日なら _id で判定
    .exec();

  if (!latestRegister) return;

  // 2. その register の status を terminated にする
  await PlayerRegistrationModel.updateOne(
    { _id: latestRegister._id },
    { $set: { registration_status: "terminated" } }
  );
}
