type CalendarHeaderProps = {
  year: number;
  month: number;
  onToday: () => void;
  onPreviousMonth: () => void;
  onNextMonth: () => void;
};

export const Header = ({
  year,
  month,
  onToday,
  onPreviousMonth,
  onNextMonth,
}: CalendarHeaderProps) => {
  const today = new Date();

  const isCurrentMonth =
    year === today.getFullYear() && month === today.getMonth() + 1;

  return (
    <div className="flex min-w-[900px] items-center justify-between border-b border-gray-300 px-4 py-3">
      <div className="w-16">
        {!isCurrentMonth && (
          <button
            type="button"
            onClick={onToday}
            className="whitespace-nowrap rounded-md border border-gray-300 px-4 py-1.5 text-sm hover:bg-gray-100"
          >
            今日
          </button>
        )}
      </div>

      <div className="flex items-center gap-4">
        <button
          type="button"
          onClick={onPreviousMonth}
          className="rounded-md px-2 py-1 text-xl hover:bg-gray-100"
        >
          ‹
        </button>

        <div className="min-w-32 text-center text-lg font-semibold">
          {year}年{month}月
        </div>

        <button
          type="button"
          onClick={onNextMonth}
          className="rounded-md px-2 py-1 text-xl hover:bg-gray-100"
        >
          ›
        </button>
      </div>

      <div className="w-12" />
    </div>
  );
};
