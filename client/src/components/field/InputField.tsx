import { toDateKey } from "../../utils";

type InputFieldProps = {
  type: "text" | "number" | "date" | "boolean" | "option";
  value: string | number | Date | boolean;
  onChange: (value: string | number | Date | boolean) => void;
  placeholder?: string;
};

const InputField = ({
  type,
  value,
  onChange,
  placeholder,
}: InputFieldProps) => {
  function formatDateValue(value: unknown): string {
    if (typeof value === "string") return value.slice(0, 10);
    if (value instanceof Date && !isNaN(value.getTime())) {
      return toDateKey(value);
    }
    return "";
  }

  const formattedValue = type === "date" ? formatDateValue(value) : value;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (type === "boolean") {
      onChange(e.target.checked);
    } else if (type === "number") {
      onChange(Number(e.target.value));
    } else if (type === "date") {
      onChange(new Date(e.target.value));
    } else {
      onChange(e.target.value);
    }
  };

  return (
    <input
      type={type === "boolean" ? "checkbox" : type}
      className="w-full border border-gray-300 rounded px-3 py-2"
      {...(type === "boolean"
        ? { checked: Boolean(value) }
        : { value: formattedValue as string | number })}
      placeholder={placeholder}
      onChange={handleChange}
    />
  );
};

export default InputField;
