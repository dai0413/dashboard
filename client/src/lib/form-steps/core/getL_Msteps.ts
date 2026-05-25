import { FormStep } from "../../../types/form";
import { ModelType } from "../../../types/models";
import { teamMatchFormation } from "../models/team-match-formation/forms/l_m";
import { statsL } from "../models/stats-l/forms/l_m";
import { pre } from "../l_m/pre";

type Steps = {
  [ModelType.STATS_L]: FormStep<ModelType.STATS_L>[];
  [ModelType.TEAM_MATCH_FORMATION]: FormStep<ModelType.TEAM_MATCH_FORMATION>[];
};

const steps: Steps = {
  [ModelType.STATS_L]: statsL,
  [ModelType.TEAM_MATCH_FORMATION]: teamMatchFormation,
};

export const l_mStep: {
  label: string;
  steps: FormStep<any>[];
} = {
  label: "l_mStep",
  steps: [
    ...pre,
    ...steps[ModelType.STATS_L],
    ...steps[ModelType.TEAM_MATCH_FORMATION],
  ],
};
