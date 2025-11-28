import { ageGroup, category, competitionType, level } from "@myorg/shared";
import { Competition, CompetitionGet } from "../../../types/models/competition";

import { country } from "../CreateLabel/country";

export const competition = (t: Competition): CompetitionGet => {
  const CompetitionType = competitionType().find(
    (item) => item.key === t.competition_type
  )?.label;
  const Category = category().find((item) => item.key === t.category)?.label;
  const Level = level().find((item) => item.key === t.level)?.label;
  const age_group = ageGroup().find((item) => item.key === t.age_group)?.label;

  return {
    ...t,
    country: {
      label: t.country ? country(t.country) : "不明",
      id: t.country?._id ?? undefined,
    },
    competition_type: CompetitionType ? CompetitionType : "",
    category: Category ? Category : undefined,
    level: Level ? Level : undefined,
    age_group: age_group ? age_group : undefined,
  };
};
