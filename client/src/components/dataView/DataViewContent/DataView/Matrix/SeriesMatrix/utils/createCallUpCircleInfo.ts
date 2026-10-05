import { MatchGet } from "../../../../../../../types/models/match";
import { NationalCallup } from "../../../../../../../types/models/national-callup";
import { PlayerAppearanceGet } from "../../../../../../../types/models/player-appearance";
import { CircleInfo } from "../../type";
import { getTitle } from "../../utils";

type CreateCallUpCircleInfoParams = {
  match: MatchGet;
  appearance?: PlayerAppearanceGet;
  nationalCallup?: NationalCallup;
};

export const createCallUpCircleInfo = ({
  match,
  appearance,
  nationalCallup,
}: CreateCallUpCircleInfoParams): CircleInfo => {
  let calledUp = false;

  if (match.date && nationalCallup?.joined_at && nationalCallup.left_at) {
    const matchDate = new Date(match.date).getTime();
    const DAY = 24 * 60 * 60 * 1000;

    const joinedAtDate = new Date(nationalCallup.joined_at).getTime() - DAY;

    const leftAtDate = new Date(nationalCallup.left_at).getTime() + DAY * 2;

    const joined = matchDate >= joinedAtDate;
    const left = matchDate <= leftAtDate;

    calledUp = joined && left;

    calledUp = joined && left;
  }

  let title = getTitle({ appearance, calledUp });
  let withdrawn: boolean = false;
  let declined: boolean = false;

  if (nationalCallup?.is_backup) {
    title = getTitle({ calledUp: true, title: "バックアップ" });
  }

  if (nationalCallup?.is_training_partner) {
    title = getTitle({ calledUp: true, title: "トレーニングパートナー" });
  }

  if (match.date && nationalCallup?.left_at) {
    const leftAt = new Date(nationalCallup.left_at);
    leftAt.setDate(leftAt.getDate() + 2);

    if (new Date(match.date).getTime() > leftAt.getTime()) {
      if (nationalCallup?.status === "withdrawn") {
        title = `${nationalCallup.left_reason} 離脱`;
        withdrawn = true;
      }
    }
  }

  if (nationalCallup?.status === "declined" && !appearance) {
    title = `${nationalCallup.left_reason} 辞退`;
    declined = true;
  }

  return {
    is_backup: nationalCallup?.is_backup,
    is_training_partner: nationalCallup?.is_training_partner,
    match,
    toolTipTitle: `${title}`,
    calledUp,
    withdrawn,
    declined,
    injured:
      nationalCallup?.left_reason === "injury" && (withdrawn || declined),
    playerAppearance: appearance,
  };
};
