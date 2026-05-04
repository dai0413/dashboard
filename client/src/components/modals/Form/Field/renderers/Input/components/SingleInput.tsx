import { InputField } from "../../../../../../field";
import { SingleInputProps } from "../types";

export const SingleInput = ({
  type,
  value,
  onChange,
  supportButton,
}: SingleInputProps) => {
  return (
    <InputField
      type={type}
      value={value}
      onChange={onChange}
      placeholder=""
      supportButton={supportButton}
    />
  );
};
