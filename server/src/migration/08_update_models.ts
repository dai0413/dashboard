// node --loader ts-node/esm c:\Users\Owner\Desktop\project\05_dashboard\server\migration\08_update_models.ts

// playerモデル更新
// 1. .pob を === null →→→　undefined

// teamモデル更新
// 1. .fifa_member_year を === null →→→　undefined
// 2. .sofaurl を === "" →→→　undefined (配列注意)

// countriesモデル
// 1. .district_member_year を === null →→→　undefined
// 2, .country を === null →→→ undefined

// competition-stageモデル更新
// 1. .competition を === null →→→　undefined
// 2. .en_name を === null →→→　undefined

// seasonモデル更新
// 1. .competition を === null →→→　undefined
// 2. .en_name を === null →→→　undefined

import { area } from "@dai0413/myorg-shared";
import { district } from "@dai0413/myorg-shared";
import { confederation } from "@dai0413/myorg-shared";
import { subConfederation } from "@dai0413/myorg-shared";
import { leftReason } from "@dai0413/myorg-shared";
import { positionGroup } from "@dai0413/myorg-shared";
import { level } from "@dai0413/myorg-shared";

import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();

const mongoUri = process.env.MONGODB_URI || "";

const runUpdates = async () => {
  const conn = await mongoose.connect(mongoUri);
  const db = conn.connection.db;

  if (!db) return console.error("not found db");

  console.log("✅ MongoDB connected");

  // // ---  player ---
  // console.log("Updating players...");
  // await db
  //   .collection("players")
  //   .updateMany({ pob: null }, { $unset: { pob: "" } });
  // await db
  //   .collection("players")
  //   .updateMany({ dob: null }, { $unset: { dob: "" } });
  // await db
  //   .collection("players")
  //   .updateMany({ en_name: null }, { $unset: { en_name: "" } });

  // ---  countries ---
  // console.log("Updating countries...");
  // await db
  //   .collection("countries")
  //   .updateMany(
  //     { fifa_member_year: null },
  //     { $unset: { fifa_member_year: "" } }
  //   );
  // await db
  //   .collection("countries")
  //   .updateMany(
  //     { district_member_year: null },
  //     { $unset: { district_member_year: "" } }
  //   );
  // await db
  //   .collection("countries")
  //   .updateMany(
  //     { established_year: null },
  //     { $unset: { established_year: "" } }
  //   );
  // await db
  //   .collection("countries")
  //   .updateMany(
  //     { association_member_year: null },
  //     { $unset: { association_member_year: "" } }
  //   );

  // await db
  //   .collection("countries")
  //   .updateMany(
  //     { sub_confederation: { $nin: sub_confederation } },
  //     { $unset: { sub_confederation: "" } }
  //   );

  // await db
  //   .collection("countries")
  //   .updateMany(
  //     { confederation: { $nin: confederation } },
  //     { $unset: { confederation: "" } }
  //   );

  // await db
  //   .collection("countries")
  //   .updateMany({ district: { $nin: district } }, { $unset: { district: "" } });

  // await db
  //   .collection("countries")
  //   .updateMany({ area: { $nin: area } }, { $unset: { area: "" } });

  // // ---  team ---
  // console.log("Updating teams...");
  // await db
  //   .collection("teams")
  //   .updateMany({ country: null }, { $unset: { country: "" } });
  // await db
  //   .collection("teams")
  //   .updateMany({ sofaurl: "" }, { $unset: { sofaurl: "" } });

  // await db
  //   .collection("teams")
  //   .updateMany(
  //     { fifa_member_year: null },
  //     { $unset: { fifa_member_year: "" } }
  //   );

  // await db
  //   .collection("teams")
  //   .updateMany(
  //     { district_member_year: null },
  //     { $unset: { district_member_year: "" } }
  //   );

  // await db
  //   .collection("teams")
  //   .updateMany({ enTeam: "" }, { $unset: { enTeam: "" } });

  // // jdataid が文字列かつ空文字ではないものだけ変換
  // await db
  //   .collection("teams")
  //   .updateMany({ jdataid: { $type: "string", $ne: "" } }, [
  //     { $set: { jdataid: { $toDouble: "$jdataid" } } },
  //   ]);

  // // 空文字は削除して undefined 扱いにする
  // await db
  //   .collection("teams")
  //   .updateMany({ jdataid: "" }, { $unset: { jdataid: "" } });

  // await db
  //   .collection("teams")
  //   .updateMany({ transferurl: "" }, { $unset: { transferurl: "" } });

  // await db
  //   .collection("teams")
  //   .updateMany({ abbr: "" }, { $unset: { abbr: "" } });

  // // ---  competition-stage ---
  // console.log("Updating competition-stages...");
  // await db
  //   .collection("competitionstages")
  //   .updateMany({ competition: null }, { $unset: { competition: "" } });
  // await db
  //   .collection("competitionstages")
  //   .updateMany({ leg: null }, { $unset: { leg: "" } });

  // // ---  injury ---
  // console.log("Updating injurys...");
  // await db
  //   .collection("injuries")
  //   .updateMany({ team_name: null }, { $unset: { team_name: "" } });
  // await db
  //   .collection("injuries")
  //   .updateMany({ dos: null }, { $unset: { dos: "" } });
  // await db
  //   .collection("injuries")
  //   .updateMany({ erd: null }, { $unset: { erd: "" } });
  // await db
  //   .collection("injuries")
  //   .updateMany({ doi: null }, { $unset: { doi: "" } });
  // await db
  //   .collection("injuries")
  //   .updateMany({ injured_part: { $exists: true, $ne: null } }, [
  //     {
  //       $set: {
  //         injured_part: {
  //           $filter: {
  //             input: "$injured_part",
  //             as: "u",
  //             cond: { $ne: ["$$u", ""] }, // 空文字を除外
  //           },
  //         },
  //       },
  //     },
  //   ]);

  // await db
  //   .collection("injuries")
  //   .updateMany({ URL: { $exists: true, $ne: null } }, [
  //     {
  //       $set: {
  //         URL: {
  //           $filter: {
  //             input: "$URL",
  //             as: "u",
  //             cond: { $ne: ["$$u", ""] }, // 空文字を除外
  //           },
  //         },
  //       },
  //     },
  //   ]);

  // // ---  season ---
  // console.log("Updating seasons...");
  // await db
  //   .collection("seasons")
  //   .updateMany({ competition: null }, { $unset: { competition: "" } });
  // await db
  //   .collection("seasons")
  //   .updateMany({ start_date: null }, { $unset: { start_date: "" } });
  // await db
  //   .collection("seasons")
  //   .updateMany({ end_date: null }, { $unset: { end_date: "" } });

  // // ---  referee ---
  // console.log("Updating referees...");
  // await db
  //   .collection("referees")
  //   .updateMany({ pob: null }, { $unset: { pob: "" } });

  // // ---  national-match-series ---
  // console.log("Updating national-match-seriess...");
  // await db
  //   .collection("nationalmatchseries")
  //   .updateMany({ abbr: null }, { $unset: { abbr: "" } });
  // await db
  //   .collection("nationalmatchseries")
  //   .updateMany({ joined_at: null }, { $unset: { joined_at: "" } });
  // await db
  //   .collection("nationalmatchseries")
  //   .updateMany({ left_at: null }, { $unset: { left_at: "" } });

  // // ---  team-competition-season ---
  // console.log("Updating team-competition-seasons...");
  // await db
  //   .collection("teamcompetitionseasons")
  //   .updateMany(
  //     { $or: [{ note: null }, { note: "" }] },
  //     { $unset: { note: "" } }
  //   );

  // // ---  national-match-callup ---
  // console.log("Updating national-callups...");
  // await db
  //   .collection("nationalcallups")
  //   .updateMany({ team: null }, { $unset: { team: "" } });
  // await db
  //   .collection("nationalcallups")
  //   .updateMany({ left_at: null }, { $unset: { left_at: "" } });
  // await db
  //   .collection("nationalcallups")
  //   .updateMany({ joined_at: null }, { $unset: { joined_at: "" } });
  // await db
  //   .collection("nationalcallups")
  //   .updateMany({ number: null }, { $unset: { number: "" } });
  // await db
  //   .collection("nationalcallups")
  //   .updateMany(
  //     { $or: [{ team_name: null }, { team_name: "" }] },
  //     { $unset: { team_name: "" } }
  //   );
  // await db.collection("nationalcallups").updateMany(
  //   {
  //     $or: [{ left_reason: { $nin: left_reason } }, { left_reason: null }],
  //   },
  //   { $unset: { left_reason: "" } }
  // );
  // await db.collection("nationalcallups").updateMany(
  //   {
  //     $or: [
  //       { position_group: { $nin: position_group } },
  //       { position_group: null },
  //     ],
  //   },
  //   { $unset: { position_group: "" } }
  // );

  // ---  transfer ---
  console.log("Updating transfers...");
  await db
    .collection("transfers")
    .updateMany({ from_team_name: null }, { $unset: { from_team_name: "" } });
  await db
    .collection("transfers")
    .updateMany({ to_team_name: null }, { $unset: { to_team_name: "" } });
  await db
    .collection("transfers")
    .updateMany({ from_team: null }, { $unset: { from_team: "" } });
  await db
    .collection("transfers")
    .updateMany({ to_team: null }, { $unset: { to_team: "" } });
  await db
    .collection("transfers")
    .updateMany({ number: null }, { $unset: { number: "" } });
  await db
    .collection("transfers")
    .updateMany({ to_date: null }, { $unset: { to_date: "" } });

  // // URL配列の空文字を削除
  // await db
  //   .collection("transfers")
  //   .updateMany({ URL: { $exists: true, $ne: null } }, [
  //     {
  //       $set: {
  //         URL: {
  //           $filter: {
  //             input: "$URL",
  //             as: "u",
  //             cond: { $ne: ["$$u", ""] }, // 空文字を除外
  //           },
  //         },
  //       },
  //     },
  //   ]);

  // // ---  competition ---
  // console.log("Updating competitions...");
  // await db
  //   .collection("competitions")
  //   .updateMany({ en_name: null }, { $unset: { en_name: "" } });
  // await db
  //   .collection("competitions")
  //   .updateMany({ abbr: null }, { $unset: { abbr: "" } });
  // await db.collection("competitions").updateMany(
  //   {
  //     $or: [{ level: { $nin: level } }, { level: null }],
  //   },
  //   { $unset: { level: "" } }
  // );

  // ---  match-format ---
  // console.log("Updating match-formats...");
  // const collection = db.collection("matchformats");

  // await collection.updateMany({}, [
  //   {
  //     $set: {
  //       period: {
  //         $map: {
  //           input: "$period",
  //           as: "p",
  //           in: {
  //             period_label: "$$p.period_label",
  //             order: "$$p.order",
  //             start: {
  //               $cond: [{ $eq: ["$$p.start", null] }, "$$REMOVE", "$$p.start"],
  //             },
  //             end: {
  //               $cond: [{ $eq: ["$$p.end", null] }, "$$REMOVE", "$$p.end"],
  //             },
  //           },
  //         },
  //       },
  //     },
  //   },
  // ]);

  // await db
  //   .collection("matchformats")
  //   .updateMany(
  //     { "period.start": null },
  //     { $set: { "period.$[elem].start": undefined } },
  //     { arrayFilters: [{ "elem.start": null }] }
  //   );

  // await db
  //   .collection("matchformats")
  //   .updateMany(
  //     { "period.end": null },
  //     { $set: { "period.$[elem].end": undefined } },
  //     { arrayFilters: [{ "elem.end": null }] }
  //   );

  // // ---  matches ---
  // console.log("Updating matches...");
  // await db
  //   .collection("matches")
  //   .updateMany({ match_week: null }, { $unset: { match_week: "" } });

  // console.log("✅ All updates completed.");

  await conn.disconnect();
};

runUpdates().catch((err) => {
  console.error("❌ Update failed:", err);
  process.exit(1);
});
