import { readItemsBase } from "../../../lib/api";
import { api } from "../../../context/api-context";
import { convert } from "../../../lib/convert/DBtoGetted";
import { convert as createLabel } from "../../../lib/convert/CreateLabel";

import { API_PATHS, FilterableFieldDefinition } from "@dai0413/myorg-shared";
import { ModelType } from "../../../types/models";
import { useEffect, useState } from "react";
import { useListView } from "../../../context/listView-context";
import { QuickFilterItem } from "../../../types/table";
import { Formation } from "../../../types/models/formation";

export const useFormation = (): {
  items: QuickFilterItem[];
  loading: boolean;
} => {
  const { setViewMode, setItemsPerPage } = useListView();
  const [items, setItems] = useState<QuickFilterItem[]>([]);
  const [loading, setLoading] = useState(true);

  const read = async (): Promise<FilterableFieldDefinition | undefined> => {
    const obj = await readItemsBase<Formation[]>({
      apiInstance: api,
      params: { getAll: true },
      backendRoute: API_PATHS.FORMATION.ROOT,
      returnResponse: true,
    });

    if (!obj) return;
    const data: Formation[] = obj.data;
    const formations = convert(ModelType.FORMATION, data);

    const filterCondition: FilterableFieldDefinition = {
      key: "_id",
      label: "フォーメーション",
      operator: "equals",
      type: "select",
      value: formations.map((t) => t._id),
      valueLabel: formations.map((t) => createLabel(ModelType.FORMATION, t)),
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
