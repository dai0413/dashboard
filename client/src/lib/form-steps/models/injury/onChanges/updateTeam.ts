import { AxiosInstance } from "axios";
import { FormUpdatePair } from "../../../../../types/form";
import { FormTypeMap, ModelType } from "../../../../../types/models";
import { currentTransfer } from "../../../utils/onChange/currentTransfer";

export const updateTeam = async (
  formData: FormTypeMap[ModelType.INJURY],
  api: AxiosInstance,
) => {
  const { to_team, to_team_name } = await currentTransfer({
    formData,
    api,
  });

  let obj: FormUpdatePair = [];
  if (to_team_name) {
    obj.push({
      key: "team_name",
      value: to_team_name,
    });
  } else if (to_team) {
    obj.push({
      key: "team",
      value: to_team,
    });
  }

  return obj;
};
