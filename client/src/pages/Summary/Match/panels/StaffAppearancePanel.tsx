import { ModelType } from "../../../../types/models";
import { TableClient } from "../../../../components/dataView";
import { convertFieldDefinition } from "../../../../utils/displayField/convertFieldDefinition";
import { isFilterable, isSortable } from "../../../../types/field";
import { UseMatchSummary } from "../types";
import { APP_ROUTES } from "../../../../lib/appRoutes";
import { ViewMode } from "../../../../types/types";

const staffAppearanceFieldDefinition = convertFieldDefinition({
  keys: ["team", "staff", "role"],
  getFieldsKey: ModelType.STAFF_APPEARANCE,
});

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
      <h2 className="text-base font-semibold text-gray-800">{text}</h2>
      <TableClient
        key={key}
        itemsLoading={isLoading}
        modelType={ModelType.STAFF_APPEARANCE}
        fieldDefinitions={staffAppearanceFieldDefinition}
        viewModes={[ViewMode.TABLE, ViewMode.TILE]}
        viewData={{ [ViewMode.TABLE]: items, [ViewMode.TILE]: items }}
        totalCount={items.length}
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
