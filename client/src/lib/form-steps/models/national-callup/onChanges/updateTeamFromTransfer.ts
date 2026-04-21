import { AxiosInstance } from "axios";
import { currentTransfer } from "../../../utils/onChange/currentTransfer";
import { FormUpdatePair } from "../../../../../types/form";
import { NationalCallupForm } from "../../../../../types/models/national-callup";

export async function updateTeamFromTransfer(
  formData: Partial<NationalCallupForm>,
  api?: AxiosInstance,
): Promise<FormUpdatePair> {
  if (!api) return [];
  const { to_team, to_team_name } = await currentTransfer({
    formData,
    api,
    form: "!満了",
    from_date: formData.joined_at || undefined,
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
}
