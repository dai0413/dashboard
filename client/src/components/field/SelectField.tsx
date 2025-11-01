import { OptionArray } from "../../types/option";
import { toDateKey } from "../../utils";

type SelectFieldProps = {
  type: "text" | "number" | "date" | "boolean" | "option";
  value: string | number | Date;
  options: OptionArray;
  onChange?: (value: string | number | Date) => void;
  onChangeObj?: (value: Record<string, any>) => void;
  defaultOption?: string;
};

const SelectField = ({
  type,
  value,
  options,
  onChange,
  onChangeObj,
  defaultOption,
}: SelectFieldProps) => {
  const formattedValue =
    type === "date" && value instanceof Date ? toDateKey(value) : String(value);

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const raw = e.target.value;
    const parsed =
      type === "number" ? Number(raw) : type === "date" ? new Date(raw) : raw;

    onChange && onChange(parsed);

    const targetObj = options.find((op) => op.key === raw);
    onChangeObj && targetObj && onChangeObj(targetObj);
  };

  return (
    <select
      value={formattedValue}
      onChange={handleChange}
      className="w-full border border-gray-300 rounded px-3 py-2"
    >
      {defaultOption && <option value="">{defaultOption}</option>}
      {options.map((opt) => (
        <option key={opt.key} value={opt.key}>
          {opt.label}
        </option>
      ))}
    </select>
  );
};

export default SelectField;
