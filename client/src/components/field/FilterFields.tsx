import { OptionArray } from "../../context/options-provider";
import { InputField, SelectField } from "../field";

type FilterFieldsProps = {
  type: "string" | "number" | "Date" | "select";
  value: string | number | Date;
  onChange: (value: string | number | Date) => void;
  options: OptionArray;
};

const FilterFields = ({
  type,
  value,
  onChange,
  options,
}: FilterFieldsProps) => {
  switch (type) {
    case "string":
      return (
        <InputField type="text" value={value as string} onChange={onChange} />
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
          onChange={onChange}
          options={options}
        />
      );
    default:
      return null;
  }
};

export default FilterFields;
