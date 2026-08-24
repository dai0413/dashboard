import { useModal } from "../../../context/modal-context";
import { ModelType } from "../../../types/models";
import { EventGroup } from "./EventGroup";
import { CalendarDay } from "./types";

const eventGroups = [
  {
    key: ModelType.TRANSFER,
    label: "移籍",
    countLabel: "件",
  },
  {
    key: ModelType.INJURY,
    label: "怪我",
    countLabel: "件",
  },
  {
    key: ModelType.NATIONAL_MATCH_SERIES,
    label: "代表シリーズ",
    countLabel: "開始",
  },
  {
    key: ModelType.MATCH,
    label: "試合",
    countLabel: "試合",
  },
  {
    key: ModelType.PLAYER_REGISTRATION,
    label: "選手登録",
    countLabel: "件",
  },
  {
    key: ModelType.STAFF_REGISTRATION,
    label: "スタッフ登録",
    countLabel: "件",
  },
] satisfies {
  key: ModelType;
  label: string;
  countLabel: string;
}[];

export const DayCell = ({ date, isCurrentMonth, data }: CalendarDay) => {
  const today = new Date();
  const {
    detail: { open },
  } = useModal();

  const isToday =
    date.getFullYear() === today.getFullYear() &&
    date.getMonth() === today.getMonth() &&
    date.getDate() === today.getDate();

  return (
    <div
      className={[
        "min-h-32 border-b border-r border-gray-300 p-2",
        !isCurrentMonth && "bg-gray-50 text-gray-400",
        isToday && "bg-blue-50",
      ]
        .filter(Boolean)
        .join(" ")}
    >
      <div className="mb-2 flex items-center justify-between">
        <div
          onClick={() => {
            console.log("clicked");
          }}
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
