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

  // ② 同一 season & player の PR を取得
  const regs = await PlayerRegistrationModel.find({
    season: prh.season,
    player: prh.player,
  }).sort({ date: 1 });

  // ③ 最も新しい PR を active、それ以外を terminated
  for (let i = 0; i < regs.length; i++) {
    regs[i].registration_status =
      i === regs.length - 1 ? "active" : "terminated";
    await regs[i].save();
  }

  return newReg;
}

async function handleChange(prh: IPlayerRegistrationHistory) {
  const latest = await PlayerRegistrationModel.findOne({
    season: prh.season,
    player: prh.player,
    team: prh.team,
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

  // ② 同一 season & player の PR のうち、prh.date より前のものを terminated
  await PlayerRegistrationModel.updateMany(
    {
      season: prh.season,
      player: prh.player,
      date: { $lte: prh.date },
    },
    { $set: { registration_status: "terminated" } }
  );
}
