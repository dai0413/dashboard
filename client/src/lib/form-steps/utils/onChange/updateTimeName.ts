import { OnChange } from "../../../../types/form/onChange";
import { PlayerMatchEventLogForm } from "../../../../types/models/player-match-event-log";

export const updateTimeName: OnChange<PlayerMatchEventLogForm> = async (
  formData,
  formLabel,
) => {
  if (formData.time == null) return { formData, formLabel };

  let returnValue: Partial<PlayerMatchEventLogForm> = {};
  let returnFormLabel: Record<string, any> = {};

  const time_name = formData.add_time
    ? `${formData.time}+${formData.add_time}`
    : `${formData.time}`;

  returnValue["time_name"] = time_name;
  returnFormLabel["time_name"] = time_name;

  return { formData: returnValue, formLabel: returnFormLabel };
};
