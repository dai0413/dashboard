import { DayCell } from "./DayCell";
import { Header } from "./Header";
import { CalendarDataItem } from "./types";
import { createCalendarDays } from "./utils/index";

type CalendarTableProps = {
  data: CalendarDataItem[];
  currentDate: Date;
  setCurrentDate: React.Dispatch<React.SetStateAction<Date>>;
};

export const CalendarTable = ({
  data,
  currentDate,
  setCurrentDate,
}: CalendarTableProps) => {
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth() + 1;

  const days = createCalendarDays(data, year, month);

  const onPreviousMonth = () => {
    setCurrentDate((current) => {
      return new Date(current.getFullYear(), current.getMonth() - 1, 1);
    });
  };

  const onNextMonth = () => {
    setCurrentDate((current: Date) => {
      return new Date(current.getFullYear(), current.getMonth() + 1, 1);
    });
  };

  const onToday = () => {
    const today = new Date();

    setCurrentDate(new Date(today.getFullYear(), today.getMonth(), 1));
  };

  return (
    <>
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
    </>
  );
};
