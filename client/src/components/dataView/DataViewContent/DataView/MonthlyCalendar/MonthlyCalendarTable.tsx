import { Header } from "./Header";
import { useMemo } from "react";
import {
  MonthleyCalendarHeaderItem,
  MonthlyCalendarGroup,
} from "../../../../../types/calendar";
import { RangeItem } from "./RangeItem";
import { getPositionedCalendarRangeItems } from "./utils/getPositionedCalendarRangeItems";
import { getDateKey } from "./utils/getDateKey";

type MonthlyCalendarTableProps = {
  groups?: MonthlyCalendarGroup[];
  headerItems: MonthleyCalendarHeaderItem[];
  selectedKey: string;
  headerOnChange: (key: string) => void;
};

export const MonthlyCalendarTable = ({
  groups = [],
  headerItems = [],
  selectedKey,
  headerOnChange,
}: MonthlyCalendarTableProps) => {
  const positionedGroups = useMemo(
    () =>
      groups.map((group) => {
        const startDate = new Date(group.year, 0, 1);
        const endDate = new Date(group.year, 11, 31);

        const positionedItems = getPositionedCalendarRangeItems(
          group.data,
          startDate,
          endDate,
        );

        const rowCount =
          positionedItems.length > 0
            ? Math.max(...positionedItems.map((item) => item.row)) + 1
            : 0;

        const totalDays =
          (getDateKey(endDate) - getDateKey(startDate)) / 86400000 + 1;

        return {
          ...group,
          positionedItems,
          rowCount,
          totalDays,
        };
      }),
    [groups],
  );

  const monthColumns = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];

  const gridTemplateColumns = monthColumns
    .map((days) => `minmax(0, ${days}fr)`)
    .join(" ");

  const months = Array.from({ length: 12 }, (_, index) => ({
    month: index + 1,
    label: `${index + 1}月`,
  }));

  return (
    <>
      <Header
        items={headerItems}
        selectedKey={selectedKey}
        onChange={headerOnChange}
      />

      <div className="min-w-[900px]">
        <div className="border border-gray-300">
          <div className="flex border-b border-gray-300">
            {/* グループラベル用の空白 */}
            <div className="w-24 shrink-0 border-r border-gray-300" />

            {/* 月ヘッダー */}
            <div className="grid flex-1" style={{ gridTemplateColumns }}>
              {months.map((month, index) => (
                <div
                  key={month.month}
                  className={`bg-white p-2 text-center text-sm ${
                    index > 0 ? "border-l border-gray-300" : ""
                  }`}
                >
                  {month.label}
                </div>
              ))}
            </div>
          </div>

          {positionedGroups.map((group, groupIndex) => (
            <div
              key={`${group.label}-${groupIndex}`}
              className="flex border-b border-gray-300"
            >
              {/* グループ名 */}
              <div className="w-24 shrink-0 border-r border-gray-300 px-2 py-3 text-sm font-medium">
                {group.label}
              </div>

              {/* 年間カレンダー */}
              <div
                className="relative grid flex-1"
                style={{
                  gridTemplateColumns,
                  height: `${Math.max(group.rowCount, 1) * 40}px`,
                }}
              >
                {/* 月の境界線 */}
                {months.map((month, index) => (
                  <div
                    key={month.month}
                    className={`pointer-events-none ${
                      index > 0 ? "border-l border-gray-300" : ""
                    }`}
                  />
                ))}

                {/* 期間データ */}
                <div className="absolute inset-0">
                  {group.positionedItems.map((item, index) => (
                    <RangeItem
                      key={`${item.value.label}-${index}`}
                      item={item}
                      totalDays={group.totalDays}
                    />
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};
