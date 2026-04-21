import { FormUpdatePair } from "../../../../types/form";
import { FormTypeMap, ModelType } from "../../../../types/models";

export const updateTimeName = async (
  data: Partial<FormTypeMap[ModelType.PLAYER_MATCH_EVENT_LOG]>,
): Promise<FormUpdatePair> => {
  if (data.time == null) return [];

  const time_name = data.add_time
    ? `${data.time}+${data.add_time}`
    : `${data.time}`;

  return [{ key: "time_name", value: time_name }];
};
