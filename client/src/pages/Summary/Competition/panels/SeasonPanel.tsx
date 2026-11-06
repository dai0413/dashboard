import { ModelType } from "../../../../types/models";
import { TableClient } from "../../../../components/dataView";
import { convertFieldDefinition } from "../../../../utils/displayField/convertFieldDefinition";
import { isFilterable, isSortable } from "../../../../utils/data-field";
import { UseCompetitionSummary } from "../types";
import { ViewMode } from "../../../../types/types";

const seasonFieldDefinition = convertFieldDefinition({
  keys: ["name", "start_date", "end_date", "current", "note"],
  getFieldsKey: ModelType.SEASON,
});

const StaffRegistrationPanel = ({
  summary,
}: {
  summary: UseCompetitionSummary;
}) => {
  const {
    id,
    panels: {
      season: { isLoading, text, key, items, reloadFun },
    },
  } = summary;

  return (
    <>
      <h2 className="text-base font-semibold text-gray-800">{text}</h2>
      <TableClient
        key={key}
        modelType={ModelType.SEASON}
        itemsLoading={isLoading}
        fieldDefinitions={seasonFieldDefinition}
        viewModes={[ViewMode.TABLE, ViewMode.TILE]}
        viewData={{
          [ViewMode.TABLE]: items,
          [ViewMode.TILE]: items,
        }}
        totalCount={items.length}
        reloadFun={reloadFun}
        filterField={seasonFieldDefinition
          ?.filter(isFilterable)
          .filter((file) => file.key !== "competition")}
        sortField={seasonFieldDefinition
          ?.filter(isSortable)
          .filter((file) => file.key !== "competition")}
        initialData={{
          formData: { competition: id },
          metaData: { competition: id },
        }}
      />
    </>
  );
};

export default StaffRegistrationPanel;
