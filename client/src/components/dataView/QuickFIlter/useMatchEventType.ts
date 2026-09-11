import { readItemsBase } from "../../../lib/api";
import { api } from "../../../context/api-context";
import { convert } from "../../../lib/convert/DBtoGetted";
import { convert as createLabel } from "../../../lib/convert/CreateLabel";

import { API_PATHS, FilterableFieldDefinition } from "@dai0413/myorg-shared";
import { ModelType } from "../../../types/models";
import { useEffect, useState } from "react";
import { useListView } from "../../../context/listView-context";
import { QuickFilterItem } from "../../../types/table";
import { MatchEventType } from "../../../types/models/match-event-type";
import { ViewMode } from "../../../types/types";

export const useMatchEventType = (): {
  items: QuickFilterItem[];
  loading: boolean;
} => {
  const { setViewMode, setItemsPerPage } = useListView();
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
