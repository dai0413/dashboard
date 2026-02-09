import {
  generateNormalizedEnName,
  PlayerFormSchema,
} from "@dai0413/myorg-shared";
import { z } from "zod";
import { PlayerModel } from "../../../../models/player.js";

type Player = z.infer<typeof PlayerFormSchema>;

export const filter = async (
  data: Partial<Player>[],
): Promise<Partial<Player>[]> => {
  const results: Partial<Player>[] = [];

  for (const p of data) {
    const query: any = {};

    if (p.name) query.name = p.name;
    if (p.dob) query.dob = p.dob;
    if (p.pob) query.pob = p.pob;
    if (p.en_name) {
      query.normalized_en_name = generateNormalizedEnName(p.en_name);
    }

    const exists = await PlayerModel.findOne(query).lean();

    if (!exists) {
      results.push(p);
    }
  }

  return results;
};
