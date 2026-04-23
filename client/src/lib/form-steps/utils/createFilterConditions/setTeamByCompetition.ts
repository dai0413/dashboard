import { ModelType } from "../../../../types/models";
import { readItemBase, readItemsBase } from "../../../api";
import { API_PATHS } from "@dai0413/myorg-shared";
import {
  CreateFilterConditions,
  FilterConditionsByKey,
} from "../../../../types/form";
import { TeamCompetitionSeason } from "../../../../types/models/team-competition-season";
import { convert } from "../../../convert/DBtoGetted";
import { convert as convertToLabel } from "../../../convert/CreateLabel";

export const setTeamByCompetition: CreateFilterConditions<
  ModelType.MATCH
> = async (args) => {
  const { data, api } = args;
  if (!data || !data.competition_stage || !api) return null;

  const readCompetitionStage = async () => {
    const resBody = await readItemBase({
      apiInstance: api,
      backendRoute: API_PATHS.COMPETITION_STAGE.DETAIL(data.competition_stage),
      returnResponse: true,
    });

    if (!resBody) return null;

    if (resBody.data) {
      const competitionStage = convert(
        ModelType.COMPETITION_STAGE,
        resBody.data,
      );

      return competitionStage;
    }
  };

  const competitionStage = await readCompetitionStage();

  if (
    !competitionStage ||
    !competitionStage.season.id ||
    !competitionStage.competition.id
  )
    return null;

  const resBody = await readItemsBase({
    apiInstance: api,
    backendRoute: API_PATHS.TEAM_COMPETITION_SEASON.ROOT,
    params: {
      getAll: true,
      season: competitionStage.season.id,
      competition: competitionStage.competition.id,
    },
    returnResponse: true,
  });

  if (!resBody || !resBody.data) return null;

  const teamCompetitionSeasons: TeamCompetitionSeason[] = resBody.data;
  const values = teamCompetitionSeasons.map((teamCompetitionSeason) => {
    return teamCompetitionSeason.team._id;
  });
  const labels = teamCompetitionSeasons.map((teamCompetitionSeason) => {
    return convertToLabel(ModelType.TEAM, teamCompetitionSeason.team);
  });

  let returnObj: FilterConditionsByKey = {
    team: [
      {
        key: "_id",
        label: "チーム",
        type: "string",
        filterKey: "team",
        filterable: true,
        value: values,
        valueLabel: labels,
        operator: "equals",
      },
    ],
  };

  return returnObj;
};
