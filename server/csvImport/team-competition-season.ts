import fs from "fs";
import path from "path";
import dotenv from "dotenv";
dotenv.config();

import csv from "csv-parser";
import mongoose from "mongoose";
import { createObjectCsvWriter as createCsvWriter } from "csv-writer";
// import Team from "../models/team.js";
// import Season from "../models/season.js";
import { CompetitionStageModel } from "../models/competition-stage.ts";
import { TeamCompetitionSeasonModel } from "../models/team-competition-season.ts";
import { parseObjectId } from "./utils/parseObjectId.js";

const INPUT_BASE_PATH = process.env.INPUT_BASE_PATH || "";
const OUTPUT_BASE_PATH = process.env.OUTPUT_BASE_PATH || "";

const inputPath = path.join(INPUT_BASE_PATH, "teamCompetitionSeason2.csv");
const outputPath = path.join(
  OUTPUT_BASE_PATH,
  "failed_teamCompetitionSeason.csv"
);
const mongoUri = process.env.MONGODB_URI || "";
mongoose.connect(mongoUri, {
  // useNewUrlParser: true,
  // useUnifiedTopology: true,
});

const datas: any = [];

fs.createReadStream(path.resolve(inputPath))
  .pipe(
    csv({
      // trim: true,
      mapHeaders: ({ header }) =>
        header // もとのヘッダー
          .replace(/^\uFEFF/, "") // 先頭の BOM を除去
          .trim(), // 前後の空白を除去
    })
  )
  .on("data", (row) => {
    datas.push(row);
  })
  .on("end", async () => {
    console.log("data ' s number is ", datas.length);

    // for (const row of datas) {
    //   const team = await Team.findOne({
    //     $or: [{ abbr: row.team }, { team: row.team }, { enTeam: row.team }],
    //   }).select("_id");
    //   if (!team) console.log("not found team", row.team);
    //   row.team = team?._id || null;

    //   const season = await Season.findOne({
    //     competition: row.competition_id,
    //     name: row.season,
    //   });
    //   if (!season) console.log("not found", row.season, row.competition);
    //   row.season = season ? season._id : null;
    // }

    for (const row of datas) {
      const competitionStage = await CompetitionStageModel.findById(
        row.competition_stage
      );

      if (!competitionStage) {
        console.error("Error", row.competition_stage);
        continue;
      }
      row.competition = competitionStage.competition;
      row.season = competitionStage.season;
    }

    const datasToAdd = datas.map((row: any) => {
      return {
        __original: { ...row },
        ...row,
        team: row.team ? parseObjectId(row.team) : undefined,
        season: row.season ? parseObjectId(row.season) : undefined,
        competition: row.competition,
      };
    });

    const invalids = [];

    for (const d of datasToAdd) {
      const doc = new TeamCompetitionSeasonModel(d);
      const err = doc.validateSync();
      if (err) {
        invalids.push({
          original: d.__original,
          error: err.message,
        });
      }
    }

    console.log("バリデーションエラー数:", invalids.length);
    if (invalids.length > 0) {
      console.log("エラー例:", invalids.slice(0, 5));
    }
    try {
      const added = await TeamCompetitionSeasonModel.insertMany(datasToAdd, {
        ordered: false,
      });
      console.log(`✅ 挿入完了: ${added.length} 件`);
    } catch (err: any) {
      console.error("⚠️ 一部挿入失敗");
      const writeErrors =
        err.writeErrors || err.result?.result?.writeErrors || [];

      if (writeErrors.length) {
        writeErrors.slice(0, 5).forEach((e: any, i: any) => {
          console.error(`❌ WriteError ${i + 1}:`, e.errmsg || e.message);
          if (e.err?.op) {
            console.log("❗️失敗したデータ:", e.err.op);
          }
        });
      } else {
        console.error("❌ writeErrors が得られず、失敗行を特定できません", err);
      }

      const failedRows = err.writeErrors
        .map((e: any) => {
          const index = e.index;
          const original = datasToAdd[index]?.__original;
          if (!original) {
            console.warn(`⚠️ インデックス ${index} の元データが見つかりません`);
            return null;
          }
          return {
            ...original,
            err:
              e.errmsg ||
              e.message ||
              e.reason?.message ||
              JSON.stringify(e.reason) ||
              "unknown error",
          };
        })
        .filter(Boolean);

      if (failedRows.length > 0) {
        // csv-writer で出力
        const csvWriter = createCsvWriter({
          path: outputPath,
          header: Object.keys(failedRows[0]).map((k) => ({ id: k, title: k })),
        });
        await csvWriter.writeRecords(failedRows);
        console.log(`❌ ${failedRows.length} 件を書き出しました`);
      } else {
        console.log("⚠️ 失敗行は検出したが、出力対象がありませんでした");
      }
    } finally {
      // ② 終了処理
      await mongoose.connection.close();
      console.log("DB コネクションをクローズしました");
    }
  });
