import { ModelType } from "../../../../../types/models";
import TableClient from "../../../../../components/table/TableClient";
import { convertFieldDefinition } from "../../../../../utils/displayField/convertFieldDefinition";
import { fieldDefinition } from "../../../../../lib/model-fields";
import { isFilterable, isSortable } from "../../../../../types/field";
import { APP_ROUTES } from "../../../../../lib/appRoutes";
import { UseClubTeamSummary } from "../types";

const injuryFieldDefinition = convertFieldDefinition<ModelType.INJURY>(
  ["doa", "player", "injured_part", "ttp"],
  fieldDefinition[ModelType.INJURY],
);

const InjuryPanel = ({ summary }: { summary: UseClubTeamSummary }) => {
  const {
    id,
    injury: { text, key, items, reloadFun },
  } = summary;

  return (
    <>
      <div className="text-gray-600">{text}</div>
      <TableClient
        key={key}
        modelType={ModelType.TRANSFER}
        fieldDefinitions={injuryFieldDefinition}
        pageNum={1}
        items={items}
        reloadFun={reloadFun}
        filterField={injuryFieldDefinition
          ?.filter(isFilterable)
          .filter((file) => file.key !== "team")}
        sortField={injuryFieldDefinition
          ?.filter(isSortable)
          .filter((file) => file.key !== "team")}
        initialData={{ formData: { team: id } }}
        linkField={[
          {
            field: "player",
            to: APP_ROUTES.PLAYER_SUMMARY,
          },
        ]}
      />
    </>
  );
};

export default InjuryPanel;
