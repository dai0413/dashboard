import { NationalMatchSeriesZodSchema } from "@dai0413/myorg-shared";
import mongoose, { Schema, Document, Model, Types } from "mongoose";
import z from "zod";

type NationalMatchSeriesType = z.infer<typeof NationalMatchSeriesZodSchema>;

export interface INationalMatchSeries
  extends Omit<NationalMatchSeriesType, "_id" | "matches" | "team">, Document {
  _id: Types.ObjectId;
  team: Types.ObjectId;
  matches: Types.ObjectId[];
}

const NationalMatchSeriesSchema: Schema<INationalMatchSeries> = new Schema<
  INationalMatchSeries,
  any,
  INationalMatchSeries
>(
  {
    name: { type: String, required: true },
    abbr: { type: String },
    team: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Team",
      required: true,
    },
    matches: {
      type: [mongoose.Schema.Types.ObjectId],
      ref: "Match",
    },
    joined_at: { type: Date },
    left_at: { type: Date },
    urls: { type: [String] },
  },
  { timestamps: true },
);

NationalMatchSeriesSchema.index(
  { team: 1, joined_at: 1 },
  {
    unique: true,
    partialFilterExpression: {
      joined_at: { $type: "date" },
    },
  },
);

async function syncCallUps(doc: Partial<INationalMatchSeries>) {
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

NationalMatchSeriesSchema.post(
  ["findOneAndUpdate", "updateOne"],
  async function () {
    const rawUpdate = this.getUpdate();
    if (!rawUpdate) return;

    const update = {
      ...(rawUpdate as any),
      ...(rawUpdate as any).$set,
    } as Partial<INationalMatchSeries>;

    if (!update.joined_at && !update.left_at) return;

    // 🔑 最新の series を取得
    const doc = await this.model.findOne(this.getQuery());
    if (!doc) return;

    await syncCallUps(doc);
  },
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
  },
);

export const NationalMatchSeriesModel: Model<INationalMatchSeries> =
  mongoose.model<INationalMatchSeries>(
    "NationalMatchSeries",
    NationalMatchSeriesSchema,
  );
