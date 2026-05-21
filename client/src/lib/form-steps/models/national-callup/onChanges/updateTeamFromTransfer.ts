import { currentTransfer } from "../../../utils/onChange/currentTransfer";
import { NationalCallupForm } from "../../../../../types/models/national-callup";
import { OnChange } from "../../../../../types/form/onChange";

export const updateTeamFromTransfer: OnChange<
  NationalCallupForm,
  false
> = async ({ formData, formLabel, api }) => {
  if (!api) return { formData, formLabel };
  const { to_team, to_team_name } = await currentTransfer({
    formData,
    api,
    form: "!満了",
    from_date: formData.joined_at || undefined,
  });

  let returnValue: Partial<NationalCallupForm> = {};
  let returnFormLabel: Record<string, any> = {};

  if (to_team_name) {
    returnValue["team_name"] = to_team_name;
    returnFormLabel["team_name"] = to_team_name;
  } else if (to_team) {
    returnValue["team"] = to_team.key;
    returnFormLabel["team"] = to_team.label;
  }

  return { formData: returnValue, formLabel: returnFormLabel };
};
