import { readItemsBase } from "../../../lib/api";
import { useApi } from "../../../context/api-context";
import { convert } from "../../../lib/convert/DBtoGetted";
import { convert as createLabel } from "../../../lib/convert/CreateLabel";

import { API_PATHS, FilterableFieldDefinition } from "@dai0413/myorg-shared";
import { ModelType } from "../../../types/models";
import { useEffect, useState } from "react";
import { useListView } from "../../../context/listView-context";
import { QuickFilterItem } from "../../../types/table";

export const useMatchFormat = (): {
  items: QuickFilterItem[];
  loading: boolean;
} => {
  const api = useApi();
  const { setViewMode, setItemsPerPage } = useListView();
  const [items, setItems] = useState<QuickFilterItem[]>([]);
  const [loading, setLoading] = useState(true);

  const read = async (): Promise<FilterableFieldDefinition | undefined> => {
    const resBody = await readItemsBase({
      apiInstance: api,
      params: { getAll: true },
      backendRoute: API_PATHS.MATCH_FORMAT.ROOT,
      returnResponse: true,
    });

    if (!resBody) return;
    const matchFormats = convert(ModelType.MATCH_FORMAT, resBody.data);

    const filterCondition: FilterableFieldDefinition = {
      key: "_id",
      label: "試合形式",
      operator: "equals",
      type: "select",
      value: matchFormats.map((t) => t._id),
      valueLabel: matchFormats.map((t) =>
        createLabel(ModelType.MATCH_FORMAT, t),
      ),
    };

    return filterCondition;
  };

  useEffect(() => {
    const init = async () => {
      const items: QuickFilterItem[] = [
        {
          key: "all",
          label: "すべて",
          onClick: async () => {
            setItemsPerPage(20);
            setViewMode("tile");
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
