import { FilterableFieldDefinition } from "@dai0413/myorg-shared";
import { OptionArray } from "../../types/form/option";
import { InputField, SelectField } from "../field";

type FilterFieldsProps = {
  type: FilterableFieldDefinition["type"];
  value: string | number | Date | boolean | undefined;
  onChange: (value: string | number | Date | boolean | undefined) => void;
  onChangeObj?: (value: Record<string, any> | undefined) => void;
  options: OptionArray;
  color: boolean;
};

const FilterFields = ({
  type,
  value,
  onChange,
  onChangeObj,
  options,
  color,
}: FilterFieldsProps) => {
  switch (type) {
    case "string":
      return (
        <InputField
          type="text"
          value={value as string}
          onChange={onChange}
          color={color}
        />
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
