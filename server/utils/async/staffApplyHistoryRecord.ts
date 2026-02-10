import { Types } from "mongoose";
import { IStaffRegistrationHistory } from "../../models/staff-registration-history.js";
import { StaffRegistrationModel } from "../../models/staff-registration.js";

export async function asyncRegistration(hist: IStaffRegistrationHistory) {
  switch (hist.registration_type) {
    case "register":
      return handleRegister(hist);

    case "change":
      return handleChange(hist);

    case "deregister":
      return handleDeregister(hist);
  }
}

async function handleRegister(prh: IStaffRegistrationHistory) {
  // ① 新規 PR を作成
  const newReg = await StaffRegistrationModel.create({
    date: prh.date,
    season: prh.season,
    competition: prh.competition,
    staff: prh.staff,
    team: prh.team,
    registration_type: "register",
    ...prh.changes, // number, name, etc.
    registration_status: "active",
  });

  return newReg;
}

async function handleChange(prh: IStaffRegistrationHistory) {
  const latest = await StaffRegistrationModel.findOne({
    season: prh.season,
    staff: prh.staff,
    team: prh.team,
    registration_type: "register",
  }).sort({ date: -1 });

  if (!latest) return;

  // 差分を適用
  if (prh.changes && Object.keys(prh.changes).length > 0) {
    // _$set で差分だけを更新_
    await StaffRegistrationModel.updateOne(
      { _id: latest._id },
      { $set: prh.changes },
    );
  }

  return;
}

async function handleDeregister(prh: IStaffRegistrationHistory) {
  // ① deregister データを新規作成
  await StaffRegistrationModel.create({
    date: prh.date,
    season: prh.season,
    competition: prh.competition,
    staff: prh.staff,
    team: prh.team,
    ...prh.changes, // number, name, etc.
    registration_type: "deregister",
    registration_status: "terminated",
  });

  await reconcileLatestRegisterActive(prh.season, prh.staff, prh.team);
}

async function reconcileLatestRegisterActive(
  season: Types.ObjectId | string,
  staff: Types.ObjectId | string,
  team: Types.ObjectId | string,
) {
  // ObjectId 化
  const seasonId =
    typeof season === "string" ? new Types.ObjectId(season) : season;
  const staffId = typeof staff === "string" ? new Types.ObjectId(staff) : staff;
  const teamId = typeof team === "string" ? new Types.ObjectId(team) : team;

  // 1. 最新の register を 1件だけ取得（deregister は含まない）
  const latestRegister = await StaffRegistrationModel.findOne({
    season: seasonId,
    staff: staffId,
    team: teamId,
    registration_type: "register",
  })
    .sort({ date: -1, _id: -1 }) // 日付降順 → 同日なら _id で判定
    .exec();

  if (!latestRegister) return;

  // 2. その register の status を terminated にする
  await StaffRegistrationModel.updateOne(
    { _id: latestRegister._id },
    { $set: { registration_status: "terminated" } },
  );
}
