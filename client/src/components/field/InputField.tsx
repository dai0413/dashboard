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
  const formattedValue =
    type === "date"
      ? typeof value === "string"
        ? value.slice(0, 10)
        : value instanceof Date
        ? value.toISOString().slice(0, 10)
        : ""
      : value;

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
