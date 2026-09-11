import { ModelType } from "../../../../types/models";
import { TableClient } from "../../../../components/dataView";
import { convertFieldDefinition } from "../../../../utils/displayField/convertFieldDefinition";
import { fieldDefinition } from "../../../../lib/model-fields";
import { isFilterable, isSortable } from "../../../../types/field";
import { UseCompetitionSummary } from "../types";
import { SeasonGet } from "../../../../types/models/season";

const seasonFieldDefinition = convertFieldDefinition<SeasonGet>(
  ["name", "start_date", "end_date", "current", "note"],
  fieldDefinition[ModelType.SEASON],
);

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
      <div className="text-gray-600">{text}</div>
      <TableClient
        key={key}
        modelType={ModelType.SEASON}
        itemsLoading={isLoading}
        fieldDefinitions={seasonFieldDefinition}
        items={items}
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
