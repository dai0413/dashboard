import { AddPostedDraftData, PostedDraftData } from "../../../../types/form";
import { ModelType } from "../../../../types/models";
import { convert } from "../../../convert/DBtoGetted";
import { Match } from "../../../../types/models/match";
import { convert as createLabel } from "../../../convert/CreateLabel";

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

  const matchOriginal: Match[] = res.data;

  const posted: PostedDraftData = Object.fromEntries(
    matchOriginal.map((match, i) => {
      const matchData = convert(ModelType.MATCH, match);
      const label = createLabel(ModelType.MATCH, match);

      const periods = match.match_format?.period;
      const identifier = identifiers[i];

      return [
        identifier,
        {
          ...postedDraftData[identifier],
          matchLabel: label,
          match: { ...matchData },
          periods,
        },
      ];
    }),
  );

  return posted;
};
