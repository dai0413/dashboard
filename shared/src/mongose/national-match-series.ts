import mongoose, { Schema, Document, Model, Types } from "mongoose";
import { NationalMatchSeriesType } from "../schemas/national-match-series.schema.ts";
import { age_group } from "../enum/age_group.ts";

export interface INationalMatchSeries
  extends Omit<NationalMatchSeriesType, "_id" | "country" | "matchs">,
    Document {
  _id: Types.ObjectId;
  country: Types.ObjectId;
  matchs: Types.ObjectId[];
}

const NationalMatchSeriesSchema: Schema<INationalMatchSeries> = new Schema<
  INationalMatchSeries,
  any,
  INationalMatchSeries
>(
  {
    name: { type: String, required: true },
    abbr: { type: String },
    country: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Country",
      required: true,
    },
    age_group: { type: String, enum: age_group },
    matchs: {
      type: [mongoose.Schema.Types.ObjectId],
      ref: "Match",
    },
    joined_at: { type: Date },
    left_at: { type: Date },
    urls: { type: [String] },
  },
  { timestamps: true }
);

NationalMatchSeriesSchema.index(
  { country: 1, age_group: 1, joined_at: 1 },
  {
    unique: true,
    partialFilterExpression: {
      joined_at: { $type: "date" },
    },
  }
);

async function syncCallUps(doc: INationalMatchSeries) {
  if (!doc) return;

  const NationalCallUpModel = mongoose.model("NationalCallUp");
  const callUps = await NationalCallUpModel.find({ series: doc._id });

  const bulkOps = callUps
    .map((cu) => {
      const update: Record<string, any> = {};

      if (!cu.joined_at && doc.joined_at) {
        update.joined_at = doc.joined_at;
      }
      if (!cu.left_at && doc.left_at) {
        update.left_at = doc.left_at;
      }

      return Object.keys(update).length
        ? {
            updateOne: {
              filter: { _id: cu._id },
              update: { $set: update },
            },
          }
        : null;
    })
    .filter((op): op is NonNullable<typeof op> => op !== null);

  if (bulkOps.length > 0) {
    await NationalCallUpModel.bulkWrite(bulkOps);
    console.log(`📌 ${bulkOps.length} 件の CallUp を series に同期しました`);
  }
}

// findOneAndUpdate後
NationalMatchSeriesSchema.post(
  "findOneAndUpdate",
  async function (doc: INationalMatchSeries) {
    if (!doc) return;
    const rawUpdate = this.getUpdate();
    if (!rawUpdate) return;

    // update.$set を吸収
    const update = {
      ...(rawUpdate as any),
      ...(rawUpdate as any).$set,
    } as Partial<INationalMatchSeries>;

    if (update?.joined_at || update?.left_at) {
      await syncCallUps(doc);
    }
  }
);
// save後
NationalMatchSeriesSchema.post(
  "save",
  async function (doc: INationalMatchSeries) {
    const modifiedPaths = this.modifiedPaths();
    if (
      modifiedPaths.includes("joined_at") ||
      modifiedPaths.includes("left_at")
    ) {
      await syncCallUps(doc);
    }
  }
);

export const NationalMatchSeriesModel: Model<INationalMatchSeries> =
  mongoose.model<INationalMatchSeries>(
    "NationalMatchSeries",
    NationalMatchSeriesSchema
  );
