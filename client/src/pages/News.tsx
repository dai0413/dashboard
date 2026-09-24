import { useCallback, useEffect, useState } from "react";
import { DataViewContainer } from "../components/dataView";
import { fetchCalendarData } from "../components/dataView/DataViewContent/DataView/Calendar/data/fetchCalendarData";
import { Data, ViewMode } from "../types/types";
import { CalendarSourceData } from "../types/table/calendar";
import { convertToCalendarData } from "../components/dataView/DataViewContent/DataView/Calendar/data/convertToCalendarData";

const News = () => {
  const [currentDate, setCurrentDate] = useState<Date>(new Date());
  const [items, setItems] = useState<Data<CalendarSourceData>>({
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

    const datas = await fetchCalendarData(currentDate);

    setItems({
      data: datas,
      totalCount: datas.length,
      page: 1,
      isLoading: false,
    });
  }, [currentDate]);

  useEffect(() => {
    reloadFun();
  }, [currentDate]);

  return (
    <div className="p-6">
      <DataViewContainer
        key={items.data.length}
        totalCount={items.data.length}
        itemsLoading={items.isLoading}
        reloadFun={reloadFun}
        viewModes={[ViewMode.CALENDAR]}
        defaultViewMode={ViewMode.CALENDAR}
        viewData={{
          [ViewMode.CALENDAR]: {
            data: convertToCalendarData(items.data),
            currentDate,
            setCurrentDate,
          },
        }}
      />
    </div>
  );
};

export default News;
