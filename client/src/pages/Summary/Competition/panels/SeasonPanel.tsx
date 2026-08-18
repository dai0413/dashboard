import { ModelType } from "../../../../types/models";
import TableClient from "../../../../components/table/TableClient";
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
      season: { text, key, items, reloadFun },
    },
  } = summary;

  return (
    <>
      <div className="text-gray-600">{text}</div>
      <TableClient
        key={key}
        modelType={ModelType.SEASON}
        fieldDefinitions={seasonFieldDefinition}
        pageNum={1}
        items={items}
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
