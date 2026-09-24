import { useMemo } from "react";
import { GettedModelDataMap } from "../../types/models";
import { ModelContext } from "../../types/context";
import { useQuery } from "../../context/query-context";
import { normalizeFiltersForApi } from "../../utils/filter/normalizeFiltersForApi";
import { useAlert } from "../../context/alert-context";
import {
  FilterableFieldDefinition,
  SortableFieldDefinition,
} from "@dai0413/myorg-shared";
import {
  getFields,
  getFilterableFields,
  getSortableFields,
} from "../../lib/model-fields";
import { getLinkFields } from "../../lib/model-link-fields";
import { DataViewContainer } from ".";
import { ViewMode } from "../../types/types";

type ModelTableContainerProps<K extends keyof GettedModelDataMap> = {
  title: string;
  modelType: K;
  contextState: ModelContext<K>;
};

const ModelTableContainer = <K extends keyof GettedModelDataMap>({
  title,
  modelType,
  contextState,
}: ModelTableContainerProps<K>) => {
  const { setPage } = useQuery();
  const {
    main: { handleSetAlert },
  } = useAlert();

  const { items, isLoading, totalCount, readItems, uploadFile, downloadFile } =
    contextState.metacrud;

  const headers = useMemo(() => getFields(modelType), [modelType]);
  const filterField = useMemo(
    () => getFilterableFields(modelType),
    [modelType],
  );
  const sortField = useMemo(() => getSortableFields(modelType), [modelType]);
  const linkField = useMemo(() => getLinkFields(modelType), [modelType]);

  const readPage = async (
    page: number,
    filters: FilterableFieldDefinition[],
    sorts: SortableFieldDefinition[],
  ) => {
    setPage("page", page);

    return readItems({
      page,
      filters: JSON.stringify(normalizeFiltersForApi(filters)),
      sorts: JSON.stringify(sorts),
    });
  };

  const handleApplyFilter = async (
    filterConditions: FilterableFieldDefinition[],
    sortConditions: SortableFieldDefinition[],
  ) => {
    handleSetAlert({ success: true, message: "" });
    await readPage(1, filterConditions, sortConditions);
  };

  return (
    <DataViewContainer
      totalCount={totalCount}
      handlePageChange={readPage}
      handleFilterSort={handleApplyFilter}
      title={title}
      modelType={modelType}
      linkField={linkField}
      pageNation="server"
      filterField={filterField}
      sortField={sortField}
      fieldDefinitions={headers}
      items={items}
      itemsLoading={isLoading}
      reloadFun={handleApplyFilter}
      uploadFile={uploadFile}
      downloadFile={downloadFile}
      viewData={{
        [ViewMode.TABLE]: items,
        [ViewMode.TILE]: items,
      }}
    />
  );
};

export default ModelTableContainer;
