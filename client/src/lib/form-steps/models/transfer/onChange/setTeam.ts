import { currentTransfer } from "../../../utils/onChange/currentTransfer";
import { TransferForm } from "../../../../../types/models/transfer";
import { OnChange } from "../../../../../types/form/onChange";

export const setTeam: OnChange<TransferForm, false> = async ({
  formData,
  formLabel,
  api,
}) => {
  if (!api) return { formData, formLabel };
  const { from_team, from_team_name, to_team, to_team_name, position } =
    await currentTransfer({
      formData,
      api,
      form: "!満了",
    });

  let returnValue: Partial<TransferForm> = {};
  let returnFormLabel: Record<string, any> = {};

  if (formData.form === "更新") {
    if (to_team_name) {
      returnValue["to_team_name"] = to_team_name;
      returnFormLabel["to_team_name"] = to_team_name;
    } else if (to_team) {
      returnValue["to_team"] = to_team.key;
      returnFormLabel["to_team"] = to_team.label;
    }

    returnValue["from_team"] = undefined;
    returnValue["from_team_name"] = undefined;
    returnFormLabel["from_team"] = undefined;
    returnFormLabel["from_team_name"] = undefined;
  } else if (
    formData.form === "期限付き延長" ||
    formData.form === "育成型期限付き延長"
  ) {
    if (to_team_name) {
      returnValue["to_team_name"] = to_team_name;
      returnFormLabel["to_team_name"] = to_team_name;
    } else if (to_team) {
      returnValue["to_team"] = to_team.key;
      returnFormLabel["to_team"] = to_team.label;
    }

    if (from_team_name) {
      returnValue["from_team_name"] = from_team_name;
      returnFormLabel["from_team_name"] = from_team_name;
    } else if (from_team) {
      returnValue["from_team"] = from_team.key;
      returnFormLabel["from_team"] = from_team.label;
    }
  } else {
    if (to_team_name) {
      returnValue["from_team_name"] = to_team_name;
      returnFormLabel["from_team_name"] = to_team_name;
    } else if (to_team) {
      returnValue["from_team"] = to_team.key;
      returnFormLabel["from_team"] = to_team.label;
    }
  }

  if (
    formData.form === "期限付き満了" ||
    formData.form === "育成型期限付き満了" ||
    formData.form === "期限付き解除" ||
    formData.form === "育成型期限付き解除" ||
    formData.form === "復帰"
  ) {
    if (from_team_name) {
      returnValue["to_team_name"] = from_team_name;
      returnFormLabel["to_team_name"] = from_team_name;
    } else if (from_team) {
      returnValue["to_team"] = from_team.key;
      returnFormLabel["to_team"] = from_team.label;
    }
  }

  if (position) {
    returnValue["position"] = position;
    returnFormLabel["position"] = position;
  }

  return { formData: returnValue, formLabel: returnFormLabel };
};
