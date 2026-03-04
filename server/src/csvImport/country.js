import fs from "fs";
import path from "path";
import dotenv from "dotenv";
dotenv.config({
  path: path.resolve(process.cwd(), "../.env"),
});
import csv from "csv-parser";
import { mongoose } from "mongoose";
import { createObjectCsvWriter as createCsvWriter } from "csv-writer";
import { Country } from "../models/country.js";

const inputPath = process.env.SAMPLE_INPUT_MODEL_PATH_COUNTRY || "country.csv";
const outputPath =
  process.env.SAMPLE_OUTPUT_MODEL_PATH_COUNTRY || "failed_country.csv";
const mongoUri = process.env.MONGODB_URI;

mongoose.connect(mongoUri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const countries = [];

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
    countries.push(row);
  })
  .on("end", async () => {
    // console.log("input data", countries[0]);
    const countriesToAdd = countries.map((row) => ({
      __original: { ...row },
      ...row,
      name: row.name,
      en_name: row.en_name ? row.en_name : null,
      iso3: row.iso3 ? row.iso3 : null,
      fifa_code: row.fifa_code ? row.fifa_code : null,
      area: row.area ? row.area : null,
      district: row.district ? row.district : null,
      confederation: row.confederation ? row.confederation : null,
      sub_confederation: row.sub_confederation ? row.sub_confederation : null,
      established_year: row.established_year ? row.established_year : null,
      fifa_member_year: row.fifa_member_year ? row.fifa_member_year : null,
      association_member_year: row.association_member_year
        ? row.association_member_year
        : null,
      district_member_year: row.district_member_year
        ? row.district_member_year
        : null,
    }));

    try {
      const added = await Country.insertMany(countriesToAdd, {
        ordered: false,
      });
      console.log(`✅ 挿入完了: ${added.length} / ${countries.length} 件`);

      if (added.mongoose?.validationErrors?.length) {
        added.mongoose.validationErrors.slice(0, 5).forEach((err, i) => {
          console.log(`⚠️  ValidationError ${i + 1}:`, err.message);
          /* err.errors を見るとフィールド単位で詳細が出ます
         Object.keys(err.errors).forEach(k => console.log(k, err.errors[k].message));
      */
        });
      }
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
          const original = countriesToAdd[index]?.__original;
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
