import {
  FilterableFieldDefinition,
  SortableFieldDefinition,
} from "@dai0413/myorg-shared";

export type TableOperationFields = {
  filterField?: FilterableFieldDefinition[];
  sortField?: SortableFieldDefinition[];
  detailLinkValue?: string | null;
};
