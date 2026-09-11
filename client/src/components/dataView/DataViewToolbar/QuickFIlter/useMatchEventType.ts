import { API_PATHS, FilterableFieldDefinition } from "@dai0413/myorg-shared";
import { useEffect, useState } from "react";
import { QuickFilterItem } from "../../../../types/table";
import { useDataView } from "../../../../context/dataView-context";
import { readItemsBase } from "../../../../lib/api";
import { api } from "../../../../context/api-context";
import { convert } from "../../../../lib/convert/DBtoGetted";
import { ModelType } from "../../../../types/models";
import { ViewMode } from "../../../../types/types";
import { convert as createLabel } from "../../../../lib/convert/CreateLabel";
import { MatchEventType } from "../../../../types/models/match-event-type";

export const useMatchEventType = (): {
  items: QuickFilterItem[];
  loading: boolean;
} => {
  const { setViewMode, setItemsPerPage } = useDataView();
  const [items, setItems] = useState<QuickFilterItem[]>([]);
  const [loading, setLoading] = useState(true);

  const read = async (): Promise<FilterableFieldDefinition[] | undefined> => {
    const obj = await readItemsBase<MatchEventType[]>({
      apiInstance: api,
      params: { getAll: true },
      backendRoute: API_PATHS.MATCH_EVENT_TYPE.ROOT,
    });

    if (!obj) return;
    const matchEventTypes = convert(ModelType.MATCH_EVENT_TYPE, obj.data);

    const filterCondition: FilterableFieldDefinition[] = [
      {
        key: "_id",
        label: "イベントタイプ",
        operator: "equals",
        type: "select",
        value: matchEventTypes.map((t) => t._id),
        valueLabel: matchEventTypes.map((t) =>
          createLabel(ModelType.MATCH_EVENT_TYPE, t),
        ),
      },
    ];

    return filterCondition;
  };

  useEffect(() => {
    const init = async () => {
      const items: QuickFilterItem[] = [
        {
          key: "all",
          label: "すべて",
          onClick: async () => {
            setItemsPerPage(10);
            setViewMode(ViewMode.TILE);
          },
          filterCondition: await read(),
          defaultSelect: true,
        },
      ];

      setItems(items);
      setLoading(false);
    };

    init();
  }, []);

  return { items, loading };
};
