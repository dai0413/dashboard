import { toDateKey } from "@dai0413/myorg-shared/normalizer";
import { OptionArray } from "../../types/option";
import { X } from "lucide-react";

type SelectFieldProps = {
  type: "text" | "number" | "date" | "boolean" | "option";
  value: string | number | Date;
  options: OptionArray;
  onChange?: (value: string | number | Date | undefined) => void;
  onChangeObj?: (value: Record<string, any> | undefined) => void;
  defaultOption?: string;
  displayClearButton?: boolean;
};

const SelectField = ({
  type,
  value,
  options,
  onChange,
  onChangeObj,
  defaultOption,
  displayClearButton,
}: SelectFieldProps) => {
  const formattedValue =
    type === "date" && value instanceof Date ? toDateKey(value) : String(value);

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const raw = e.target.value;
    const parsed =
      type === "number" ? Number(raw) : type === "date" ? new Date(raw) : raw;

    onChange && onChange(parsed);

    const targetObj = options.find((op) => op.key === raw);
    if (onChangeObj && targetObj) {
      onChangeObj(targetObj);
    }
  };

  const handleClear = () => {
    onChange && onChange(undefined);
    onChangeObj && onChangeObj(undefined);
  };

  return (
    <div className="flex items-center gap-x-2">
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

      {/* クリアボタン */}
      {displayClearButton && (
        <button
          type="button"
          onClick={handleClear}
          className="text-gray-400 hover:text-gray-600 px-2"
          title="Clear"
        >
          <X size={16} />
        </button>
      )}
    </div>
  );
};

export default SelectField;
