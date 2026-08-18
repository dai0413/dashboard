import { ModelType } from "../../../../types/models";
import TableClient from "../../../../components/table/TableClient";
import { convertFieldDefinition } from "../../../../utils/displayField/convertFieldDefinition";
import { fieldDefinition } from "../../../../lib/model-fields";
import { isFilterable, isSortable } from "../../../../types/field";
import { UseCompetitionSummary } from "../types";
import { CompetitionStageGet } from "../../../../types/models/competition-stage";

const competitionStageFieldDefinition =
  convertFieldDefinition<CompetitionStageGet>(
    ["name", "stage_type", "left"],
    fieldDefinition[ModelType.COMPETITION_STAGE],
  );

const CompetitionStagePanel = ({
  summary,
}: {
  summary: UseCompetitionSummary;
}) => {
  const {
    id,
    panels: {
      competitionStage: { isLoading, text, key, items, reloadFun },
    },
  } = summary;

  if (!summary.select) return;

  const { selectedOption } = summary.select;

  return (
    <>
      <div className="text-gray-600">{text}</div>
      <TableClient
        key={key}
        itemsLoading={isLoading}
        modelType={ModelType.COMPETITION_STAGE}
        fieldDefinitions={competitionStageFieldDefinition}
        pageNum={1}
        items={items}
        reloadFun={reloadFun}
        filterField={competitionStageFieldDefinition
          ?.filter(isFilterable)
          .filter((file) => file.key !== "competition")}
        sortField={competitionStageFieldDefinition
          ?.filter(isSortable)
          .filter((file) => file.key !== "competition")}
        initialData={{
          formData: { season: selectedOption?._id },
          metaData: {
            competition: id,
          },
        }}
      />
    </>
  );
};

export default CompetitionStagePanel;
