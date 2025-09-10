import { Competition, CompetitionGet } from "../../../types/models/competition";
import { ageGroup } from "../../../utils/createOption/Enum/ageGroup";
import { category } from "../../../utils/createOption/Enum/category";
import { competitionType } from "../../../utils/createOption/Enum/competition_type";
import { level } from "../../../utils/createOption/Enum/level";

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
      label: t.country?.name ?? "不明",
      id: t.country?._id ?? "",
    },
    competition_type: CompetitionType ? CompetitionType : "",
    category: Category ? Category : "",
    level: Level ? Level : "",
    age_group: age_group ? age_group : "",
  };
};
