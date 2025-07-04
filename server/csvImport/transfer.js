const fs = require("fs");
const path = require("path");
require("dotenv").config({
  path: path.resolve(__dirname, "../.env"),
});
const csv = require("csv-parser");
const mongoose = require("mongoose");
const createCsvWriter = require("csv-writer").createObjectCsvWriter;
const Transfer = require("../models/transfer");

const inputPath =
  process.env.SAMPLE_INPUT_MODEL_PATH_TRANSFER || "transfer.csv";
const outputPath =
  process.env.SAMPLE_OUTPUT_MODEL_PATH_TRANSFER || "failed_transfer.csv";
const mongoUri = process.env.MONGODB_URI;

mongoose.connect(mongoUri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const transfers = [];

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
    transfers.push(row);
  })
  .on("end", async () => {
    const transfersToAdd = transfers.map((row) => ({
      __original: { ...row },
      ...row,
      doa: row.doa,
      from_team: row.from_team
        ? new mongoose.Types.ObjectId(row.from_team)
        : null,
      from_team_name: row.from_team_name ? row.from_team_name : null,
      to_team: row.to_team ? new mongoose.Types.ObjectId(row.to_team) : null,
      to_team_name: row.to_team_name ? row.to_team_name : null,
      player: row.player ? new mongoose.Types.ObjectId(row.player) : null,
      position: row.position ? row.position.split(",") : [],
      form: row.form ? row.form : null,
      number: row.number ? row.number : null,
      from_date: row.from_date ? row.from_date : null,
      to_date: row.to_date ? row.to_date : null,
      URL: row.URL ? row.URL.split(";") : [],
    }));

    try {
      const added = await Transfer.insertMany(transfersToAdd, {
        ordered: false,
      });
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
          const original = transfersToAdd[index]?.__original;
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
