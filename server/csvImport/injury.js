const fs = require("fs");
const path = require("path");
require("dotenv").config({
  path: path.resolve(__dirname, "../.env"),
});
const csv = require("csv-parser");
const mongoose = require("mongoose");
const createCsvWriter = require("csv-writer").createObjectCsvWriter;
const Injury = require("../models/injury");

const inputPath = process.env.SAMPLE_INPUT_MODEL_PATH_INJURY || "injury.csv";
const outputPath =
  process.env.SAMPLE_OUTPUT_MODEL_PATH_INJURY || "failed_injury.csv";
const mongoUri = process.env.MONGODB_URI;

mongoose.connect(mongoUri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const injuries = [];

const toBool = (s) =>
  typeof s === "string" ? s.trim().toLowerCase() === "true" : !!s;

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
    injuries.push(row);
  })
  .on("end", async () => {
    // console.log("input data", injuries[0]);
    const injuriesToAdd = injuries.map((row) => ({
      __original: { ...row },
      ...row,
      doa: row.doa,
      team: row.team ? new mongoose.Types.ObjectId(row.team) : null,
      team_name: row.team_name ? row.team_name : null,
      now_team: null,
      player: row.player ? new mongoose.Types.ObjectId(row.player) : null,
      doi: row.doi ? row.doi : null,
      dos: row.dos ? row.dos : null,
      injured_part: row.injured_part ? row.injured_part.split(",") : [],
      is_injured: row.is_injured ? toBool(row.is_injured) : true,
      ttp: row.ttp ? row.ttp.split(",") : [],
      erd: row.erd ? row.erd : null,
      URL: row.URL ? row.URL.split(";") : [],
    }));

    try {
      const added = await Injury.insertMany(injuriesToAdd, {
        ordered: false,
      });
      console.log(`✅ 挿入完了: ${added.length} 件`);

      //   if (added.mongoose?.validationErrors?.length) {
      //     added.mongoose.validationErrors.slice(0, 5).forEach((err, i) => {
      //       console.log(`⚠️  ValidationError ${i + 1}:`, err.message);
      //       /* err.errors を見るとフィールド単位で詳細が出ます
      //    Object.keys(err.errors).forEach(k => console.log(k, err.errors[k].message));
      // */
      //     });
      // }
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
          const original = injuriesToAdd[index]?.__original;
          if (!original) {
            console.warn(`⚠️ インデックス ${index} の元データが見つかりません`);
            return null;
          }
          return {
            ...original,
            err: e.errmsg || e.message || e.reason?.message || "unknown error",
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
