import { OnChange } from "../../../../../types/form/onChange";
import { PlayerRegistrationForm } from "../../../../../types/models/player-registration";
import { currentTransfer } from "../../../utils/onChange/currentTransfer";

export const updateTeam: OnChange<PlayerRegistrationForm> = async (
  formData,
  formLabel,
  api?,
) => {
  if (!formData.player || !api) return { formData, formLabel };

  const { to_team } = await currentTransfer({ formData: formData, api });

  let returnValue: Partial<PlayerRegistrationForm> = {};
  let returnFormLabel: Record<string, any> = {};

  if (to_team) {
    returnValue["team"] = to_team.key;
    returnFormLabel["team"] = to_team.label;
  }

  return { formData: returnValue, formLabel: returnFormLabel };
};
