import { OnChange } from "../../../../../types/form/onChange";
import { FormTypeMap, ModelType } from "../../../../../types/models";
import { currentTransfer } from "../../../utils/onChange/currentTransfer";

export const updateTeam: OnChange<
  FormTypeMap[ModelType.PLAYER_REGISTRATION]
> = async (data, api) => {
  if (!data.player || !api) return [];

  const { to_team } = await currentTransfer({ formData: data, api });

  return to_team ? [{ key: "team", value: to_team }] : [];
};
