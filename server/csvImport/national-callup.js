const fs = require("fs");
const path = require("path");
require("dotenv").config({
  path: path.resolve(__dirname, "../.env"),
});
const csv = require("csv-parser");
const mongoose = require("mongoose");
const createCsvWriter = require("csv-writer").createObjectCsvWriter;
require("../models/national-match-series");
require("../models/player");
require("../models/team");
const NationalCallUp = require("../models/national-callup");

const inputPath =
  process.env.SAMPLE_INPUT_MODEL_PATH_NATIONAL_CALLUP || "national-callup.csv";
const outputPath =
  process.env.SAMPLE_OUTPUT_MODEL_PATH_NATIONAL_CALLUP ||
  "failed_national-callup.csv";
const mongoUri = process.env.MONGODB_URI;

console.log("output ", outputPath);

mongoose.connect(mongoUri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const datas = [];

const parseBoolean = (val) => {
  if (val === undefined || val === null) return false;
  if (typeof val === "boolean") return val;
  if (typeof val === "string") {
    return ["true", "1", "yes", "y"].includes(val.toLowerCase());
  }
  return Boolean(val);
};

const parseObjectId = (val) => {
  return val ? new mongoose.Types.ObjectId(val) : null;
};

const parseDate = (val) => {
  if (!val) return null;
  const date = new Date(val);
  return isNaN(date) ? null : date;
};

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
    // console.log("data is ", datas);
    const datasToAdd = datas.map((row) => {
      return {
        __original: { ...row },
        ...row,
        series: parseObjectId(row.series),
        player: parseObjectId(row.player),
        team: parseObjectId(row.team),
        team_name: row.team_name || null,
        joined_at: parseDate(row.joined_at),
        left_at: parseDate(row.left_at),
        number: row.number ? Number(row.number) : null,
        position: row.position || null,
        is_captain: parseBoolean(row.is_captain),
        is_overage: parseBoolean(row.is_overage),
        is_backup: parseBoolean(row.is_backup),
        is_training_partner: parseBoolean(row.is_training_partner),
        is_additional_call: parseBoolean(row.is_add),
        status: row.status || "joined",
        left_reason: row.left_reason || null,
      };
    });

    const invalids = [];

    for (const d of datasToAdd) {
      const doc = new NationalCallUp(d);
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
      const added = await NationalCallUp.insertMany(datasToAdd, {
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
