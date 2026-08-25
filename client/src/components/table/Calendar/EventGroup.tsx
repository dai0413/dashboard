import { CalendarEvent } from "./types";

type CalendarEventGroupProps = {
  date: Date;
  label: string;
  items: CalendarEvent[];
  countLabel: string;
};

export const EventGroup = ({
  date,
  label,
  items,
  countLabel,
}: CalendarEventGroupProps) => {
  if (items.length === 0) {
    return null;
  }

  return (
    <div className="mb-2">
      <div className="text-xs font-semibold">{label}</div>

      <div className="space-y-0.5">
        {items.map((item, i) => (
          <div
            key={`${date.getTime()}-${label}-${item.groupByData?.id || "no-id"}-${i}`}
            className="flex justify-between gap-2 text-xs"
          >
            <span className="truncate">{item.groupByData?.label}</span>

            <span className="shrink-0">
              {item.counts}
              {countLabel}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};
