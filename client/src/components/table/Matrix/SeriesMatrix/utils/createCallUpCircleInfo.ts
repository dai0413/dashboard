import { MatchGet } from "../../../../../types/models/match";
import { NationalCallup } from "../../../../../types/models/national-callup";
import { PlayerAppearanceGet } from "../../../../../types/models/player-appearance";
import { CircleInfo } from "../../type";
import { getTitle } from "../../utils/index";

type CreateCallUpCircleInfoParams = {
  match: MatchGet;
  appearance: PlayerAppearanceGet | undefined;
  nationalCallup?: NationalCallup;
};

export const createCallUpCircleInfo = ({
  match,
  appearance,
  nationalCallup,
}: CreateCallUpCircleInfoParams): CircleInfo => {
  let calledUp = false;

  if (match.date) {
    const matchDate = new Date(match.date).getTime();

    const joined =
      !nationalCallup?.joined_at ||
      matchDate >= new Date(nationalCallup?.joined_at).getTime();

    const left =
      !nationalCallup?.left_at ||
      matchDate <= new Date(nationalCallup?.left_at).getTime();

    calledUp = joined && left;
  }

  const title = nationalCallup?.is_backup
    ? getTitle(undefined, false, true, "バックアップ")
    : nationalCallup?.is_training_partner
      ? getTitle(undefined, false, true, "トレーニングパートナー")
      : getTitle(appearance, false, true);

  return {
    is_backup: nationalCallup?.is_backup,
    is_training_partner: nationalCallup?.is_training_partner,
    match,
    toolTipTitle: title,
    calledUp,
    playerAppearance: appearance,
  };
};
