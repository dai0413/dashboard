import { ModelType } from "../../../../../types/models";
import TableClient from "../../../../../components/table/TableClient";
import { convertFieldDefinition } from "../../../../../utils/displayField/convertFieldDefinition";
import { fieldDefinition } from "../../../../../lib/model-fields";
import { isFilterable, isSortable } from "../../../../../types/field";
import { APP_ROUTES } from "../../../../../lib/appRoutes";
import { UseClubTeamSummary } from "../types";
import { InjuryGet } from "../../../../../types/models/injury";

const injuryFieldDefinition = convertFieldDefinition<InjuryGet>(
  ["doa", "player", "injured_part", "ttp"],
  fieldDefinition[ModelType.INJURY],
);

const InjuryPanel = ({ summary }: { summary: UseClubTeamSummary }) => {
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
        modelType={ModelType.INJURY}
        itemsLoading={isLoading}
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
