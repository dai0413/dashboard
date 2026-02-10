import { staff } from "@dai0413/myorg-shared";
import { normalizeRows, ParserKey } from "@dai0413/myorg-shared/normalizer";
import { StaffModel } from "../../../../models/staff.js";
import { PlayerModel } from "../../../..//models/player.js";
import { CountryModel } from "../../../..//models/country.js";
import { UploadConfig } from "../types.js";
import { resolveOldIds } from "../services/resolveOldIds.js";

const { TYPE } = staff(StaffModel);

type INPUT_CSV_TYPE = Omit<typeof TYPE, "_id" | "createdAt" | "updatedAt"> & {
  citizenship_name?: string;
  player_old_id?: string;
};

export const staffConfig: UploadConfig = {
  createValidRows: async (rows: any[]) => {
    let csvRows: INPUT_CSV_TYPE[] = rows;

    const converted = await Promise.all(
      csvRows.map(async (c) => {
        if (!c.citizenship_name) {
          return { ...c, citizenship: undefined };
        }

        // ① "日本, ブラジル" → ["日本", "ブラジル"]
        const names = c.citizenship_name
          .split(",")
          .map((v) => v.trim())
          .filter(Boolean);

        // ② name で Country を取得
        const countries = await CountryModel.find({
          name: { $in: names },
        })
          .select("_id")
          .lean<{ _id: any }[]>();

        return {
          ...c,
          citizenship: countries.map((c) => String(c._id)),
        };
      }),
    );

    const reslovedOldIds = await resolveOldIds(converted, [
      {
        key: "player",
        oldKey: "player_old_id",
        model: PlayerModel,
      },
    ]);

    const normalized = normalizeRows(reslovedOldIds, [
      { field: ["player", "citizenship"], parserKey: ParserKey.ObjectId },
    ]);

    return normalized;
  },
};
