import { generateNormalizedEnName } from "@dai0413/myorg-shared";
import { Form, Scraped } from "@dai0413/myorg-shared/types/d_pc/player";
import { PlayerModel } from "../../../../models/player.js";

export const filter = async (
  data: Partial<Form>[],
): Promise<Partial<Scraped>[]> => {
  const results: Partial<Scraped>[] = [];

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
