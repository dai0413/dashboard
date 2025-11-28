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

  await reconcileLatestRegisterActive(prh.season, prh.player);

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

  await reconcileLatestRegisterActive(prh.season, prh.player);
}

async function reconcileLatestRegisterActive(
  season: Types.ObjectId | string,
  player: Types.ObjectId | string
) {
  // 全件取得（date昇順）
  const regs = await PlayerRegistrationModel.find({
    season,
    player,
  })
    .sort({ date: 1 })
    .lean();

  if (regs.length === 0) return;

  // 最新の register を探す（存在しなければ active はない）
  const registers = regs.filter((r) => r.registration_type === "register");
  const latestRegister =
    registers.length > 0
      ? registers[registers.length - 1]._id.toString()
      : null;

  const bulkOps = regs.map((r) => {
    const shouldBe =
      latestRegister && r._id.toString() === latestRegister
        ? "active"
        : "terminated";

    return {
      updateOne: {
        filter: { _id: r._id },
        update: { $set: { registration_status: shouldBe } },
      },
    };
  });

  await PlayerRegistrationModel.bulkWrite(bulkOps);
}
