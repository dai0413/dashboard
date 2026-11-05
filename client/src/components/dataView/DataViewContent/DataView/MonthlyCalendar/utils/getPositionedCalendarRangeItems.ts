import {
  CalendarRangeItem,
  PositionedCalendarRangeItem,
} from "../../../../../../types/calendar";
import { getDateKey } from "./getDateKey";

export const getPositionedCalendarRangeItems = (
  items: CalendarRangeItem[],
  calendarStartDate: Date,
  calendarEndDate: Date,
): PositionedCalendarRangeItem[] => {
  const calendarStart = getDateKey(calendarStartDate);
  const calendarEnd = getDateKey(calendarEndDate);
  const dayMs = 24 * 60 * 60 * 1000;

  if (calendarStart > calendarEnd) return [];

  const totalDays = (calendarEnd - calendarStart) / dayMs + 1;

  // ラベル表示に必要な最低幅（px）
  const MIN_LABEL_WIDTH = 20;
  const CALENDAR_WIDTH = 900;

  const normalizedItems = items
    .flatMap((item, index) => {
      if (!item.start_date) return [];

      const start = getDateKey(item.start_date);
      const end = item.end_date ? getDateKey(item.end_date) : calendarEnd;

      if (start > calendarEnd || end < calendarStart || start > end) {
        return [];
      }

      const startOffset = Math.max(0, (start - calendarStart) / dayMs);

      const endOffset = Math.min(totalDays - 1, (end - calendarStart) / dayMs);

      const width = ((endOffset - startOffset + 1) / totalDays) * 100;

      return [
        {
          item,
          index,
          startOffset,
          endOffset,
          showLabel: width >= (MIN_LABEL_WIDTH / CALENDAR_WIDTH) * 100,
        },
      ];
    })
    .sort(
      (a, b) =>
        a.startOffset - b.startOffset ||
        a.endOffset - b.endOffset ||
        a.index - b.index,
    );

  const rowEndOffsets: number[] = [];

  return normalizedItems.map(({ item, startOffset, endOffset, showLabel }) => {
    let row = rowEndOffsets.findIndex(
      (rowEndOffset) => rowEndOffset < startOffset,
    );

    if (row === -1) {
      row = rowEndOffsets.length;
    }

    rowEndOffsets[row] = endOffset;

    return {
      ...item,
      row,
      startOffset,
      endOffset,
      showLabel,
    };
  });
};
