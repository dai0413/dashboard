import { ModelType } from "../../../../types/models";
import TableClient from "../../../../components/table/TableClient";
import { convertFieldDefinition } from "../../../../utils/displayField/convertFieldDefinition";
import { fieldDefinition } from "../../../../lib/model-fields";
import { isFilterable, isSortable } from "../../../../types/field";
import { UseMatchSummary } from "../types";
import { APP_ROUTES } from "../../../../lib/appRoutes";
import { StaffAppearanceGet } from "../../../../types/models/staff-appearance";

const staffAppearanceFieldDefinition =
  convertFieldDefinition<StaffAppearanceGet>(
    ["team", "staff", "role"],
    fieldDefinition[ModelType.STAFF_APPEARANCE],
  );

const StaffAppearancePanel = ({ summary }: { summary: UseMatchSummary }) => {
  const {
    id,
    selected,
    panels: {
      staffAppearance: { isLoading, text, key, items, reloadFun },
    },
  } = summary;

  if (!selected) return;

  return (
    <>
      <div className="text-gray-600">{text}</div>
      <TableClient
        key={key}
        itemsLoading={isLoading}
        modelType={ModelType.STAFF_APPEARANCE}
        fieldDefinitions={staffAppearanceFieldDefinition}
        pageNum={1}
        items={items}
        reloadFun={reloadFun}
        filterField={staffAppearanceFieldDefinition
          ?.filter(isFilterable)
          .filter((file) => file.key !== "match")}
        sortField={staffAppearanceFieldDefinition
          ?.filter(isSortable)
          .filter((file) => file.key !== "match")}
        linkField={[
          {
            field: "staff",
            to: APP_ROUTES.STAFF_SUMMARY,
          },
        ]}
        initialData={{
          formData: {
            match: id,
          },
          metaData: {
            match: [id],
            urls: selected.urls,
            date: selected.date,
            season: selected.season.id,
            competition_stage: selected.competition_stage.id,
          },
        }}
      />
    </>
  );
};

export default StaffAppearancePanel;
