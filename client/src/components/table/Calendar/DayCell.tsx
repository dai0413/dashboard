import { toDateKey } from "@dai0413/myorg-shared/normalizer";
import { useModal } from "../../../context/modal-context";
import { EventGroup } from "./EventGroup";
import { CalendarDataItem } from "./types";
import { eventGroups } from "./context/eventGroups";
import { convertToDetailData } from "./utils";

const today = new Date();

export const DayCell = ({ date, isCurrentMonth, data }: CalendarDataItem) => {
  const {
    calendarData: { open },
  } = useModal();

  const isToday =
    date.getFullYear() === today.getFullYear() &&
    date.getMonth() === today.getMonth() &&
    date.getDate() === today.getDate();

  return (
    <div
      onClick={() => {
        open({
          title: toDateKey(date) || "",
          data: convertToDetailData(data),
        });
      }}
      className={[
        "min-h-32 cursor-pointer border-b border-r border-gray-300 p-2 transition-colors",
        !isCurrentMonth && "bg-gray-50 text-gray-400",
        isToday && "bg-blue-50",
        "hover:bg-gray-100",
      ]
        .filter(Boolean)
        .join(" ")}
    >
      <div className="mb-2 flex items-center justify-between">
        <div
          className={[
            "text-sm font-medium",
            isToday &&
              "flex h-6 w-6 items-center justify-center rounded-full bg-blue-500 text-white",
          ]
            .filter(Boolean)
            .join(" ")}
        >
          {date.getDate()}
        </div>
      </div>

      {eventGroups.map((group) => (
        <EventGroup
          key={group.key}
          date={date}
          label={group.label}
          items={data[group.key] ?? []}
          countLabel={group.countLabel}
        />
      ))}
    </div>
  );
};
