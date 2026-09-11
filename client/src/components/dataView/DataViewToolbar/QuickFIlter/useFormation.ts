import { API_PATHS, FilterableFieldDefinition } from "@dai0413/myorg-shared";
import { useEffect, useState } from "react";
import { QuickFilterItem } from "../../../../types/table";
import { useDataView } from "../../../../context/dataView-context";
import { readItemsBase } from "../../../../lib/api";
import { api } from "../../../../context/api-context";
import { convert } from "../../../../lib/convert/DBtoGetted";
import { ModelType } from "../../../../types/models";
import { ViewMode } from "../../../../types/types";
import { Formation } from "../../../../types/models/formation";
import { convert as createLabel } from "../../../../lib/convert/CreateLabel";

export const useFormation = (): {
  items: QuickFilterItem[];
  loading: boolean;
} => {
  const { setViewMode, setItemsPerPage } = useDataView();
  const [items, setItems] = useState<QuickFilterItem[]>([]);
  const [loading, setLoading] = useState(true);

  const read = async (): Promise<FilterableFieldDefinition[] | undefined> => {
    const obj = await readItemsBase<Formation[]>({
      apiInstance: api,
      params: { getAll: true },
      backendRoute: API_PATHS.FORMATION.ROOT,
    });

    if (!obj) return;
    const data: Formation[] = obj.data;
    const formations = convert(ModelType.FORMATION, data);

    const filterCondition: FilterableFieldDefinition[] = [
      {
        key: "_id",
        label: "フォーメーション",
        operator: "equals",
        type: "select",
        value: formations.map((t) => t._id),
        valueLabel: formations.map((t) => createLabel(ModelType.FORMATION, t)),
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
            setItemsPerPage(20);
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
