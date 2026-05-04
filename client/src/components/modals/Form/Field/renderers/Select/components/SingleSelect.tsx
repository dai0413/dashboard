import { SelectField } from "../../../../../../field";
import { SingleSelectProps } from "../types";

export const SingleSelect = ({
  value,
  onChangeObj,
  options,
}: SingleSelectProps) => {
  return (
    <SelectField
      type="option"
      value={value || ""}
      onChangeObj={(v) => onChangeObj(v?.key)}
      options={options}
      defaultOption="--- 未選択 ---"
      displayClearButton
    />
  );
};
