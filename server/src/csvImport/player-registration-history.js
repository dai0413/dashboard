import fs from "fs";
import path from "path";
import dotenv from "dotenv";
dotenv.config();

const mongoUri = process.env.MONGODB_URI;

import csv from "csv-parser";
import mongoose from "mongoose";
import { createObjectCsvWriter as createCsvWriter } from "csv-writer";
import { PlayerModel } from "../dist/models/player.js";
import { TeamModel } from "../dist/models/team.js";
import { SeasonModel } from "../dist/models/season.js";
import { PlayerRegistrationHistoryModel } from "../dist/models/player-registration-history.js";
import { parseBoolean } from "./utils/parseBoolean.js";
import { parseObjectId } from "./utils/parseObjectId.js";
import { PlayerRegistrationHistoryFormSchema } from "@dai0413/myorg-shared";

function parseDateToUTC(val) {
  if (!val) return null;
  const [y, m, d] = val.split(/[\/\-]/).map(Number);
  return new Date(Date.UTC(y, m - 1, d, 0, 0, 0)); // 1993/2/1 JST → UTC 1993-01-31 15:00
}

const INPUT_BASE_PATH = process.env.INPUT_BASE_PATH;
const inputPath = path.join(INPUT_BASE_PATH, "player-registration-history.csv");
const outputPath = path.join(
  INPUT_BASE_PATH,
  "failed_player-registration-history.csv"
);

mongoose.connect(mongoUri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

fs.writeFileSync(outputPath, "\uFEFF"); // BOM

const datas = [];

fs.createReadStream(path.resolve(inputPath), { encoding: "utf8" })
  .pipe(
    csv({
      trim: true,
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
    const preValid = datas.map((row) => ({
      date: parseDateToUTC(row.date),
      season: row.season,
      player: row.player,
      team: row.team,
      registration_type: row.registration_type,
      changes: {
        number: row.number ? Number(row.number) : undefined,
        position_group: row.position_group ? row.position_group : undefined,
        name: row.name ? row.name : undefined,
        en_name: row.en_name ? row.en_name : undefined,
        height: row.height ? Number(row.height) : undefined,
        weight: row.weight ? Number(row.weight) : undefined,
        homegrown: row.homegrown ? parseBoolean(row.homegrown) : undefined,
        isTypeTwo: row.isTypeTwo ? parseBoolean(row.isTypeTwo) : undefined,
        isSpecialDesignation: row.isSpecialDesignation
          ? parseBoolean(row.isSpecialDesignation)
          : undefined,
        note: row.note ? row.note : undefined,
      },
    }));

    // console.log(preValid[0]);
    console.log("preValid", preValid.length, "件更新開始");

    const validated = [];
    const invalid = [];

    for (const row of preValid) {
      try {
        const parsed = PlayerRegistrationHistoryFormSchema.parse(row);
        validated.push(parsed);
      } catch (err) {
        invalid.push({ row, error: err });
      }
    }

    console.log("OK:", validated.length);
    console.log("NG:", invalid.length);

    if (invalid.length > 0) {
      console.error(
        `❌ ${invalid.length}件の不正データが見つかりました。処理を中止します。`
      );
      for (const item of invalid) {
        console.error(item);
      }
      return;
    }

    const datasToAdd = validated.map((row) => ({
      __original: { ...row },
      date: row.date,
      season: parseObjectId(row.season),
      player: parseObjectId(row.player),
      team: parseObjectId(row.team),
      registration_type: row.registration_type,
      changes: { ...row.changes },
    }));

    try {
      const added = await PlayerRegistrationHistoryModel.insertMany(
        datasToAdd,
        {
          ordered: false,
        }
      );
      console.log(`✅ 挿入完了: ${added.length} 件`);
    } catch (err) {
      console.error("⚠️ 一部挿入失敗");

      // 🛡 1) writeErrors ガード
      if (
        !err ||
        !Array.isArray(err.writeErrors) ||
        err.writeErrors.length === 0
      ) {
        console.error("❌ writeErrors が得られず、失敗行を特定できません", err);
        return;
      }

      const failedRows = err.writeErrors
        .map((e) => {
          const index = e.index;
          const original = datasToAdd[index]?.__original;
          if (!original) {
            console.warn(`⚠️ インデックス ${index} の元データが見つかりません`);
            return null;
          }
          return {
            ...original,
            err:
              e.err?.errmsg ||
              e.err?.message ||
              e.err?.reason?.message ||
              "unknown error",
          };
        })
        .filter(Boolean);

      if (failedRows.length > 0) {
        // csv-writer で出力
        const csvWriter = createCsvWriter({
          path: outputPath,
          header: Object.keys(failedRows[0]).map((k) => ({ id: k, title: k })),
          append: false,
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
