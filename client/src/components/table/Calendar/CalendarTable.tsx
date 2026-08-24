import { DayCell } from "./DayCell";
import { Header } from "./Header";
import { CalendarDataItem } from "./types";
import { createCalendarDays } from "./utils/index";

type CalendarTableProps = {
  data: CalendarDataItem[];
  year: number;
  month: number;
  onToday: () => void;
  onPreviousMonth: () => void;
  onNextMonth: () => void;
};

export const CalendarTable = ({
  data,
  year,
  month,
  onToday,
  onPreviousMonth,
  onNextMonth,
}: CalendarTableProps) => {
  const days = createCalendarDays(data, year, month);

  return (
    <div className="max-h-[80vh] max-w-full overflow-auto rounded-md border border-gray-300">
      <Header
        year={year}
        month={month}
        onToday={onToday}
        onPreviousMonth={onPreviousMonth}
        onNextMonth={onNextMonth}
      />

      <div className="grid min-w-[900px] grid-cols-7">
        {["月", "火", "水", "木", "金", "土", "日"].map((day) => (
          <div
            key={day}
            className="border-b border-r border-gray-300 p-2 text-center text-sm font-medium"
          >
            {day}
          </div>
        ))}

        {days.map((day) => (
          <DayCell key={day.date.toISOString()} {...day} />
        ))}
      </div>
    </div>
  );
};
