import { ModelType } from "../../../../types/models";
import TableClient from "../../../../components/table/TableClient";
import { convertFieldDefinition } from "../../../../utils/displayField/convertFieldDefinition";
import { fieldDefinition } from "../../../../lib/model-fields";
import { isFilterable, isSortable } from "../../../../types/field";
import { UseMatchSummary } from "../types";
import { APP_ROUTES } from "../../../../lib/appRoutes";
import { RefereeAppearanceGet } from "../../../../types/models/referee-appearance";

const refereeAppearanceFieldDefinition =
  convertFieldDefinition<RefereeAppearanceGet>(
    ["referee", "role"],
    fieldDefinition[ModelType.REFEREE_APPEARANCE],
  );

const RefereeAppearancePanel = ({ summary }: { summary: UseMatchSummary }) => {
  const {
    id,
    selected,
    panels: {
      refereeAppearance: { isLoading, text, key, items, reloadFun },
    },
  } = summary;

  if (!selected) return;

  return (
    <>
      <div className="text-gray-600">{text}</div>
      <TableClient
        key={key}
        itemsLoading={isLoading}
        modelType={ModelType.REFEREE_APPEARANCE}
        fieldDefinitions={refereeAppearanceFieldDefinition}
        pageNum={1}
        items={items}
        reloadFun={reloadFun}
        filterField={refereeAppearanceFieldDefinition
          ?.filter(isFilterable)
          .filter((file) => file.key !== "match")}
        sortField={refereeAppearanceFieldDefinition
          ?.filter(isSortable)
          .filter((file) => file.key !== "match")}
        linkField={[
          {
            field: "referee",
            to: APP_ROUTES.REFEREE_SUMMARY,
          },
        ]}
        initialData={{
          formData: {
            match: id,
          },
          metaData: {
            match: [id],
            urls: selected.urls,
            competition_stage: selected.competition_stage.id,
          },
        }}
      />
    </>
  );
};

export default RefereeAppearancePanel;
