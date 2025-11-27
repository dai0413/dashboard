import { TableWithFetch } from "../components/table";
import { ModelType } from "../types/models";
import { fieldDefinition } from "../lib/model-fields";
import { isFilterable, isSortable } from "../types/field";
import { APP_ROUTES } from "../lib/appRoutes";
import { API_PATHS } from "@myorg/shared";

const j1 = import.meta.env.VITE_J1_ID;
const j2 = import.meta.env.VITE_J2_ID;
const j3 = import.meta.env.VITE_J3_ID;

const competitionParam = [j1, j2, j3].join(",");

const NoNumber = () => {
  return (
    <div className="p-6">
      <TableWithFetch
        title="背番号なし"
        fetch={{
          apiRoute: API_PATHS.AGGREGATE.TRANSFER.NO_NUMBER,
          params: {
            competition: competitionParam,
            endDate: String(new Date()),
          },
        }}
        headers={[
          { label: "加入日", field: "from_date" },
          { label: "選手", field: "player" },
          { label: "移籍先", field: "to_team" },
        ]}
        modelType={ModelType.TRANSFER}
        filterField={fieldDefinition[ModelType.TRANSFER]
          .filter(isFilterable)
          .filter((file) => file.key !== "to_team")}
        sortField={fieldDefinition[ModelType.TRANSFER]
          .filter(isSortable)
          .filter((file) => file.key !== "to_team")}
        linkField={[
          {
            field: "player",
            to: APP_ROUTES.PLAYER_SUMMARY,
          },
          {
            field: "to_team",
            to: APP_ROUTES.TEAM_SUMMARY,
          },
        ]}
        detailLinkValue={APP_ROUTES.NO_NUMBER}
      />
    </div>
  );
};

export default NoNumber;
