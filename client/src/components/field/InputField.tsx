type InputFieldProps = {
  type: "text" | "number" | "date" | "checkbox";
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
      return value.toISOString().slice(0, 10);
    }
    return "";
  }

  const formattedValue = type === "date" ? formatDateValue(value) : value;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (type === "checkbox") {
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
      type={type}
      className="w-full border border-gray-300 rounded px-3 py-2"
      {...(type === "checkbox"
        ? { checked: Boolean(value) }
        : { value: formattedValue as string | number })}
      placeholder={placeholder}
      onChange={handleChange}
    />
  );
};

export default InputField;
