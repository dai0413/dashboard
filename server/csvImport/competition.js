const fs = require("fs");
const path = require("path");
require("dotenv").config({
  path: path.resolve(__dirname, "../.env"),
});
const csv = require("csv-parser");
const mongoose = require("mongoose");
const createCsvWriter = require("csv-writer").createObjectCsvWriter;
const Country = require("../models/country");
const Competition = require("../models/competition");
const { parseObjectId } = require("./utils/parseObjectId");
const { parseBoolean } = require("./utils/parseBoolean");

const INPUT_BASE_PATH = process.env.INPUT_BASE_PATH;
const OUTPUT_BASE_PATH = process.env.OUTPUT_BASE_PATH;

const inputPath = path.join(INPUT_BASE_PATH, "competition.csv");
const outputPath = path.join(OUTPUT_BASE_PATH, "failed_competition.csv");
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
      if (row.country) {
        const country = await Country.findOne({ name: row.country });
        row.country = country ? country._id : null;
      }
    }

    const datasToAdd = datas.map((row) => {
      return {
        __original: { ...row },
        ...row,
        name: row.name,
        abbr: row.abbr || null,
        en_name: row.en_name || null,
        country: row.country ? parseObjectId(row.country) : undefined,
        competition_type: row.competition_type || null,
        category: row.category || null,
        level: row.level || null,
        age_group: row.age_group || null,
        official_match: parseBoolean(row.official_match),
        transferurl: row.transferurl ? row.transferurl : undefined,
        sofaurl: row.sofaurl ? row.sofaurl : undefined,
      };
    });

    const invalids = [];

    for (const d of datasToAdd) {
      const doc = new Competition(d);
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
      const added = await Competition.insertMany(datasToAdd, {
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
