import { AxiosInstance } from "axios";
import { currentTransfer } from "../../../utils/onChange/currentTransfer";
import { FormUpdatePair } from "../../../../../types/form";
import { NationalCallupForm } from "../../../../../types/models/national-callup";

export async function setTeam(
  formData: Partial<NationalCallupForm>,
  api: AxiosInstance,
  from_date?: string
): Promise<FormUpdatePair> {
  const { to_team, to_team_name } = await currentTransfer({
    formData,
    api,
    form: "!満了",
    from_date,
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
