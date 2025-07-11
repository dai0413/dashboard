type InputFieldProps = {
  type: "text" | "number" | "date";
  value: string | number | Date;
  onChange: (value: string | number | Date) => void;
  placeholder?: string;
};

const InputField = ({
  type,
  value,
  onChange,
  placeholder,
}: InputFieldProps) => {
  const formattedValue =
    type === "date" && value instanceof Date
      ? value.toISOString().slice(0, 10)
      : value;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value;
    const parsed =
      type === "number" ? Number(raw) : type === "date" ? new Date(raw) : raw;
    onChange(parsed);
  };

  return (
    <input
      type={type}
      className="w-full border border-gray-300 rounded px-3 py-2"
      value={formattedValue as string | number}
      placeholder={placeholder}
      onChange={handleChange}
    />
  );
};

export default InputField;
