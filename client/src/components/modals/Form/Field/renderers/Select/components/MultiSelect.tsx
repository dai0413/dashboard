import { SelectField } from "../../../../../../field";
import { ArrayFieldWrapper } from "../../../wrappers/ArrayFieldWrapper";
import { MultiSelectProps } from "../types";

export const MultiSelect = ({
  values,
  options,
  uniqueInArray,
  onChangeItem,
}: Omit<MultiSelectProps, "multi">) => {
  const selected = values.filter((v) => v !== "");

  const getOptions = (index: number) => {
    const used = new Set(selected.slice(0, index));
    return options.filter((o) => !used.has(o.key));
  };

  return (
    <ArrayFieldWrapper
      items={values}
      renderItem={(value, index) => (
        <div key={index} className="flex items-center space-x-2 mb-2">
          <SelectField
            type="option"
            value={value}
            onChange={(value) => onChangeItem(index, value)}
            options={uniqueInArray ? getOptions(index) : options}
            defaultOption="--- 未選択 ---"
            displayClearButton
          />
        </div>
      )}
    />
  );
};
