import { API_PATHS } from "@dai0413/myorg-shared";
import { OnChange } from "../../../../../types/form/onChange";
import { ModelType } from "../../../../../types/models";
import { readItemBase } from "../../../../api";
import { convert } from "../../../../convert/DBtoGetted";
import { PlayerRegistrationForm } from "../../../../../types/models/player-registration";

export const updateName: OnChange<PlayerRegistrationForm> = async (
  formData,
  formLabel,
  api,
) => {
  const playerId = formData.player;

  if (!playerId || !api) return { formData, formLabel };

  const res = await readItemBase({
    apiInstance: api,
    backendRoute: API_PATHS.PLAYER.DETAIL(playerId),
    returnResponse: true,
  });

  if (!res?.data) return { formData, formLabel };

  const { name, en_name } = convert(ModelType.PLAYER, res.data);

  let returnValue: Partial<PlayerRegistrationForm> = {};
  let returnFormLabel: Record<string, any> = {};

  if (name) {
    returnValue["name"] = name;
    returnFormLabel["name"] = name;
  }
  if (en_name) {
    returnValue["en_name"] = en_name;
    returnFormLabel["en_name"] = en_name;
  }

  return { formData: returnValue, formLabel: returnFormLabel };
};
