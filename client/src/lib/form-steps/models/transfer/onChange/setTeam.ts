import { AxiosInstance } from "axios";
import { currentTransfer } from "../../../utils/onChange/currentTransfer";
import { FormUpdatePair } from "../../../../../types/form";
import { TransferForm } from "../../../../../types/models/transfer";

export async function setTeam(
  formData: Partial<TransferForm>,
  api: AxiosInstance
): Promise<FormUpdatePair> {
  const { from_team, from_team_name, to_team, to_team_name, position } =
    await currentTransfer({
      formData,
      api,
      form: "!満了",
    });

  let obj: FormUpdatePair = [];
  if (to_team_name) {
    obj.push({
      key: "from_team_name",
      value: to_team_name,
    });
  } else if (to_team) {
    obj.push({
      key: "from_team",
      value: to_team,
    });
  }

  if (position) {
    obj.push({
      key: "position",
      value: position,
    });
  }

  if (
    formData.form === "期限付き満了" ||
    formData.form === "育成型期限付き満了" ||
    formData.form === "期限付き解除" ||
    formData.form === "育成型期限付き解除" ||
    formData.form === "復帰"
  ) {
    if (from_team_name) {
      obj.push({
        key: "to_team_name",
        value: from_team_name,
      });
    } else if (from_team) {
      obj.push({
        key: "to_team",
        value: from_team,
      });
    }
  }

  return obj;
}
