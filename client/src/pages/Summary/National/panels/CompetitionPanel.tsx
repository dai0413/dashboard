import { ModelType } from "../../../../types/models";
import TableClient from "../../../../components/table/TableClient";
import { convertFieldDefinition } from "../../../../utils/displayField/convertFieldDefinition";
import { fieldDefinition } from "../../../../lib/model-fields";
import { isFilterable, isSortable } from "../../../../types/field";
import { UseNationalSummary } from "../types";
import { APP_ROUTES } from "../../../../lib/appRoutes";

const competitionFieldDefinition =
  convertFieldDefinition<ModelType.COMPETITION>(
    ["name", "competition_type", "category", "age_group"],
    fieldDefinition[ModelType.COMPETITION],
  );

const CompetitionPanel = ({ summary }: { summary: UseNationalSummary }) => {
  const {
    id,
    panels: {
      competition: { text, key, items, reloadFun },
    },
  } = summary;

  return (
    <>
      <div className="text-gray-600">{text}</div>
      <TableClient
        key={key}
        modelType={ModelType.COMPETITION}
        fieldDefinitions={competitionFieldDefinition}
        pageNum={1}
        items={items}
        reloadFun={reloadFun}
        filterField={competitionFieldDefinition
          ?.filter(isFilterable)
          .filter((file) => file.key !== "country")}
        sortField={competitionFieldDefinition
          ?.filter(isSortable)
          .filter((file) => file.key !== "country")}
        initialData={{
          formData: {
            country: id,
          },
        }}
        linkField={[
          {
            field: "name",
            to: APP_ROUTES.COMPETITION_SUMMARY,
          },
        ]}
      />
    </>
  );
};

export default CompetitionPanel;
