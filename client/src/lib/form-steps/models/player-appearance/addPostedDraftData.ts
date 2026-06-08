import { AddPostedDraftData, PostedDraftData } from "../../../../types/form";
import { ModelType } from "../../../../types/models";
import { convert } from "../../../convert/DBtoGetted";
import { PlayerAppearance } from "../../../../types/models/player-appearance";

type AfterMatchAddPostedDraftData = Pick<
  Parameters<AddPostedDraftData>[0],
  "postedDraftData" | "res"
> & {
  identifiers: string[];
};

export const addPostedDraftData = ({
  postedDraftData,
  res,
  identifiers,
}: AfterMatchAddPostedDraftData): PostedDraftData => {
  if (!res.success) return {};

  const playerAppearance: PlayerAppearance[] = res.data;

  const posted: PostedDraftData = Object.fromEntries(
    identifiers.map((identifier) => {
      if (!postedDraftData[identifier].match) return [];

      const {
        _id: matchId,
        home_team,
        away_team,
      } = postedDraftData[identifier].match;

      const home = convert(
        ModelType.PLAYER_APPEARANCE,
        playerAppearance.filter(
          (d) => d.match._id === matchId && d.team._id === home_team.id,
        ),
      );
      const away = convert(
        ModelType.PLAYER_APPEARANCE,
        playerAppearance.filter(
          (d) => d.match._id === matchId && d.team._id === away_team.id,
        ),
      );

      return [
        identifier,
        {
          ...postedDraftData[identifier],
          playerAppearance: { home, away },
        },
      ];
    }),
  );

  return posted;
};
