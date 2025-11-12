import { useEffect, useState } from "react";
import { CalendarDays, CalendarClock, CalendarRange } from "lucide-react";
import { useForm } from "../../context/form-context";

type InputFieldProps = {
  type: "text" | "number" | "date" | "datetime-local" | "boolean" | "option";
  value: string | number | Date | boolean;
  onChange: (value: string | number | Date | boolean) => void;
  placeholder?: string;
};

// 日付だけのinput用: その日のローカル0時に固定
const localDate = (year: number, month: number, day: number) => {
  // 月は0始まりなので month - 1
  const d = new Date(year, month - 1, day);
  d.setHours(0, 0, 0, 0);
  return d;
};

// === シーズン境界計算関数 ===
const getSeasonDates = () => {
  const now = new Date();
  const year = now.getFullYear();
  const month = now.getMonth() + 1;

  let seasonStart: Date;
  let seasonEnd: Date;
  let nextSeasonStart: Date;

  if (month >= 2) {
    seasonStart = localDate(year, 2, 1);
    seasonEnd = localDate(year + 1, 1, 31);
    nextSeasonStart = localDate(year + 1, 2, 1);
  } else {
    seasonStart = localDate(year - 1, 2, 1);
    seasonEnd = localDate(year, 1, 31);
    nextSeasonStart = localDate(year, 2, 1);
  }

  return { seasonStart, seasonEnd, nextSeasonStart };
};

const formatLocalDate = (date: Date) => {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
};

const InputField = ({
  type,
  value,
  onChange,
  placeholder,
}: InputFieldProps) => {
  const { mode } = useForm();
  const [internalValue, setInternalValue] = useState<string | number | boolean>(
    () => {
      if (type === "boolean") return Boolean(value);

      if (type === "date" || type === "datetime-local") {
        if (typeof value === "string") return value;
        if (value instanceof Date && !isNaN(value.getTime())) {
          return type === "datetime-local"
            ? value.toISOString().slice(0, 16)
            : formatLocalDate(value); // ✅ ローカル変換
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
            : formatLocalDate(value)
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
    } else if (type === "date") {
      // ✅ 入力値をローカルタイムのDateに変換
      const [y, m, d] = newVal.split("-").map(Number);
      if (y && m && d) onChange(new Date(y, m - 1, d, 0, 0, 0, 0));
      else onChange(newVal);
    } else if (type === "datetime-local") {
      onChange(new Date(newVal));
    } else {
      onChange(newVal);
    }
  };

  const { seasonStart, seasonEnd, nextSeasonStart } = getSeasonDates();

  const inputButton =
    mode === "single" && (type === "date" || type === "datetime-local");

  return (
    <div className={`flex items-center gap-x-4 ${inputButton ? "" : "w-full"}`}>
      <input
        type={type === "boolean" ? "checkbox" : type}
        className="w-full border border-gray-300 rounded px-3 py-2"
        {...(type === "boolean"
          ? { checked: Boolean(internalValue) }
          : { value: internalValue as string | number })}
        placeholder={placeholder}
        onChange={handleChange}
      />
      {inputButton && (
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => onChange(new Date())}
            className="flex items-center gap-1 bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm hover:bg-green-200 transition"
          >
            <CalendarDays size={16} />
            今日
          </button>
          <button
            type="button"
            onClick={() => onChange(seasonStart)}
            className="flex items-center gap-1 bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm hover:bg-green-200 transition"
          >
            <CalendarClock size={16} />
            今季開始
          </button>
          <button
            type="button"
            onClick={() => onChange(seasonEnd)}
            className="flex items-center gap-1 bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm hover:bg-green-200 transition"
          >
            <CalendarRange size={16} />
            今季終了
          </button>
          <button
            type="button"
            onClick={() => onChange(nextSeasonStart)}
            className="flex items-center gap-1 bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm hover:bg-green-200 transition"
          >
            <CalendarRange size={16} />
            来季開始
          </button>
        </div>
      )}
    </div>
  );
};

export default InputField;
