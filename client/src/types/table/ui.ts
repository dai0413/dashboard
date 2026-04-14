import {
  FilterableFieldDefinition,
  SortableFieldDefinition,
} from "@dai0413/myorg-shared";

export type TableUIProps = {
  itemsPerPage?: number;
  currentPage?: number;
  onPageChange?:
    | ((
        page: number,
        filterConditions: FilterableFieldDefinition[],
        sortConditions: SortableFieldDefinition[],
      ) => Promise<void>)
    | ((
        page: number,
        filterConditions: FilterableFieldDefinition[],
        sortConditions: SortableFieldDefinition[],
      ) => void);
  isLoading?: boolean;
};
