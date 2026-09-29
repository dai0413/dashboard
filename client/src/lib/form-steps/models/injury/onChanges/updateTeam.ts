import { currentTransfer } from "../../../utils/onChange/currentTransfer";
import { OnChange } from "../../../../../types/form/onChange";
import { InjuryForm } from "../../../../../types/models/injury";

export const updateTeam: OnChange<InjuryForm, false> = async ({
  formData,
  formLabel,
  metaData,
  api,
}) => {
  if (!api) return { formData, formLabel, metaData };
  const { to_team } = await currentTransfer({
    formData,
    api,
  });

  let returnValue: Partial<InjuryForm> = {};
  let returnFormLabel: Record<string, any> = {};

  if (to_team) {
    returnValue["team"] = to_team.key;
    returnFormLabel["team"] = to_team.label;
  }

  return {
    formData: returnValue,
    formLabel: returnFormLabel,
    metaData,
  };
};
