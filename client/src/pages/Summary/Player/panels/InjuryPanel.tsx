import { ModelType } from "../../../../types/models";
import TableClient from "../../../../components/table/TableClient";
import { convertFieldDefinition } from "../../../../utils/displayField/convertFieldDefinition";
import { fieldDefinition } from "../../../../lib/model-fields";
import { isFilterable, isSortable } from "../../../../types/field";
import { UsePlayerSummary } from "../types";
import { APP_ROUTES } from "../../../../lib/appRoutes";
import { InjuryGet } from "../../../../types/models/injury";

const injuryFieldDefinition = convertFieldDefinition<InjuryGet>(
  ["doa", "team", "injured_part", "ttp"],
  fieldDefinition[ModelType.INJURY],
);

const InjuryPanel = ({ summary }: { summary: UsePlayerSummary }) => {
  const {
    id,
    panels: {
      injury: { text, key, items, reloadFun },
    },
  } = summary;

  return (
    <>
      <div className="text-gray-600">{text}</div>
      <TableClient
        key={key}
        modelType={ModelType.INJURY}
        fieldDefinitions={injuryFieldDefinition}
        pageNum={1}
        items={items}
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
