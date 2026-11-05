import { Link } from "react-router-dom";
import { PositionedCalendarRangeItem } from "../../../../../types/calendar";

type RangeItemProps = {
  item: PositionedCalendarRangeItem;
  totalDays: number;
};

export const RangeItem = ({ item, totalDays }: RangeItemProps) => {
  const left = (item.startOffset / totalDays) * 100;

  const width = ((item.endOffset - item.startOffset + 1) / totalDays) * 100;

  const content = (
    <div className="flex h-8 min-w-0 items-center">
      <div className="h-1 flex-1 rounded-l bg-green-500" />

      <div className="min-w-0 truncate rounded bg-green-100 px-2 py-1 text-xs text-green-900">
        {item.value.label}
      </div>

      <div className="h-0 w-0 shrink-0 border-y-4 border-l-8 border-y-transparent border-l-green-500" />
    </div>
  );

  const GAP = 2; // px。境界線との余白

  return (
    <div
      className="absolute z-10"
      style={{
        left: `calc(${left}% + ${GAP}px)`,
        width: `calc(${width}% - ${GAP * 2}px)`,
        top: `${item.row * 40 + 4}px`,
      }}
      title={item.value.label}
    >
      {item.value.to ? (
        <Link to={item.value.to} className="block cursor-pointer">
          {content}
        </Link>
      ) : (
        <div aria-label={item.value.label}>{content}</div>
      )}
    </div>
  );
};
