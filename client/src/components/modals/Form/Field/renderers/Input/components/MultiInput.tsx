import { InputField } from "../../../../../../field";
import { ArrayFieldWrapper } from "../../../wrappers/ArrayFieldWrapper";
import { MultiInputProps } from "../types";

export const MultiInput = ({
  type,
  values,
  supportButton,
  onChangeItem,
}: Omit<MultiInputProps, "multi">) => {
  return (
    <ArrayFieldWrapper
      items={values}
      renderItem={(value, index) => (
        <div className="flex items-center space-x-2 mb-2">
          <InputField
            type={type}
            value={value}
            onChange={(value) => onChangeItem(index, value)}
            placeholder=""
            supportButton={supportButton}
          />
        </div>
      )}
    />
  );
};
