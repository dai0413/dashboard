import { FilterableFieldDefinition } from ""@dai0413/myorg-shared";
import { OptionArray } from "../../types/option";
import { InputField, SelectField } from "../field";

type FilterFieldsProps = {
  type: FilterableFieldDefinition["type"];
  value: string | number | Date | boolean;
  onChange: (value: string | number | Date | boolean) => void;
  onChangeObj?: (value: Record<string, any>) => void;
  options: OptionArray;
};

const FilterFields = ({
  type,
  value,
  onChange,
  onChangeObj,
  options,
}: FilterFieldsProps) => {
  switch (type) {
    case "string":
      return (
        <InputField type="text" value={value as string} onChange={onChange} />
      );
    case "checkbox":
      return (
        <InputField
          type="boolean"
          value={value as string}
          onChange={onChange}
        />
      );
    case "number":
      return (
        <InputField type="number" value={value as number} onChange={onChange} />
      );
    case "Date":
      return (
        <InputField type="date" value={value as string} onChange={onChange} />
      );
    case "select":
      return (
        <SelectField
          type={"text"}
          value={value as string}
          onChangeObj={onChangeObj}
          options={options}
        />
      );
    default:
      return null;
  }
};

export default FilterFields;
