import { useEffect, useMemo, useState } from "react";
import CustomTableContainer, {
  TableContainerProps,
} from "./CustomTableContainer";
import {
  FilterableFieldDefinition,
  SortableFieldDefinition,
} from "@dai0413/myorg-shared";
import { applyFilterClient } from "../../utils/filter/applyFilterClient";
import { applySortClient } from "../../utils/sort/applySortClient";
import { Data } from "../../types/types";

export const trimFilterKey = (
  fieldDefinitions: FilterableFieldDefinition[],
): FilterableFieldDefinition[] => {
  return fieldDefinitions.map((field) => ({
    ...field,
    key: field.key?.split(".")[0],
    filterKey: field.key?.split(".")[0],
  }));
};

export const trimSortKey = (
  fieldDefinitions: SortableFieldDefinition[],
): SortableFieldDefinition[] => {
  return fieldDefinitions.map((field) => ({
    ...field,
    key: field.key?.split(".")[0],
    filterKey: field.key?.split(".")[0],
  }));
};

const defalut = {
  data: [],
  page: 1,
  totalCount: 0,
  isLoading: false,
};

const TableClient = <
  K extends Record<string, any>,
  F extends Record<string, any>,
>(
  props: TableContainerProps<K, F>,
) => {
  const [viewOptionData, setViewOptionData] = useState<Data<any>>(defalut);

  useEffect(() => {
    if (!props.items) return;
    setViewOptionData({ ...defalut, data: props.items });
  }, [props.items]);

  const reloadFun = useMemo(
    () =>
      async (
        _filterConditions: FilterableFieldDefinition[],
        _sortConditions: SortableFieldDefinition[],
      ) => {
        const newFilterConditions = props.filterField
          ? props.filterField.filter((f) => !!f.value)
          : null;

        if (!props.reloadFun || !newFilterConditions) return;
        props.reloadFun(newFilterConditions, []);
      },
    [props.reloadFun],
  );

  const handleFilterSort = useMemo(
    () =>
      async (
        filterConditions?: FilterableFieldDefinition[],
        sortConditions?: SortableFieldDefinition[],
      ): Promise<void> => {
        if (!props.items) return;

        setViewOptionData({ ...defalut, isLoading: true });

        let processed = [...props.items];

        processed = applyFilterClient(
          processed,
          "label",
          trimFilterKey(filterConditions || []),
        );
        processed = applySortClient(
          processed,
          "label",
          trimSortKey(sortConditions || []),
        );

        const nextViewOptionData = {
          data: processed,
          page: 1,
          totalCount: processed.length,
          isLoading: false,
        };

        setViewOptionData(nextViewOptionData);
      },
    [props.items],
  );

  return (
    <CustomTableContainer
      {...{
        ...props,
        handleFilterSort: handleFilterSort,
        items: viewOptionData.data,
        totalCount: viewOptionData.totalCount,
        reloadFun: reloadFun,
        pageNation: "client",
      }}
    />
  );
};

export default TableClient;
