import { Form, Scraped } from "@dai0413/myorg-shared/types/j_m/match";
import { TeamModel } from "../../../../models/team.js";
import { MatchFormatModel } from "../../../../models/match-format.js";
import { StadiumModel } from "../../../../models/stadium.js";
import { resolve } from "./resolve.js";
import { ResolveField } from "../types.js";

const resolveFields: ResolveField<Scraped>[] = [
  {
    key: "home_team",
    model: TeamModel,
  },
  {
    key: "away_team",
    model: TeamModel,
  },
  {
    key: "match_format",
    model: MatchFormatModel,
  },
  {
    key: "stadium",
    model: StadiumModel,
    delete: "stadium_name",
  },
];

const removeFields: string[] = ["competition_stage"];

export const resolveMatch = async (data: Scraped) => {
  const resolved = await resolve<Scraped, Form>(
    [data],
    resolveFields,
    removeFields,
  );
  return resolved[0];
};
