import { useEffect, useState } from "react";

type InputFieldProps = {
  type: "text" | "number" | "date" | "datetime-local" | "boolean" | "option";
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
  const [internalValue, setInternalValue] = useState<string | number | boolean>(
    () => {
      if (type === "boolean") return Boolean(value);

      if (type === "date" || type === "datetime-local") {
        if (typeof value === "string") return value;
        if (value instanceof Date && !isNaN(value.getTime())) {
          return type === "datetime-local"
            ? value.toISOString().slice(0, 16)
            : value.toISOString().split("T")[0];
        }
        return "";
      }

      return value as string | number | boolean;
    }
  );

  useEffect(() => {
    // 親から値が変わったときは同期
    if (type === "date" || type === "datetime-local") {
      if (value instanceof Date && !isNaN(value.getTime())) {
        setInternalValue(
          type === "datetime-local"
            ? value.toISOString().slice(0, 16)
            : value.toISOString().split("T")[0]
        );
      } else if (typeof value === "string") {
        setInternalValue(value);
      }
    } else {
      setInternalValue(value as any);
    }
  }, [value, type]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVal = e.target.value;
    setInternalValue(newVal);

    if (type === "boolean") {
      onChange(e.target.checked);
    } else if (type === "number") {
      onChange(Number(newVal));
    } else if (type === "date" || type === "datetime-local") {
      // 入力が完全に yyyy-MM-dd or yyyy-MM-ddTHH:mm 形式になったときのみDate化
      const isComplete =
        type === "date"
          ? /^\d{4}-\d{2}-\d{2}$/.test(newVal)
          : /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}$/.test(newVal);

      onChange(isComplete ? new Date(newVal) : newVal);
    } else {
      onChange(newVal);
    }
  };

  return (
    <input
      type={type === "boolean" ? "checkbox" : type}
      className="w-full border border-gray-300 rounded px-3 py-2"
      {...(type === "boolean"
        ? { checked: Boolean(internalValue) }
        : { value: internalValue as string | number })}
      placeholder={placeholder}
      onChange={handleChange}
    />
  );
};

export default InputField;
