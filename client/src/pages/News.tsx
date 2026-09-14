import { useCallback, useEffect, useState } from "react";
import { DataViewContainer } from "../components/dataView";
import { CalendarTable } from "../components/dataView/DataViewContent/DataView/Calendar/CalendarTable";
import { CalendarDataItem } from "../components/dataView/DataViewContent/DataView/Calendar/types";
import { fetchCalendarData } from "../components/dataView/DataViewContent/DataView/Calendar/data/fetchCalendarData";
import { Data, ViewMode } from "../types/types";

const News = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [items, setItems] = useState<Data<CalendarDataItem>>({
    data: [],
    page: 1,
    totalCount: 0,
    isLoading: false,
  });

  const reloadFun = useCallback(async () => {
    setItems((prev) => ({
      ...prev,
      isLoading: true,
    }));

    const data = await fetchCalendarData(currentDate);

    setItems({
      data: data,
      totalCount: data.length,
      page: 1,
      isLoading: false,
    });
  }, [currentDate]);

  useEffect(() => {
    reloadFun();
  }, [currentDate]);

  const handlePreviousMonth = () => {
    setCurrentDate((current) => {
      return new Date(current.getFullYear(), current.getMonth() - 1, 1);
    });
  };

  const handleNextMonth = () => {
    setCurrentDate((current) => {
      return new Date(current.getFullYear(), current.getMonth() + 1, 1);
    });
  };

  const handleToday = () => {
    const today = new Date();

    setCurrentDate(new Date(today.getFullYear(), today.getMonth(), 1));
  };

  return (
    <div className="p-6">
      <DataViewContainer
        key={items.data.length}
        fieldDefinitions={[]}
        totalCount={items.data.length}
        noToolBar={false}
        items={[{ id: "test", label: "test" }]}
        itemsLoading={items.isLoading}
        reloadFun={reloadFun}
        renderView={() => (
          <CalendarTable
            data={items.data}
            year={currentDate.getFullYear()}
            month={currentDate.getMonth() + 1}
            onToday={handleToday}
            onPreviousMonth={handlePreviousMonth}
            onNextMonth={handleNextMonth}
          />
        )}
        viewModes={[ViewMode.CALENDAR]}
        defaultViewMode={ViewMode.CALENDAR}
      />
    </div>
  );
};

export default News;
