import { useEffect, useState } from "react";
import { CalendarDays, CalendarClock, CalendarRange, X } from "lucide-react";
import { getSeasonDates } from "../../utils/getSeasonDates";

type InputFieldProps = {
  type: "text" | "number" | "date" | "datetime-local" | "boolean" | "option";
  value: string | number | Date | boolean;
  onChange: (value: string | number | Date | boolean | undefined) => void;
  placeholder?: string;
  supportButton?: boolean;
};

type InternalValue = string | number | boolean | "";

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
  supportButton,
}: InputFieldProps) => {
  const [internalValue, setInternalValue] = useState<InternalValue>(() => {
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

    return (value ?? "") as InternalValue;
  });

  useEffect(() => {
    if (type === "boolean") {
      setInternalValue(Boolean(value));
      return;
    }

    if (type === "date" || type === "datetime-local") {
      if (value instanceof Date && !isNaN(value.getTime())) {
        setInternalValue(
          type === "datetime-local"
            ? value.toISOString().slice(0, 16)
            : formatLocalDate(value),
        );
      } else if (typeof value === "string") {
        setInternalValue(value);
      } else {
        setInternalValue("");
      }
      return;
    }

    setInternalValue((value ?? "") as InternalValue);
  }, [value, type]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (type === "boolean") {
      const checked = e.target.checked;
      setInternalValue(checked);
      onChange(checked);
      return;
    }

    const newVal = e.target.value;
    setInternalValue(newVal);

    // 🔑 空入力 = undefined
    if (newVal === "") {
      onChange(undefined);
      return;
    }

    if (type === "number") {
      onChange(Number(newVal));
    } else if (type === "date") {
      const [y, m, d] = newVal.split("-").map(Number);
      if (y && m && d) {
        onChange(new Date(y, m - 1, d, 0, 0, 0, 0));
      } else {
        onChange(undefined);
      }
    } else if (type === "datetime-local") {
      onChange(new Date(newVal));
    } else {
      onChange(newVal);
    }
  };

  const handleClear = () => {
    setInternalValue(type === "boolean" ? false : "");
    onChange(undefined);
  };

  const { seasonStart, seasonEnd, nextSeasonStart } = getSeasonDates();

  const displaySupportButton =
    supportButton && (type === "date" || type === "datetime-local");

  return (
    <div
      className={`flex flex-col gap-2 ${displaySupportButton ? "" : "w-full"}`}
    >
      <div className="flex items-center gap-x-2">
        <input
          type={type === "boolean" ? "checkbox" : type}
          className="w-full border border-gray-300 rounded px-3 py-2"
          {...(type === "boolean"
            ? { checked: Boolean(internalValue) }
            : { value: internalValue as string | number })}
          placeholder={placeholder}
          onChange={handleChange}
        />
        {/* クリアボタン */}
        <button
          type="button"
          onClick={handleClear}
          className="text-gray-400 hover:text-gray-600 px-2"
          title="Clear"
        >
          <X size={16} />
        </button>
      </div>
      {displaySupportButton && (
        <div className="flex flex-wrap gap-2 text-xs text-gray-600">
          <button
            type="button"
            onClick={() => {
              const now = new Date();
              onChange(
                new Date(
                  now.getFullYear(),
                  now.getMonth(),
                  now.getDate(),
                  0,
                  0,
                  0,
                  0,
                ),
              );
            }}
            className="flex items-center gap-1 bg-green-100 px-3 py-1 rounded-full text-sm hover:bg-green-200 transition"
            title="Today"
          >
            <CalendarDays size={16} />
            今日
          </button>
          <button
            type="button"
            onClick={() => onChange(seasonStart)}
            className="flex items-center gap-1 bg-green-100 px-3 py-1 rounded-full text-sm hover:bg-green-200 transition"
            title="StartNowSeason"
          >
            <CalendarClock size={16} />
            今季開始
          </button>
          <button
            type="button"
            onClick={() => onChange(seasonEnd)}
            className="flex items-center gap-1 bg-green-100 px-3 py-1 rounded-full text-sm hover:bg-green-200 transition"
            title="EndNowSeason"
          >
            <CalendarRange size={16} />
            今季終了
          </button>
          <button
            type="button"
            onClick={() => onChange(nextSeasonStart)}
            className="flex items-center gap-1 bg-green-100 px-3 py-1 rounded-full text-sm hover:bg-green-200 transition"
            title="NextNowSeason"
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
