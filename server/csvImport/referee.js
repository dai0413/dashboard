import fs from "fs";
import path from "path";
import dotenv from "dotenv";
dotenv.config({
  path: path.resolve(process.cwd(), "../.env"),
});

import csv from "csv-parser";
import { mongoose } from "mongoose";
import { createObjectCsvWriter as createCsvWriter } from "csv-writer";
import "../models/country.js";
import "../models/player.js";
import Country from "../models/country.js";
import Referee from "../models/referee.js";
import { parseObjectId } from "./utils/parseObjectId.js";
import { parseDate } from "./utils/parseDate.js";

const inputPath = process.env.SAMPLE_INPUT_MODEL_PATH_REFEREE || "referee.csv";
const outputPath =
  process.env.SAMPLE_OUTPUT_MODEL_PATH_REFEREE || "failed_referee.csv";
const mongoUri = process.env.MONGODB_URI;
mongoose.connect(mongoUri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const datas = [];

fs.createReadStream(path.resolve(inputPath))
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
    console.log("data ' s number is ", datas.length);

    for (const row of datas) {
      if (row.citizenship) {
        const country = await Country.findOne({ name: row.citizenship });
        row.citizenship = country ? country._id : null;
      }
    }

    const datasToAdd = datas.map((row) => {
      return {
        __original: { ...row },
        ...row,
        name: row.name,
        en_name: row.en_name || null,
        dob: parseDate(row.dob),
        pob: row.pob || null,
        citizenship: row.citizenshipId ? [row.citizenshipId] : [],
        player: parseObjectId(row.player),
        transferurl: row.transferurl || undefined,
        sofaurl: row.sofaurl || undefined,
      };
    });

    const invalids = [];

    for (const d of datasToAdd) {
      const doc = new Referee(d);
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
      const added = await Referee.insertMany(datasToAdd, {
        ordered: false,
      });
      console.log(`✅ 挿入完了: ${added.length} 件`);
    } catch (err) {
      console.error("⚠️ 一部挿入失敗");
      const writeErrors =
        err.writeErrors || err.result?.result?.writeErrors || [];

      if (writeErrors.length) {
        writeErrors.slice(0, 5).forEach((e, i) => {
          console.error(`❌ WriteError ${i + 1}:`, e.errmsg || e.message);
          if (e.err?.op) {
            console.log("❗️失敗したデータ:", e.err.op);
          }
        });
      } else {
        console.error("❌ writeErrors が得られず、失敗行を特定できません", err);
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
