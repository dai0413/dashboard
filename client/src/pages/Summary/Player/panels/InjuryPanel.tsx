import { ModelType } from "../../../../types/models";
import { TableClient } from "../../../../components/dataView";
import { convertFieldDefinition } from "../../../../utils/displayField/convertFieldDefinition";
import { fieldDefinition } from "../../../../lib/model-fields";
import { isFilterable, isSortable } from "../../../../types/field";
import { UsePlayerSummary } from "../types";
import { APP_ROUTES } from "../../../../lib/appRoutes";
import { InjuryGet } from "../../../../types/models/injury";
import { ViewMode } from "../../../../types/types";

const injuryFieldDefinition = convertFieldDefinition<InjuryGet>(
  ["doa", "team", "injured_part", "ttp"],
  fieldDefinition[ModelType.INJURY],
);

const InjuryPanel = ({ summary }: { summary: UsePlayerSummary }) => {
  const {
    id,
    panels: {
      injury: { isLoading, text, key, items, reloadFun },
    },
  } = summary;

  return (
    <>
      <div className="text-gray-600">{text}</div>
      <TableClient
        key={key}
        itemsLoading={isLoading}
        modelType={ModelType.INJURY}
        fieldDefinitions={injuryFieldDefinition}
        viewModes={[ViewMode.TABLE, ViewMode.TILE]}
        viewData={{ [ViewMode.TABLE]: items, [ViewMode.TILE]: items }}
        totalCount={items.length}
        reloadFun={reloadFun}
        filterField={injuryFieldDefinition
          ?.filter(isFilterable)
          .filter((file) => file.key !== "player")}
        sortField={injuryFieldDefinition
          ?.filter(isSortable)
          .filter((file) => file.key !== "player")}
        linkField={[
          {
            field: "team",
            to: APP_ROUTES.TEAM_SUMMARY,
          },
        ]}
        initialData={{ formData: { player: id } }}
      />
    </>
  );
};

export default InjuryPanel;
