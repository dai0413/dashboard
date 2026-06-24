import { AxiosInstance } from "axios";
import { DraftData, PostedDraftData } from "../../../../../types/form";
import { TeamMatchFormationForm } from "../../../../../types/models/team-match-formation";
import { getFormation } from "./getFormation";
import { key } from "@dai0413/myorg-shared/generateField";

type Data = {
  value: TeamMatchFormationForm[];
  label: Record<string, any>[];
};

export const dataToFormData = async (
  api: AxiosInstance,
  draftData: DraftData,
  postedDraftData: PostedDraftData,
  identifiers: string[],
): Promise<Data> => {
  let value: TeamMatchFormationForm[] = [];
  let label: Record<string, any>[] = [];

  await Promise.all(
    identifiers.map(async (identify) => {
      if (
        !draftData[identify].playerAppearance ||
        !postedDraftData[identify].match
      ) {
        return;
      }

      const { home, away } = draftData[identify].playerAppearance;

      const {
        _id: matchId,
        home_team,
        away_team,
      } = postedDraftData[identify].match;
      const { matchLabel } = postedDraftData[identify];

      const homePositions: string[] = home
        .filter((d) => d.play_status === "start")
        .map((d) => d.position)
        .filter((d) => typeof d === "string");
      const awayPositions: string[] = away
        .filter((d) => d.play_status === "start")
        .map((d) => d.position)
        .filter((d) => typeof d === "string");

      const homeFormation = await getFormation(api, key(homePositions));
      const awayFormation = await getFormation(api, key(awayPositions));

      if (homeFormation?.id) {
        value.push({
          match: matchId,
          team: home_team.id,
          formation: homeFormation?.id,
        });
        label.push({
          match: matchLabel,
          team: home_team.label,
          formation: homeFormation?.label,
        });
      }

      if (awayFormation?.id) {
        value.push({
          match: matchId,
          team: away_team.id,
          formation: awayFormation?.id,
        });
        label.push({
          match: matchLabel,
          team: away_team.label,
          formation: awayFormation?.label,
        });
      }
    }),
  );

  return { value, label };
};
