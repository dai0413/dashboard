const fs = require("fs");
const path = require("path");
require("dotenv").config({
  path: path.resolve(__dirname, "../.env"),
});
const csv = require("csv-parser");
const mongoose = require("mongoose");
const createCsvWriter = require("csv-writer").createObjectCsvWriter;
const NationalMatchSeries = require("../models/national-match-series");

const inputPath =
  process.env.SAMPLE_INPUT_MODEL_PATH_NATIONAL_MATCH_SERIES ||
  "national-match-series.csv";
const outputPath =
  process.env.SAMPLE_OUTPUT_MODEL_PATH_NATIONAL_MATCH_SERIES ||
  "failed_national-match-series.csv";
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
    const datasToAdd = datas.map((row) => ({
      __original: { ...row },
      ...row,
      name: row.name,
      abbr: row.abbr ? row.abbr : null,
      country: new mongoose.Types.ObjectId(row.country),
      team_class: row.team_class ? row.team_class : null,
      matchs: null,
      joined_at: row.joined_at ? new Date(row.joined_at) : null,
      left_at: row.left_at ? new Date(row.left_at) : null,
      urls: row.urls ? row.urls.split(";") : [],
    }));

    try {
      const added = await NationalMatchSeries.insertMany(datasToAdd, {
        ordered: false,
      });
      console.log(`✅ 挿入完了: ${added.length} 件`);
    } catch (err) {
      console.error("⚠️ 一部挿入失敗");
      if (err?.writeErrors?.length) {
        err.writeErrors.slice(0, 5).forEach((e, i) => {
          console.error(`❌ WriteError ${i + 1}:`, e.errmsg || e.message);
          if (e.err && e.err.op) {
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
